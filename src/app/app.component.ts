///<reference path="../lib/xmpp-websocket.ts"/>
import { Component } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {XmppWebsocket} from '../lib/xmpp-websocket';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isDarkTheme = false;
  public IID = 'cdecu';
  public PrivateKey = '1611041114';
  public D1 = '20160101'; // new Date('2009/01/01');
  public D2 = '20160131'; // new Date('2009/01/01');

  public Rpts: any[] = [
    {name: '010', descr: 'ModePays'},
    {name: '011', descr: 'Jours'},
    {name: '012', descr: 'Days'},
    {name: '013', descr: '013'},
    {name: '014', descr: '014'},
    {name: 'Cloture', descr: 'Cloture'},
  ];
  public Rpt = {name: '010', descr: 'ModePays'};

  public Formats: any[] = [
    {name: 'TEXT', descr: 'Text'},
    {name: 'XML', descr: 'Xml'},
    {name: 'JSON', descr: 'Json'},
    ];
  public Format = {name: 'TEXT', descr: 'Text'};

  public currentRpt = {loaded: 0, name: 'Test', params: 'NoParams', error: 'Not Loaded', content: 'NoContent'};
  public bgURL: string = null;

  constructor(private http: Http, private xmpp: XmppWebsocket<string>) {
    console.log('App Create');
    xmpp.connectionStatus.subscribe((isConnected: number) => {
      const x = {'-9': 'Error'
        , '-1': 'AuthError'
        , '0': 'Disconnected'
        , '1': 'Connected'
        , '2': 'Session Started'
        , '3': 'Wait Mediator'
        , '4': 'Mediator OK'
        };
      console.log(isConnected, x[isConnected]);
      });
    xmpp.subscribe(
      (message) => {
        console.log(message);
        this.currentRpt.content = message;
        this.currentRpt.loaded = 2;
        this.bgURL             = 'http://10.0.0.69:8080/Image?Image=200&IID=' + this.IID + '&staff=221266';
        },
      (error) => { console.log(error); },
      () => { console.log('xmpp:Closed'); }
      );
    }

  clearRpt() {
    this.currentRpt.loaded = 0;
    this.bgURL = null;
    }

  private assignParams(params) {
    params.set('view', this.Rpt.name);
    params.set('staff', '221266');
    params.set('IID', this.IID);
    params.set('PK',  this.PrivateKey);
    params.set('GUID', '123');
    params.set('fmt', this.Format.name );
    params.set('D1', this.D1);
    params.set('D2', this.D2);
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

  getRpt (): Observable<string> {
    // let rptUrl: string = 'http://vpn.restomax.com:8080/view';
    // const rptUrl = 'http://localhost:8080/view';
    const rptUrl = 'http://10.0.0.69:8080/view';
    const params = new URLSearchParams();
    this.assignParams(params);
    return this.http.get(rptUrl, {search: params} )
      .map(AppComponent.extractData)
      .catch(AppComponent.handleError);
  }

  fetchRpt( ): void {
    if (this.currentRpt.loaded === 1) {
      console.log('Please wait');
      return;
    } else {
      this.currentRpt.loaded = 1;
      this.getRpt()
        .subscribe(
          Rpt => {
            this.currentRpt.content = Rpt;
            this.currentRpt.loaded = 2;
            this.bgURL              = 'http://10.0.0.69:8080/Image?Image=200&IID=' + this.IID + '&staff=221266';
          },
          error => {
            this.currentRpt.error = <any>error;
            this.currentRpt.loaded = 0;
          }
        );
    } }

  xmppRpt(): void {
    if (this.currentRpt.loaded === 1) {
      console.log('Please wait');
      return;
      }
    console.log('Subscribe to xmpp');
    this.currentRpt.loaded = 1;
    this.xmpp.send(`<IID:${this.IID}><Staff:221266><PK:${this.PrivateKey}><Q:102><Param:${this.Rpt.name}><Fmt:TEXT><D1:2016-01-01><D2:2016-01-31>"`);
    }

}
