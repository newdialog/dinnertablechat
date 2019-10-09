// import '@babel/polyfill';
import 'react-app-polyfill/stable';

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
