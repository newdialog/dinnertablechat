declare module 'jss-preset-default';
declare module 'react-jss/*';
declare module 'json!*' {
  let json: any;
  export = json;
}

declare function gtag(
  action: string,
  event: string,
  eventCategory?: any,
  eventAction?: any,
  eventLabel?: any,
  eventValue?: any
): void;

declare function trackOutboundLink(url:string):void;