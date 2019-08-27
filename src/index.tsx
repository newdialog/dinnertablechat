import '@babel/polyfill';
// import "core-js/stable";
// import "regenerator-runtime/runtime";

import './index.css';
import React from 'react';
import { hydrate, render } from "react-dom";
import {App} from './App';
// Setup History

const rootElement = document.getElementById('root') as HTMLElement;

if (rootElement.hasChildNodes()) {
  hydrate(<App />, rootElement);
} else {
  render(<App />, rootElement);
}
