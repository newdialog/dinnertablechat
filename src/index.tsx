// import '@babel/polyfill';
// import 'react-app-polyfill/ie11'; // IE11 NOT SUPPORTED
import 'react-app-polyfill/stable';
import ProxyPolyfill from 'proxy-polyfill/src/proxy';

import './index.css';
import React from 'react';
import { hydrate, render } from "react-dom";
// import * as Bowser from "bowser"; 

if(window && !window.Proxy) window.Proxy = ProxyPolyfill;

// error tracking
window.onerror = function (msg, url, lineNo, columnNo) {
  console.log('logging error', msg);
  // const browser = Bowser.getParser(window.navigator.userAgent);

  const _msg = {
    'msg': msg,
    'url': url,
    'lin': lineNo,
    'col': columnNo
    // 'browser': browser.getBrowser().name + ':' + browser.getBrowser().version
  };

  if(window.gtag) window.gtag('event', 'exception', {
    'description': JSON.stringify(_msg),
    'fatal': true
  });
};
// ========

const {App} = require('./App');
// Setup History

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
