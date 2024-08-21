// setupEnv must load before App because lexical computes CAN_USE_BEFORE_INPUT
// at import time (disableBeforeInput is used to test legacy events)
// eslint-disable-next-line simple-import-sort/imports
import './index.css';
import setupEnv from './setupEnv';
import { createRoot } from 'react-dom/client';
import App from './App';

if (setupEnv.disableBeforeInput) {
  // vite is really aggressive about tree-shaking, this
  // ensures that the side-effects of importing setupEnv happens
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <App />
);
