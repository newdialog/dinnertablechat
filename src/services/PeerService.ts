import Peer from 'simple-peer'; // TODO: readd after simple-peer gets update
import API from './APIService';
type OnStream = (stream: MediaStream) => void;

interface CallBacks {
  onSignal: (data: string) => void;
  // onConnected?: () => void;
  onStream?: OnStream;
  onError?: (e: any) => void;
}

var constraints = {
  mandatory: {
    OfferToReceiveAudio: true,
    OfferToReceiveVideo: false
  }
};

const config = {
  iceServers: [
    /* {
      urls: 'stun:global.stun.twilio.com:3478?transport=udp'
    }*/
    { urls: 'stun:stun.l.google.com:19302' }
    /*
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
    }*/
  ]
};

// let Peer: any; // TODO: remove later
export default class PeerService {
  public _peer: any; // Peer.Instance & any
  private _stream: MediaStream;
  private clientStream: any;
  private initiator: boolean = false;
  public connected: boolean = false;
  constructor(stream: MediaStream) {
    if (!stream) throw new Error('no stream given');
    this._stream = stream;
  }

  public getLocalStream(): MediaStream {
    return this._stream;
  }

  public async init(initiator: boolean, cbs: CallBacks) {
    // Peer = window['SimplePeer'];
    const ice = ((await API.getICE()) as any[]).concat(config.iceServers);
    console.log('ice', ice);
    this.initiator = initiator;
    this._peer = new Peer({
      initiator,
      trickle: true,
      // allowHalfTrickle: false,
      stream: this._stream,
      constraints,
      config: { iceServers: ice }
    }); //
    this._peer.on('signal', (data: any) => {
      // if (!initiator) console.timeEnd('giveResponse');
      const datasSerialized = JSON.stringify(data);
      // console.log('raw sig', datasSerialized);
      cbs.onSignal(datasSerialized);
    });

    this._peer.on('connect', e => {
      // this.connected = true;
      // if (cbs.onConnected) cbs.onConnected();
      this._peer.send('syn');
    });

    this._peer.on('stream', stream => {
      this.clientStream = stream;
      if (cbs.onStream) cbs.onStream(stream);
    });

    // this._peer.on('data', data => {
    ///  console.log('got a message from peer: ' + data);
    // });

    this._peer.on('error', e => {
      if (e.toString().indexOf('kStable') !== -1) {
        console.warn('kStable error', e);
        return; // ignore kStable
      }
      if (cbs.onError) cbs.onError(e);
    });
  }

  public getClientStream() {
    return this.clientStream;
  }

  public async onConnection() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        resolve();
        return;
      }
      if (!this._peer) {
        console.warn('!no peer');
      }
      // check if we haven't been destroyed already
      if (this._peer) {
        this._peer.on('connect', () => {
          console.log('#2connect: ', this.connected);
          if (this.connected) return;
          this.connected = true;
          resolve();
        });
        this._peer.on('data', data => {
          // todo: remove?
          console.log('#2got a message from peer: ' + data, this.connected);
          if (this.connected) return;
          this.connected = true;
          resolve();
        });
        this._peer.on('error', reject);
      }
    });
  }

  public webrtcSupported() {
    return Peer.WEBRTC_SUPPORT;
  }

  public giveResponse(data: string) {
    // console.log('response', data);
    let parse: any = null;
    try {
      parse = JSON.parse(data);
    } catch (error) {
      console.warn('cant parse', data);
      return;
    }
    // if (!this.initiator) console.time('giveResponse');
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
