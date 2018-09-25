import Peer from 'simple-peer';

type OnStream = (stream: MediaStream) => void;

interface CallBacks {
  onSignal: (data: string) => void;
  onConnected?: () => void;
  onStream?: OnStream;
}

export default class PeerService {
  public _peer: Peer.Instance & any; // typing is incomplete
  private _stream: MediaStream;
  private clientStream: any;
  constructor(stream: MediaStream) {
    if (!stream) throw new Error('no stream given');
    this._stream = stream;
  }

  public init(initiator: boolean, cbs: CallBacks) {
    this._peer = new Peer({ initiator, trickle: false, stream: this._stream });
    this._peer.on('signal', (data: any) => {
      cbs.onSignal(JSON.stringify(data));
    });
    if (cbs.onConnected) this._peer.on('connect', cbs.onConnected);

    this._peer.on('stream', stream => {
      this.clientStream = stream;
      if (cbs.onStream) cbs.onStream!(stream);
    });
  }

  public getClientStream() {
    return this.clientStream;
  }

  public async onConnection() {
    return new Promise(resolve => {
      this._peer.on('connect', resolve);
    });
  }

  public webrtcSupported() {
    return Peer.WEBRTC_SUPPORT;
  }

  public giveResponse(data: string) {
    let parse: any = null;
    try {
      parse = JSON.parse(data);
    } catch (error) {
      console.warn('cant parse', data);
      return;
    }
    this._peer.signal(parse);
  }

  public onStream(onStream: OnStream) {
    if (this.clientStream) onStream(this.clientStream);
    this.on('stream', onStream);
  }

  public onClose(onCloseCB: () => void) {
    this.on('close', onCloseCB);
  }

  public addStream(stream: any) {
    this._peer.addStream(stream);
  }

  public on(event: string, cb: any) {
    this._peer.on(event, cb);
  }

  public destroy() {
    this._peer.destroy();
  }
}

// public function startPeer(initiator:boolean) {

// }
