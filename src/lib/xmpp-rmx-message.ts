import {XmppRmx} from './xmpp-rmx-interfaces';

export class XmppRmxMessage implements XmppRmx.IxmppRmxMessage {

  public from: string;
  public cmd: string;
  public to: string;
  public xml: string;
  private reSplit = /(<)([^?>]*)(>)/g;
  private reXMLData = /(\<?XML\>)(.*)$/i;

  constructor(rawMessage: string) {
    this.parse(rawMessage);
    }

  parse(rawMessage: string): boolean{

    if (!rawMessage || 0 === rawMessage.length) {
      return false;
      }

    let match = null;

    // From
    if (match = this.reSplit.exec(rawMessage)) {
      this.from = match[2].toLowerCase();
    } else {
      return false;
    }

    // Cmd
    if (match = this.reSplit.exec(rawMessage)) {
      this.cmd = match[2].toUpperCase();
    } else {
      return false;
    }

    // To
    if (match = this.reSplit.exec(rawMessage)) {
      this.to = match[2].toLowerCase();
    } else {
      return false;
    }

    // Params
    while (match = this.reSplit.exec(rawMessage)) {
      console.log(match[2]);
      }

    // let m = this.reXMLData.exec(rawMessage);
    // if (!m || m.length === 2 ) {
    //   this.xml = m[1]
    //   }

    return true;
    };
}
