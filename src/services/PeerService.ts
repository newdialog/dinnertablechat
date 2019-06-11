import Peer from 'simple-peer'; // TODO: readd after simple-peer gets update
import API from './APIService';
import { EventEmitter } from 'events';
type OnStream = (stream: MediaStream) => void;

interface CallBacks {
  onSignal?: (data: string) => void;
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
export default class PeerService extends EventEmitter {
  public _peer: any; // Peer.Instance & any
  private _stream: MediaStream;
  private clientStream: any;
  private initiator: boolean = false;
  public connected: boolean = false;
  constructor(stream: MediaStream) {
    super();
    if (!stream) throw new Error('no stream given');
    this._stream = stream;
  }

  public getLocalStream(): MediaStream {
    return this._stream;
  }

  public async init(initiator: boolean, cbs: CallBacks) {
    if (this._peer) {
      console.error('peer already init', initiator);
      return;
    }
    // Peer = window['SimplePeer'];
    const ice = ((await API.getICE()) as any[]).concat(config.iceServers);
    console.log('ice', ice);
    this.initiator = initiator;
    // Turning off trickle: https://github.com/feross/simple-peer/issues/382
    this._peer = new Peer({
      initiator,
      trickle: false,
      // allowHalfTrickle: false,
      stream: this._stream,
      constraints,
      config: { iceServers: ice }
    }); //
    this._peer.on('signal', (data: any) => {
      // if (!initiator) console.timeEnd('giveResponse');
      const datasSerialized = data; // JSON.stringify(data);
      // console.log('raw sig', datasSerialized);
      if (cbs.onSignal) cbs.onSignal(datasSerialized);
      this.emit('signal', { data: datasSerialized });
    });

    this._peer.on('connect', e => {
      // this.connected = true;
      // if (cbs.onConnected) cbs.onConnected();
      console.log('rx internal connect');
      this._peer.send('syn');
      this.emit('connect', { data: null });
    });

    this._peer.on('stream', stream => {
      this.clientStream = stream;
      if (cbs.onStream) cbs.onStream(stream);
      // this.emit('stream', {data: stream});
    });

    this._peer.on('data', data => {
      this.emit('data', data);
    });

    this._peer.on('close', e => {
      console.warn('peer closed', e);
      // emit as error
      this.emit('error', { data: e, closed: true });
    });

    this._peer.on('error', e => {
      console.warn('peer failed', e);
      if (e.toString().indexOf('kStable') !== -1) {
        console.warn('kStable error', e);
        return; // ignore kStable
      }
      if (cbs.onError) cbs.onError(e);
      this.emit('error', { data: e });
    });
  }

  public getClientStream() {
    return this.clientStream;
  }

  public async onConnection() {
    return new Promise((resolve, reject) => {
      if (this.connected) {
        setTimeout(() => resolve(), 2000);
        return;
      }
      if (!this._peer) {
        console.warn('!no peer');
      }
      // check if we haven't been destroyed already
      if (this._peer) {
        // Also check for data, sometimes connect not firing
        this._peer.on('data', () => {
          console.log('peer connected: data');
          if (this.connected) return;
          this.connected = true;
          setTimeout(() => resolve(), 2000);
        });
        this._peer.on('connect', () => {
          console.log('peer connected: connect');
          if (this.connected) return;
          this.connected = true;
          setTimeout(() => resolve(), 2000); // allow for sending buffer to drain
        });
        this._peer.on('error', reject);
      }
    });
  }

  public webrtcSupported() {
    return Peer.WEBRTC_SUPPORT;
  }

  public giveResponse(data: string) {
    console.log('rx giveResponse');
    let parse: any = null;
    try {
      parse = data; // JSON.parse(data);
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

  public onPeerEvent(event: string, cb: any) {
    this._peer.on(event, cb);
  }

  public send(data: string) {
    // if(this._peer)
    this._peer.send(data);
    // else console.warn('trying to send msg to null peer', data);
  }

  public destroy() {
    console.log('peer destroyed');
    if (this._peer) this._peer.destroy();
    if (this._stream && this._stream.getTracks)
      this._stream.getTracks().forEach(track => track.stop());
    if (this.clientStream && this.clientStream.getTracks)
      this.clientStream.getTracks().forEach(track => track.stop());
  }
}

// public function startPeer(initiator:boolean) {

// }
