import {Component, ChangeDetectorRef, ChangeDetectionStrategy, OnInit} from '@angular/core';
import { Http, URLSearchParams, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';
import {XmppWebsocket} from 'rmx.xmpp.utils/src/xmpp-websocket';
import {rmxUtils} from 'rmx.xmpp.utils/src/xmpp-rmx-utils';
import {rmxMsg} from 'rmx.xmpp.utils/src/xmpp-rmx-message';
import {rmxIntf} from 'rmx.xmpp.utils/src/xmpp-rmx-interfaces';
import {WindowRef} from './windowRef';
import {AppService} from './app.service';

///   ..................................................................................................................
///   ..................................................................................................................
///   ..................................................................................................................
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnInit {

  public static webBroketUrl = 'http://vpn.restomax.com:8080/';
  public static xmppParams = {
    jid: 'carlos-xe7@vpn.restomax.com',
    password: 'carlos-xe7',
    resource: 'testX' + Math.random().toString(36).substring(7),
    transport: 'websocket',
    server: 'vpn.restomax.com',
    wsURL: 'ws://vpn.restomax.com:7070/ws/',
    sasl: ['digest-md5', 'plain'],
    };
  public IID = 'cdecu';
  public PrivateKey = '';
  public D1: Date = new Date();
  public D2: Date;

  public Rpt = {name: '010', descr: 'ModePays'};
  public Format = {name: 'TEXT', descr: 'Text'};

  public status = 0;
  public statusMsg = 'Loading ...';
  public answerMsg : rmxIntf.IxmppRmxMessageIn;
  public answerError = 'Loading ...';
  public bgURL?: string;

  /// ..................................................................................................................
  /**
   *
   * @param app
   * @param cd
   * @param winRef
   * @param http
   * @param xmpp
   * @returns {any}
   */
  constructor(private app: AppService, private cd: ChangeDetectorRef, private winRef: WindowRef, private http: Http, private xmpp: XmppWebsocket) {
    console.log('App Create');
    this.loadArgs();
    }
  /// ..................................................................................................................
  /**
   * Load command line args prepared in electron main
   */
  private loadArgs() {
    try {
      const sharedObj = this.winRef.nativeWindow.require('electron').remote.getGlobal('sharedObj');
      AppComponent.webBroketUrl = sharedObj.webBroketUrl || AppComponent.webBroketUrl;
      this.IID        = sharedObj.iid || this.IID;
      this.PrivateKey = sharedObj.pk  || this.PrivateKey;
    } catch (err) {
      // just ignore
    }   }
  /// ..................................................................................................................
  ngOnInit(): void {
    this.xmpp.init(AppComponent.xmppParams);

    this.xmpp.connectionStatus.subscribe((isConnected: number) => {
      // show somewhere . lock gui if isConnected not 4 ?
      console.log(isConnected, XmppWebsocket.statusDesc[isConnected]);
      if (isConnected !== 4) {
        this.showError('Wait XMPP ! ' + isConnected.toString());
      } else {
        this.showError('OK');
        }
      });

    this.xmpp.subscribe(
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
   *
   * @param message
   */
  private showWait(message: string) {
    console.log('showWait', message);
    this.status      = 1;
    this.statusMsg   = message;
    this.answerError = undefined;
    this.answerMsg   = undefined;
    this.cd.markForCheck();
  }
  /// ..................................................................................................................
  /**
   *
   * @param message
   */
  private showMessage(message: rmxIntf.IxmppRmxMessageIn) {
    console.log('showMessage', message);
    this.status      = 2;
    this.statusMsg   = 'Answered';
    this.answerError = undefined;
    this.answerMsg   = message;
    this.bgURL       = `${AppComponent.webBroketUrl}Image?Image=200&IID=${this.IID}&staff=221266`;
    console.log(`${AppComponent.webBroketUrl}Image?Image=200&IID=${this.IID}&staff=221266`);
    this.cd.markForCheck();
    }
  /// ..................................................................................................................
  /**
   *
   * @param message
   */
  private showErrorMessage(message: rmxIntf.IxmppRmxMessageIn) {
    console.log('showErrorMessage', message);
    this.status      = 0;
    this.statusMsg   = 'Error';
    this.answerError = message.data || 'No Answer';
    this.answerMsg   = undefined;
    this.bgURL       = `${AppComponent.webBroketUrl}Image?Image=200&IID=${this.IID}&staff=221266`;
    this.cd.markForCheck();
    }
  /// ..................................................................................................................
  /**
   *
   * @param error
   */
  private showError(error: string) {
    console.log('showError', error);
    this.status      = 0;
    this.statusMsg   = 'Error';
    this.answerError = error;
    this.answerMsg   = undefined;
    this.bgURL       = undefined;
    this.cd.markForCheck();
    }
  /// ..................................................................................................................
  /**
   *
   */
  public clearRpt() {
    console.log('clearRpt');
    this.status      = 0;
    this.statusMsg   = 'Not Loaded';
    this.answerError = 'Not Loaded';
    this.answerMsg   = undefined;
    this.bgURL       = undefined;
    this.cd.markForCheck();
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
  public sayHelo() {
    this.showWait('Send xmpp Helo Message to MySelf !');
    this.xmpp.sendMsg('', 'HELO', '<P:005.000521><C:HELO><M:' + Date.now().toString() + '>');
    }
  /// ..................................................................................................................
  /**
   *
   */
  public xmppGetRpt(): void {
    if (this.status === 1) {
      console.log('Please wait');
      return;
      }
    console.log('Send xmpp Message');
    const data = this.assignXmppRequesParams();
    this.xmpp.sendMsg2Mediator('ASK_VIEW', data);
    this.showWait('Wait Rpt ' + this.Rpt.name);
    }
  /// ..................................................................................................................
  /**
   * httpFetchRpt >> httpGetRpt >> Observable extractData|handleError
   */
  httpFetchRpt( ): void {
    if (this.status === 1) {
      console.log('Please wait');
      return;
      }
    this.httpGetRpt().subscribe(
        Rpt => this.showMessage(Rpt),
        error => this.showError(error)
        );
    this.showWait('Wait Rpt ' + this.Rpt.name);
    }
  /// ..................................................................................................................
  /**
   * httpFetchRpt >> httpGetRpt >> Observable extractData|handleError
   * @returns {Observable<string>}
   */
  public httpGetRpt (): Observable<rmxIntf.IxmppRmxMessageIn> {
    const rptUrl: string = AppComponent.webBroketUrl + 'view';
    const params = new URLSearchParams();
    this.assignHttpRequesParams(params);
    return this.http.get(rptUrl, {search: params})
      .map(AppComponent.extractData)
      .catch(AppComponent.handleError);
    }
  /// ..................................................................................................................
  /**
   * TODO What to do with html response
   * @param res
   * @returns {string|{}}
   */
  private static extractData(res: Response) : rmxIntf.IxmppRmxMessageIn {
    // console.log(res);
    const body = res.text();
    const msg = new rmxMsg.XmppRmxMessageIn('');
    // get Fmt from Response Headers !
    msg.dataFmt = 'XML';
    msg.data = body;
    return msg;
  }

  /**
   * TODO What to do with html error response
   * @param error
   * @returns {any}
   */
  private static handleError (error: Response | any) {
    let errMsg: string;
    console.error(error);
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

}
