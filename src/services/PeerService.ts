import Peer from 'simple-peer';

type OnStream = (stream: MediaStream) => void;

interface CallBacks {
  onSignal: (data: string) => void;
  onConnected?: () => void;
  onStream?: OnStream;
}

export default class PeerService {
  public _peer: Peer.Instance & any; // typing is incomplete
  private _stream;
  constructor(stream: MediaStream) {
    this._stream = stream;
  }

  public init(initiator: boolean, cbs: CallBacks) {
    this._peer = new Peer({ initiator, trickle: false, stream: this._stream });
    this._peer.on('signal', (data: any) => {
      cbs.onSignal(JSON.stringify(data));
    });
    if (cbs.onConnected) this._peer.on('connect', cbs.onConnected);
    if (cbs.onStream) this._peer.on('stream', cbs.onStream);
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
    this._peer.signal(JSON.parse(data));
  }

  public onStream(onStream: OnStream) {
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
