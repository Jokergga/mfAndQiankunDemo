import { injectIntoGlobalHook } from 'react-refresh/cjs/react-refresh-runtime.development'
// import { injectIntoGlobalHook } from './react-refresh-runtime.development'

import ReactDOM from 'react-dom'

export const injectBaseReactRefresh = () => {
  // Injects the react refresh replacing the one from the base app
  injectIntoGlobalHook(window)
  // Injects the react-dom instance again
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject(ReactDOM)
}
