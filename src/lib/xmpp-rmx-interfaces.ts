// ----------------------------------------------------------------------------------------------------------------------
export namespace XmppRmx {
  // ..................................................................................................................
  /**
   * XmppRmxConnectParams
   */
  export interface IxmppRmxConnectParams {
    jid: string;
    password: string;
    resource: string;
    transport: string;
    server: string;
    wsURL: string;
    sasl: Array<string>;
  }

  // ..................................................................................................................
  /**
   * XmppRmxConnectParams
   */
    // (\<\?xml\>)(.*)$|\<[^\?\>]*\>
  export interface IxmppRmxMessage {
    label?: string;
    parse(rawMessage: string): boolean;
  }
}
