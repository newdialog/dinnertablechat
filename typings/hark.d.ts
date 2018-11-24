declare module 'hark' {
  interface SpeechEvent {
    on: (name: string, cb: () => void) => void;
    stop: () => void;
  }
  export default function hark(stream: any, options: any): SpeechEvent;
}
