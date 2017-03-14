import { Component } from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {WindowRef} from '../lib/windowRef';
import {XmppWebsocket} from '../lib/xmpp-websocket';
import { rmxUtils } from '../lib/xmpp-rmx-utils';
import { rmxMsg } from '../lib/xmpp-rmx-message';
import { rmxIntf } from '../lib/xmpp-rmx-interfaces';

///   ..................................................................................................................
///   ..................................................................................................................
///   ..................................................................................................................
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public static webBroketUrl: string;
  public isDarkTheme = false;
  public IID: string;
  public PrivateKey: string;
  public D1: Date = null;
  public D2: Date = null;

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

  /// ..................................................................................................................
  /**
   * TODO What to do with html response
   * @param res
   * @returns {string|{}}
   */
  private static extractData(res: Response) {
    const body = res.text();
    // console.log(body);
    return body || { };
  }

  /**
   * TODO What to do with html error response
   * @param error
   * @returns {any}
   */
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

  /// ..................................................................................................................
  /**
   *
   * @param winRef
   * @param http
   * @param xmpp
   * @returns {any}
   */
  constructor(private winRef: WindowRef, private http: Http, private xmpp: XmppWebsocket) {
    console.log('App Create');
    this.loadArgs();
    this.xmpp.init();
    xmpp.connectionStatus.subscribe((isConnected: number) => {
      // show somewhere . lock gui if isConnected not 4 ?
      console.log(isConnected, XmppWebsocket.statusDesc[isConnected]);
      if (isConnected !== 4) {
        this.showError('Wait XMPP ! ' + isConnected.toString());
      } else {
        this.showError('OK');
        }
    });

    xmpp.subscribe(
      (message) => {
        // console.log('Message',message);
        if (message.isValid) {this.showMessage(message); } else {this.showErrorMessage(message); }
        },
      (error) => {
        console.log('Error', error);
        this.showError(error);
        },
      () => {
        console.log('xmpp bye bye');
        this.showError('xmpp:Closed');
        }
      );
    }

  /// ..................................................................................................................
  /**
   * Load command line args prepared in electron main
   */
  private loadArgs() {
  try {
      this.IID = 'cdecu';
      this.PrivateKey = '';
      AppComponent.webBroketUrl = 'http://vpn.restomax.com:8080/';
      const sharedObj = this.winRef.nativeWindow.require('electron').remote.getGlobal('sharedObj');
      this.IID = sharedObj.iid;
      this.PrivateKey = sharedObj.pk;
      //= 'http://vpn.restomax.com:8080/';
      // const rptUrl = 'http://localhost:8080/view';
      // const rptUrl = 'http://10.0.0.69:8080/view';
  } catch (err) {
      // just ignore
  }   }
  /// ..................................................................................................................
  /**
   *
   * @param message
   */
  private showMessage(message: rmxIntf.IxmppRmxMessage) {
    console.log('showMessage', message);
    this.currentRpt.loaded  = 2;
    this.currentRpt.content = message.data;
    this.bgURL              = `${AppComponent.webBroketUrl}Image?Image=200&IID=${this.IID}&staff=221266`;
  }
  /// ..................................................................................................................
  /**
   *
   * @param message
   */
  private showErrorMessage(message: rmxIntf.IxmppRmxMessage) {
    console.log('showErrorMessage', message);
    this.currentRpt.loaded  = 2;
    this.currentRpt.content = message.data;
    this.bgURL              = null;
  }
  /// ..................................................................................................................
  /**
   *
   * @param error
   */
  private showError(error: string) {
    console.log('showError', error);
    this.currentRpt.loaded  = 0;
    this.currentRpt.error   = error;
    this.bgURL              = null;
  }
  /// ..................................................................................................................
  private assignHttpRequesParams(params) {
    params.set('view', this.Rpt.name);
    params.set('staff', '221266');
    params.set('IID', this.IID);
    params.set('PK',  this.PrivateKey);
    params.set('GUID', '123');
    params.set('fmt', this.Format.name );
    params.set('D1', rmxUtils.dte2YYYYMMDD(this.D1));
    params.set('D2', rmxUtils.dte2YYYYMMDD(this.D2));
    }
  /**
   *
   * @returns {string}
   */
  private assignXmppRequesParams(): string {
    let data = rmxMsg.XmppRmxMessageOut.addParam('IID', this.IID);
    data += rmxMsg.XmppRmxMessageOut.addParam('Staff', '221266');
    data += rmxMsg.XmppRmxMessageOut.addParam('PK', this.PrivateKey);
    data += rmxMsg.XmppRmxMessageOut.addParam('Param', this.Rpt.name);
    data += rmxMsg.XmppRmxMessageOut.addParam('Fmt', this.Format.name);
    // console.log(this.D1);
    // console.log(this.D2);
    data += rmxMsg.XmppRmxMessageOut.addPeriodeParam('D1', this.D1, 'D2', this.D2);
    // console.log(data);
    return data;
    }
  /// ..................................................................................................................
  /**
   *
   */
  public clearRpt() {
    this.currentRpt.loaded = 0;
    this.bgURL = null;
  }
  /**
   *
   */
  public sayHelo() {
    console.log('Send xmpp Helo Message to MySelf');
    this.xmpp.sendMsg('', 'HELO', '<P:006.000021><C:HELO><M:' + Date.now().toString() + '>');
    }
  /// ..................................................................................................................
  /**
   *
   */
  public xmppGetRpt(): void {
    if (this.currentRpt.loaded === 1) {
      console.log('Please wait');
      return;
      }
    console.log('Send xmpp Message');
    this.currentRpt.loaded = 1;
    const data = this.assignXmppRequesParams();
    this.xmpp.sendMsg2Mediator('ASK_VIEW', data);
    }
  /// ..................................................................................................................
  /**
   * httpFetchRpt >> httpGetRpt >> Observable extractData|handleError
   * @returns {Observable<string>}
   */
  public httpGetRpt (): Observable<string> {
    const rptUrl: string = AppComponent.webBroketUrl + 'view';
    const params = new URLSearchParams();
    this.assignHttpRequesParams(params);
    return this.http.get(rptUrl, {search: params} )
      .map(AppComponent.extractData)
      .catch(AppComponent.handleError);
  }
  /// ..................................................................................................................
  /**
   * httpFetchRpt >> httpGetRpt >> Observable extractData|handleError
   */
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
