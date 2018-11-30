import Peer from 'simple-peer';

type OnStream = (stream: MediaStream) => void;

interface CallBacks {
  onSignal: (data: string) => void;
  onConnected?: () => void;
  onStream?: OnStream;
}

var constraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
  }
};

const config = {
  iceServers: [
    { urls: 'stun:global.stun.twilio.com:3478?transport=udp' },
    {
      urls: 'stun:numb.viagenie.ca',
      username: 'team@dinnertable.chat',
      credential: 'happypeople'
    },
    {
      urls: 'turn:numb.viagenie.ca',
      username: 'team@dinnertable.chat',
      credential: 'happypeople'
    },
    { urls: 'stun:stun.l.google.com:19302' }
  ]
};

export default class PeerService {
  public _peer: Peer.Instance & any; // typing is incomplete
  private _stream: MediaStream;
  private clientStream: any;
  private initiator: boolean = false;
  constructor(stream: MediaStream) {
    if (!stream) throw new Error('no stream given');
    this._stream = stream;
  }

  public getLocalStream(): MediaStream {
    return this._stream;
  }

  public init(initiator: boolean, cbs: CallBacks) {
    this.initiator = initiator;
    this._peer = new Peer({
      initiator,
      trickle: false,
      stream: this._stream,
      constraints,
      config
    });
    this._peer.on('signal', (data: any) => {
      if (!initiator) console.timeEnd('giveResponse');
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
    if (!this.initiator) console.time('giveResponse');
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
    console.log('peer destroyed');
    this._peer.destroy();
    if (this._stream && this._stream.getTracks)
      this._stream.getTracks().forEach(track => track.stop());
    if (this.clientStream && this.clientStream.getTracks)
      this.clientStream.getTracks().forEach(track => track.stop());
  }
}

// public function startPeer(initiator:boolean) {

// }
