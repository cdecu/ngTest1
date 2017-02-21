import {XmppRmx} from './xmpp-rmx-interfaces';

///   ..................................................................................................................
///   ..................................................................................................................
///   ..................................................................................................................
/**
 * XmppRmxMessage
 */
export class XmppRmxMessage implements XmppRmx.IxmppRmxMessage {

  private static reSplit   = /(<)([^?>]*)(>)/g;
  private static reXMLData = /<\?TXT>|<\?JSON>|<\?XML>/i;

  public from: string;
  public cmd: string;
  public to: string;
  public isValid: boolean;
  public dataFmt: string;
  public data: string;
  public params    = {};
  public rawparams = {};

  /// ..................................................................................................................
  /**
   * constructor
   * @param rawMessage
   */
  constructor(rawMessage: string) {
    this.parse(rawMessage);
  }

  /// ..................................................................................................................
  /**
   * parse rawMessage <x><x><x>....<?xxx>yyyyy
   * @param rawMessage
   * @returns {boolean}
   */
  public parse(rawMessage: string): boolean {

    this.from      = null;
    this.cmd       = null;
    this.to        = null;
    this.params    = {};
    this.rawparams = {};

    this.dataFmt = null;
    this.data    = null;

    this.isValid = false;

    if (!rawMessage || 0 === rawMessage.length) {
      this.data = 'Empty Msg';
      return false;
    }

    let match = XmppRmxMessage.reXMLData.exec(rawMessage);
    if (match) {
      this.dataFmt = rawMessage.substr(match.index + 2, match[0].length - 3);
      this.data    = rawMessage.substr(match.index + match[0].length);
      rawMessage   = rawMessage.substr(0, match.index);
    }

    // To use RegEx group[2] (<)(data)(>)
    if (match = XmppRmxMessage.reSplit.exec(rawMessage)) {
      this.to = match[2].toLowerCase();
    } else {
      this.data = 'Missing Msg <To>';
      return false;
    }

    // Cmd
    if (match = XmppRmxMessage.reSplit.exec(rawMessage)) {
      this.cmd = match[2].toUpperCase();
    } else {
      this.data = 'Missing Msg <cmd>';
      return false;
    }

    // From
    if (match = XmppRmxMessage.reSplit.exec(rawMessage)) {
      this.from = match[2].toLowerCase();
    } else {
      this.data = 'Missing Msg <From>';
      return false;
    }

    // Misc Params key:value
    let cnt = 0;
    while (match = XmppRmxMessage.reSplit.exec(rawMessage)) {
      const s = match[2].indexOf(':');
      if (s >= 1) {
        const key = match[2].substr(0, s);
        this.params[key] = match[2].substr(s + 1);
      } else {
        const key = (cnt++).toString();
        this.rawparams[key] = match[2];
      }
    }

    if (this.cmd === 'ERROR') {
      //console.log(this.params)
      this.data = this.data || 'Error : ' + this.params['M'] + ' Code : ' + this.params['E'];
      this.dataFmt = 'TXT';
      this.isValid = false;
      return this.isValid;
      }

    this.isValid = true;
    return this.isValid;
  };
}

///   ..................................................................................................................
///   ..................................................................................................................
///   ..................................................................................................................
/**
 * XmppRmxMessageOut
 */
export class XmppRmxMessageOut implements XmppRmx.IxmppRmxMessageOut {

  public to: string;
  public body: string;

  public static addParam(key: string, val: string): string {
    return '<' + key + ':' + val + '>';
    }

  public buildMediatorHelo(Mediator: any, My: string): void {

    // send helo to ALL mediator
    this.to  = 'mediator@vpn.restomax.com';

    this.body = '<';
    this.body += (Mediator ? Mediator.bare : 'mediator') + '>';
    this.body += '<MEDIATOR_HELO>';
    this.body += '<' + My + '>';
    }

  public buildMediatorCmd(Mediator: any, Cmd: string, My: string): void {

    // send cmd to MY mediator
    this.to   = (Mediator ? Mediator.full : 'mediator@vpn.restomax.com');

    this.body = '<';
    this.body += (Mediator ? Mediator.bare : 'mediator') + '>';
    this.body += '<' + (Cmd ? Cmd : 'ASK_VIEW') + '>';
    this.body += '<' + My + '>';
  }
}

