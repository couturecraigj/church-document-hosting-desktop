import ResizeObserver from 'resize-observer-polyfill';
import renderApp from './renderApp';

if (!window.ResizeObserver) window.ResizeObserver = ResizeObserver;

renderApp();
