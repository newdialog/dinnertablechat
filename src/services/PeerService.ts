import Peer from 'simple-peer';

interface CallBacks {
    onSignal:(data:string)=>void,
    onConnected:()=>void,
    onStream:(stream:MediaStream)=>void
}


class PeerService {
    public _peer: Peer.Instance;

    public init(initiator:boolean, cbs:CallBacks ) {
        this._peer = new Peer({ initiator, trickle: false });
        this._peer.on('signal', (data:any) => {
            cbs.onSignal(JSON.stringify(data));
        })
        this._peer.on('connect', cbs.onConnected);
        this._peer.on('stream', cbs.onStream);
    }

    public giveResponse(data:string) {
        this._peer.send(data);
    }

    public on(event:string, cb:any) {
        this._peer.on(event, cb);
    }

    public destroy() {
        this._peer.destroy();
    }
}


// public function startPeer(initiator:boolean) {
    
// }