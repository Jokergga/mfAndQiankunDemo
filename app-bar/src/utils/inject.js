// import { injectIntoGlobalHook } from 'react-refresh/cjs/react-refresh-runtime.development'
import { injectIntoGlobalHook } from 'react-refresh/cjs/react-refresh-runtime.development'

import ReactDOM from 'react-dom'
/**
 * 基于 webpack module Federation 架构下子应用的 react refresh 补丁
 *
 * @author yuzhanglong
 * @date 2021-09-27 22:19:36
 */
export const injectBaseReactRefresh = () => {
  // Injects the react refresh replacing the one from the base app
  console.log('--window--', window)
  console.log('--ReactDOM--', ReactDOM)
  console.log("--", injectIntoGlobalHook);
  injectIntoGlobalHook(window)
  // Injects the react-dom instance again
  window.__REACT_DEVTOOLS_GLOBAL_HOOK__.inject(ReactDOM)
}
//# sourceMappingURL=inject-base-react-refresh.js.map
