import './index.scss';
import './icon.scss'
import './assets/iconfont/iconfont.css';
import { setTheme } from './setThemeCssVar';
setTheme('dark'); // dark light contrast
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

