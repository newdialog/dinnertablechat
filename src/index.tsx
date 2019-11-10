// import '@babel/polyfill';
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import ProxyPolyfill from 'proxy-polyfill/src/proxy';

import './index.css';
import React from 'react';
import { hydrate, render } from "react-dom";

if(window && !window.Proxy) window.Proxy = ProxyPolyfill;

const {App} = require('./App');
// Setup History

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
