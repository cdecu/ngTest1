import { Subject, Observer, Observable } from 'rxjs';

/// we inherit from the ordinary Subject
export class XmppWebsocket<T> extends Subject<T> {
  
  private xmppStatus = 0;
  private xmppClient: any = null;
  private reconnectionObservable: Observable<number> = null;
  private connectionObserver: Observer<number>;
  public connectionStatus: Observable<number>;

  private reconnectInterval = 10000;  /// pause between connections
  private reconnectAttempts = 5000;  /// number of connection attempts
  private resultSelector?: (e: MessageEvent) => any = null;
  private serializer?: (data: any) => string = null;

  private xmppParam = {
    jid: 'mediator@vpn.restomax.com',
    password: 'MI_456321_MI',
    resource: 'testX',
    transport: 'websocket',
    server: 'vpn.restomax.com',
    wsURL: 'ws://vpn.restomax.com:7070/ws/',
    sasl: ['digest-md5', 'plain']
    };

  /// by default, when a message is received from the server, we are trying to decode it as JSON
  /// we can override it in the constructor
  defaultResultSelector = (e: MessageEvent) => {
    return JSON.parse(e.data);
    };

  /// when sending a message, we encode it to JSON
  /// we can override it in the constructor
  defaultSerializer = (data: any): string => {
    return JSON.stringify(data);
    };

  private SetXmppStatus(Value: number): void {
    if (this.xmppStatus !== Value) {
      console.log('XMPP Status ', this.xmppStatus, ' => ', Value);
      this.xmppStatus = Value;
      this.connectionObserver.next(Value);
    } else {
      console.log('XMPP Stay in Status ', Value);
      }
    }

  constructor(
  ) {
    super();
    console.log('XmppWebsocket Create');

    /// connection status
    this.connectionStatus = new Observable((observer) => {
      this.connectionObserver = observer;
      }).share().distinctUntilChanged();

    if (!this.resultSelector) {
      this.resultSelector = this.defaultResultSelector;
      }

    if (!this.serializer) {
      this.serializer = this.defaultSerializer;
      }

    /// config for WebSocketSubject
    this.xmppClient = require('stanza.io').createClient(this.xmppParam);
    this.xmppClient.on('connected',  (e, err) => this.SetXmppStatus(1));
    this.xmppClient.on('auth:failed',  ( ) => {
      console.log('auth:failed');
      this.SetXmppStatus(-1);
      });
    this.xmppClient.on('auth:success',  ( ) => {
      console.log('auth:success');
      this.SetXmppStatus(1);
      });
    this.xmppClient.on('session:started',  ( ) => {
      this.xmppClient.getRoster();
      this.xmppClient.sendPresence();
      this.SetXmppStatus(2);
      this.helo();
      });
    this.xmppClient.on('disconnected',  (e, err) => {
      console.log('disconnected');
      console.log(e);
      console.log(err);
      this.SetXmppStatus(0);
    });
    this.xmppClient.on('raw:incoming', function (xml) {
      //console.log('raw:incoming');
      //console.log(xml);
    });
    this.xmppClient.on('raw:outgoing', function (xml) {
      //console.log('raw:outgoing');
      //console.log(xml);
    });
    this.xmppClient.on('message', (message) => {
      console.log(message);
      const s: string = message.body;
      if (s.indexOf('MEDIATOR_OK') > 0) {
        this.SetXmppStatus(4);
        return;
        }
      this.next(message.body);
      });
    console.log('XmppWebsocket Created');

    /// we connect
    this.connect();

    /// we follow the connection status and run the reconnect while losing the connection
    this.connectionStatus.subscribe( () => {
      if ((!this.reconnectionObservable) && (this.xmppStatus === 0)) {
        this.reconnect();
        }
      });
    }

  connect(): void {
    console.log('XmppWebsocket:connect');
    try {
      this.xmppClient.connect();
    } catch (err) {
      /// in case of an error with a loss of connection, we restore it
      console.log('XmppWebsocket:error:' + err);
      this.reconnect();
    }   };

  reconnect(): void {
    console.log('XmppWebsocket:reconnect subscribe', this.xmppStatus);
    this.reconnectionObservable = Observable.interval(this.reconnectInterval)
      .takeWhile((v, index) => {
        return index < this.reconnectAttempts;
      });
    this.reconnectionObservable.subscribe(
      () => { this.connect(); },
      (error) => { console.log(error); },
      () => {
        /// if the reconnection attempts are failed, then we call complete of our Subject and status
        console.log('XmppWebsocket:completed');
        this.reconnectionObservable = null;
        this.complete();
        this.connectionObserver.complete();
        }
      );
    };

  helo(): void {
    console.log('XmppWebsocket:helo', this.xmppStatus);
    try {
      this.SetXmppStatus(3);
      this.xmppClient.sendMessage({
        to  : 'mediator2@vpn.restomax.com',
        body: '<mediator2><MEDIATOR_HELO><mediator2@vpn.restomax.com/testX>'
      });
    } catch (err) {
      /// in case of an error with a loss of connection, we restore it
      console.log('XmppWebsocket:error:' + err);
      this.SetXmppStatus(-9);
    }   };

  /// sending the message
  send(data: string): void {
    console.log('XmppWebsocket:helo', this.xmppStatus);
    try {
      this.SetXmppStatus(3);
      this.xmppClient.sendMessage({
        to  : 'mediator2@vpn.restomax.com/MediatorSvc_RMX_RX10_1.5.17.2.18',
        body: '<mediator2@vpn.restomax.com/MediatorSvc_RMX_RX10_1.5.17.2.18><ASK_VIEW><mediator@vpn.restomax.com/testX>' + data
      });
    } catch (err) {
      /// in case of an error with a loss of connection, we restore it
      console.log('XmppWebsocket:error:' + err);
      this.SetXmppStatus(-9);
    }   };

}
