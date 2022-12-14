import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
/**
 * @author Kuitos
 * @since 2019-04-11
 */
import { SandBoxType } from '../../interfaces';
import * as css from './css';
import { patchLooseSandbox, patchStrictSandbox } from './dynamicAppend';
import patchHistoryListener from './historyListener';
import patchInterval from './interval';
import patchWindowListener from './windowListener';
export function patchAtMounting(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox, _patchersInSandbox$sa;
  var basePatchers = [function () {
    return patchInterval(sandbox.proxy);
  }, function () {
    return patchWindowListener(sandbox.proxy);
  }, function () {
    return patchHistoryListener();
  }];
  var patchersInSandbox = (_patchersInSandbox = {}, _defineProperty(_patchersInSandbox, SandBoxType.LegacyProxy, [].concat(basePatchers, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), _defineProperty(_patchersInSandbox, SandBoxType.Proxy, [].concat(basePatchers, [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter, speedySandBox);
  }])), _defineProperty(_patchersInSandbox, SandBoxType.Snapshot, [].concat(basePatchers, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox.proxy, true, scopedCSS, excludeAssetFilter);
  }])), _patchersInSandbox);
  return (_patchersInSandbox$sa = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa === void 0 ? void 0 : _patchersInSandbox$sa.map(function (patch) {
    return patch();
  });
}
export function patchAtBootstrapping(appName, elementGetter, sandbox, scopedCSS, excludeAssetFilter, speedySandBox) {
  var _patchersInSandbox2, _patchersInSandbox$sa2;
  var patchersInSandbox = (_patchersInSandbox2 = {}, _defineProperty(_patchersInSandbox2, SandBoxType.LegacyProxy, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), _defineProperty(_patchersInSandbox2, SandBoxType.Proxy, [function () {
    return patchStrictSandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter, speedySandBox);
  }]), _defineProperty(_patchersInSandbox2, SandBoxType.Snapshot, [function () {
    return patchLooseSandbox(appName, elementGetter, sandbox.proxy, false, scopedCSS, excludeAssetFilter);
  }]), _patchersInSandbox2);
  return (_patchersInSandbox$sa2 = patchersInSandbox[sandbox.type]) === null || _patchersInSandbox$sa2 === void 0 ? void 0 : _patchersInSandbox$sa2.map(function (patch) {
    return patch();
  });
}
export { css };