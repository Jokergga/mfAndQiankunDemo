// @ts-ignore
// import { injectBaseReactRefresh } from '@mf-lite/core/esm/browser/inject-base-react-refresh';
import { injectBaseReactRefresh } from './inject';

if (process.env.NODE_ENV === 'development') {
  injectBaseReactRefresh();
}
