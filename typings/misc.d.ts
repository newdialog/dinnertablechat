declare module 'jss-preset-default';
declare module 'react-jss/*';
declare module 'json!*' {
  let json: any;
  export = json;
}

declare function ga(
  action: string,
  event: string,
  eventCategory: string,
  eventAction: string,
  eventLabel?: any,
  eventValue?: any
): void;
