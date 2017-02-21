///<reference path="../lib/xmpp-websocket.ts"/>
import { Component } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {XmppWebsocket} from '../lib/xmpp-websocket';
import {XmppRmx} from '../lib/xmpp-rmx-interfaces';
import {XmppRmxMessageOut} from '../lib/xmpp-rmx-message';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public static webBroketUrl = 'http://vpn.restomax.com:8080/';
  // const rptUrl = 'http://localhost:8080/view';
  //const rptUrl = 'http://10.0.0.69:8080/view';

  public isDarkTheme = false;
  public IID = 'cdecu';
  public PrivateKey = '1611041114';
  public D1 = '2016-01-01'; // new Date(2009/01/01);
  public D2 = '2016-01-31';
  //public D2 = new Date('2016-01-31');

  public Rpts = [
    {name: '010', descr: 'ModePays'},
    {name: '011', descr: 'Jours'},
    {name: '012', descr: 'Days'},
    {name: '013', descr: '013'},
    {name: '014', descr: '014'},
    {name: '041', descr: '041'},
    {name: 'Cloture', descr: 'Cloture'},
    ];
  public Rpt = {name: '010', descr: 'ModePays'};
  public Formats = [
    {name: 'TEXT', descr: 'Text'},
    {name: 'XML', descr: 'Xml'},
    {name: 'JSON', descr: 'Json'},
    ];
  public Format = {name: 'TEXT', descr: 'Text'};

  public currentRpt = {loaded: 0, name: 'Test', params: 'NoParams', error: 'Not Loaded', content: 'NoContent'};
  public bgURL: string = null;

  constructor(private http: Http, private xmpp: XmppWebsocket) {
    console.log('App Create');
    xmpp.connectionStatus.subscribe((isConnected: number) => {
      // show somewhere . lock gui if isConnected not 4 ?
      console.log(isConnected, XmppWebsocket.statusDesc[isConnected]);
      });
    xmpp.subscribe(
      (message) => { if (message.isValid) {this.showMessage(message); } else {this.showErrorMessage(message); }},
      (error) => this.showError(error),
      () => this.showError('xmpp:Closed')
      );
    }

  private showMessage(message: XmppRmx.IxmppRmxMessage) {
    this.currentRpt.loaded  = 2;
    this.currentRpt.content = message.data;
    this.bgURL              = AppComponent.webBroketUrl + 'Image?Image=200&IID=' + this.IID + '&staff=221266';
  }
  private showErrorMessage(message: XmppRmx.IxmppRmxMessage) {
    this.currentRpt.loaded  = 0;
    this.currentRpt.error   = message.data;
    this.bgURL              = null;
  }
  private showError(error: any) {
    this.currentRpt.loaded  = 0;
    this.currentRpt.error   = error;
    this.bgURL              = null;
  }

  //private static yyyymmdd = function(d:Date): number{
  //  var yyyy = d.getFullYear();
  //  var mm = d.getMonth() < 9 ? (d.getMonth() + 1) : (d.getMonth() + 1);
  //  var dd  = d.getDate() < 10 ? d.getDate() : d.getDate();
  //  return yyyy*10000+mm*100+dd;
  //  }
  private assignHttpRequesParams(params) {
    params.set('view', this.Rpt.name);
    params.set('staff', '221266');
    params.set('IID', this.IID);
    params.set('PK',  this.PrivateKey);
    params.set('GUID', '123');
    params.set('fmt', this.Format.name );
    params.set('D1', this.D1);
    params.set('D2', this.D2);
    //params.set('D2', AppComponent.yyyymmdd(this.D2));
    }

  private assignXmppRequesParams(): string {
    let data = XmppRmxMessageOut.addParam('IID', this.IID);
    data += XmppRmxMessageOut.addParam('Staff', '221266');
    data += XmppRmxMessageOut.addParam('PK', this.PrivateKey);
    data += XmppRmxMessageOut.addParam('Q', '102');
    data += XmppRmxMessageOut.addParam('Param', this.Rpt.name);
    data += XmppRmxMessageOut.addParam('Fmt', this.Format.name);
    data += XmppRmxMessageOut.addParam('D1', this.D1);
    data += XmppRmxMessageOut.addParam('D2', this.D2);
    //data += XmppRmxMessageOut.addParam('D2',AppComponent.yyyymmdd(this.D2).toString());
    return data;
    }

  private static extractData(res: Response) {
    const body = res.text();
    // console.log(body);
    return body || { };
    }

  private static handleError (error: Response | any) {
    let errMsg: string;
    // console.error(error);
    if (error instanceof Response) {
      const body = error.json() || '';
      const err = body.error || JSON.stringify(body);
      errMsg = `Error ${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return Observable.throw(errMsg);
  }

  public clearRpt() {
    this.currentRpt.loaded = 0;
    this.bgURL = null;
  }

  public xmppGetRpt(): void {
    if (this.currentRpt.loaded === 1) {
      console.log('Please wait');
      return;
      }
    console.log('Send xmpp Message');
    this.currentRpt.loaded = 1;
    const data = this.assignXmppRequesParams();
    this.xmpp.sendMsg('ASK_VIEW', data);
    }

  public httpGetRpt (): Observable<string> {
    const rptUrl: string = AppComponent.webBroketUrl + 'view';
    const params = new URLSearchParams();
    this.assignHttpRequesParams(params);
    return this.http.get(rptUrl, {search: params} )
      .map(AppComponent.extractData)
      .catch(AppComponent.handleError);
  }

  httpFetchRpt( ): void {
    if (this.currentRpt.loaded === 1) {
      console.log('Please wait');
      return;
    } else {
      this.currentRpt.loaded = 1;
      this.httpGetRpt()
        .subscribe(
          Rpt => {
            this.currentRpt.content = Rpt;
            this.currentRpt.loaded = 2;
            this.bgURL = AppComponent.webBroketUrl + 'Image?Image=200&IID=' + this.IID + '&staff=221266';
          },
          error => {
            this.currentRpt.error = <any>error;
            this.currentRpt.loaded = 0;
          }
        );
    } }

}
