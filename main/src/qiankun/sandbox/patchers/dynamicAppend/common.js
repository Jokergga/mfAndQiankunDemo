import _isFunction from "lodash/isFunction";
import _slicedToArray from "@babel/runtime/helpers/esm/slicedToArray";
import { execScripts } from '../../../../import-html-entry';
import { frameworkConfiguration } from '../../../apis';
import { qiankunHeadTagName } from '../../../utils';
import { lexicalGlobals } from '../../common';
import * as css from '../css';
export var rawHeadAppendChild = HTMLHeadElement.prototype.appendChild;
var rawHeadRemoveChild = HTMLHeadElement.prototype.removeChild;
var rawBodyAppendChild = HTMLBodyElement.prototype.appendChild;
var rawBodyRemoveChild = HTMLBodyElement.prototype.removeChild;
var rawHeadInsertBefore = HTMLHeadElement.prototype.insertBefore;
var rawRemoveChild = HTMLElement.prototype.removeChild;
var SCRIPT_TAG_NAME = 'SCRIPT';
var LINK_TAG_NAME = 'LINK';
var STYLE_TAG_NAME = 'STYLE';
export var styleElementTargetSymbol = Symbol('target');
export var getAppWrapperHeadElement = function getAppWrapperHeadElement(appWrapper) {
  return appWrapper.querySelector(qiankunHeadTagName);
};
export function isExecutableScriptType(script) {
  return !script.type || ['text/javascript', 'module', 'application/javascript', 'text/ecmascript', 'application/ecmascript'].indexOf(script.type) !== -1;
}
export function isHijackingTag(tagName) {
  return (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === LINK_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === STYLE_TAG_NAME || (tagName === null || tagName === void 0 ? void 0 : tagName.toUpperCase()) === SCRIPT_TAG_NAME;
}
/**
 * Check if a style element is a styled-component liked.
 * A styled-components liked element is which not have textContext but keep the rules in its styleSheet.cssRules.
 * Such as the style element generated by styled-components and emotion.
 * @param element
 */
export function isStyledComponentsLike(element) {
  var _element$sheet, _getStyledElementCSSR;
  return !element.textContent && (((_element$sheet = element.sheet) === null || _element$sheet === void 0 ? void 0 : _element$sheet.cssRules.length) || ((_getStyledElementCSSR = getStyledElementCSSRules(element)) === null || _getStyledElementCSSR === void 0 ? void 0 : _getStyledElementCSSR.length));
}
var appsCounterMap = new Map();
export function calcAppCount(appName, calcType, status) {
  var appCount = appsCounterMap.get(appName) || {
    bootstrappingPatchCount: 0,
    mountingPatchCount: 0
  };
  switch (calcType) {
    case 'increase':
      appCount["".concat(status, "PatchCount")] += 1;
      break;
    case 'decrease':
      // bootstrap patch just called once but its freer will be called multiple times
      if (appCount["".concat(status, "PatchCount")] > 0) {
        appCount["".concat(status, "PatchCount")] -= 1;
      }
      break;
  }
  appsCounterMap.set(appName, appCount);
}
export function isAllAppsUnmounted() {
  return Array.from(appsCounterMap.entries()).every(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
      _ref2$ = _ref2[1],
      bpc = _ref2$.bootstrappingPatchCount,
      mpc = _ref2$.mountingPatchCount;
    return bpc === 0 && mpc === 0;
  });
}
function patchCustomEvent(e, elementGetter) {
  Object.defineProperties(e, {
    srcElement: {
      get: elementGetter
    },
    target: {
      get: elementGetter
    }
  });
  return e;
}
function manualInvokeElementOnLoad(element) {
  // we need to invoke the onload event manually to notify the event listener that the script was completed
  // here are the two typical ways of dynamic script loading
  // 1. element.onload callback way, which webpack and loadjs used, see https://github.com/muicss/loadjs/blob/master/src/loadjs.js#L138
  // 2. addEventListener way, which toast-loader used, see https://github.com/pyrsmk/toast/blob/master/src/Toast.ts#L64
  var loadEvent = new CustomEvent('load');
  var patchedEvent = patchCustomEvent(loadEvent, function () {
    return element;
  });
  if (_isFunction(element.onload)) {
    element.onload(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}
function manualInvokeElementOnError(element) {
  var errorEvent = new CustomEvent('error');
  var patchedEvent = patchCustomEvent(errorEvent, function () {
    return element;
  });
  if (_isFunction(element.onerror)) {
    element.onerror(patchedEvent);
  } else {
    element.dispatchEvent(patchedEvent);
  }
}
function convertLinkAsStyle(element, postProcess) {
  var fetchFn = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : fetch;
  var styleElement = document.createElement('style');
  var href = element.href;
  // add source link element href
  styleElement.dataset.qiankunHref = href;
  fetchFn(href).then(function (res) {
    return res.text();
  }).then(function (styleContext) {
    styleElement.appendChild(document.createTextNode(styleContext));
    postProcess(styleElement);
    manualInvokeElementOnLoad(element);
  }).catch(function () {
    return manualInvokeElementOnError(element);
  });
  return styleElement;
}
var styledComponentCSSRulesMap = new WeakMap();
var dynamicScriptAttachedCommentMap = new WeakMap();
var dynamicLinkAttachedInlineStyleMap = new WeakMap();
export function recordStyledComponentsCSSRules(styleElements) {
  styleElements.forEach(function (styleElement) {
    /*
     With a styled-components generated style element, we need to record its cssRules for restore next re-mounting time.
     We're doing this because the sheet of style element is going to be cleaned automatically by browser after the style element dom removed from document.
     see https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
     */
    if (styleElement instanceof HTMLStyleElement && isStyledComponentsLike(styleElement)) {
      if (styleElement.sheet) {
        // record the original css rules of the style element for restore
        styledComponentCSSRulesMap.set(styleElement, styleElement.sheet.cssRules);
      }
    }
  });
}
export function getStyledElementCSSRules(styledElement) {
  return styledComponentCSSRulesMap.get(styledElement);
}
function getOverwrittenAppendChildOrInsertBefore(opts) {
  return function appendChildOrInsertBefore(newChild) {
    var refChild = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var element = newChild;
    var rawDOMAppendOrInsertBefore = opts.rawDOMAppendOrInsertBefore,
      isInvokedByMicroApp = opts.isInvokedByMicroApp,
      containerConfigGetter = opts.containerConfigGetter,
      _opts$target = opts.target,
      target = _opts$target === void 0 ? 'body' : _opts$target;
    if (!isHijackingTag(element.tagName) || !isInvokedByMicroApp(element)) {
      return rawDOMAppendOrInsertBefore.call(this, element, refChild);
    }
    if (element.tagName) {
      var containerConfig = containerConfigGetter(element);
      var appName = containerConfig.appName,
        appWrapperGetter = containerConfig.appWrapperGetter,
        proxy = containerConfig.proxy,
        strictGlobal = containerConfig.strictGlobal,
        speedySandbox = containerConfig.speedySandbox,
        dynamicStyleSheetElements = containerConfig.dynamicStyleSheetElements,
        scopedCSS = containerConfig.scopedCSS,
        excludeAssetFilter = containerConfig.excludeAssetFilter;
      switch (element.tagName) {
        case LINK_TAG_NAME:
        case STYLE_TAG_NAME:
          {
            var stylesheetElement = newChild;
            var _stylesheetElement = stylesheetElement,
              href = _stylesheetElement.href;
            if (excludeAssetFilter && href && excludeAssetFilter(href)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }
            Object.defineProperty(stylesheetElement, styleElementTargetSymbol, {
              value: target,
              writable: true,
              configurable: true
            });
            var appWrapper = appWrapperGetter();
            if (scopedCSS) {
              var _element$tagName;
              // exclude link elements like <link rel="icon" href="favicon.ico">
              var linkElementUsingStylesheet = ((_element$tagName = element.tagName) === null || _element$tagName === void 0 ? void 0 : _element$tagName.toUpperCase()) === LINK_TAG_NAME && element.rel === 'stylesheet' && element.href;
              if (linkElementUsingStylesheet) {
                var _frameworkConfigurati;
                var _fetch = typeof frameworkConfiguration.fetch === 'function' ? frameworkConfiguration.fetch : (_frameworkConfigurati = frameworkConfiguration.fetch) === null || _frameworkConfigurati === void 0 ? void 0 : _frameworkConfigurati.fn;
                stylesheetElement = convertLinkAsStyle(element, function (styleElement) {
                  return css.process(appWrapper, styleElement, appName);
                }, _fetch);
                dynamicLinkAttachedInlineStyleMap.set(element, stylesheetElement);
              } else {
                css.process(appWrapper, stylesheetElement, appName);
              }
            }
            var mountDOM = target === 'head' ? getAppWrapperHeadElement(appWrapper) : appWrapper;
            dynamicStyleSheetElements.push(stylesheetElement);
            var referenceNode = mountDOM.contains(refChild) ? refChild : null;
            return rawDOMAppendOrInsertBefore.call(mountDOM, stylesheetElement, referenceNode);
          }
        case SCRIPT_TAG_NAME:
          {
            var _element = element,
              src = _element.src,
              text = _element.text;
            // some script like jsonp maybe not support cors which should't use execScripts
            if (excludeAssetFilter && src && excludeAssetFilter(src) || !isExecutableScriptType(element)) {
              return rawDOMAppendOrInsertBefore.call(this, element, refChild);
            }
            var _appWrapper = appWrapperGetter();
            var _mountDOM = target === 'head' ? getAppWrapperHeadElement(_appWrapper) : _appWrapper;
            var _fetch2 = frameworkConfiguration.fetch;
            var _referenceNode = _mountDOM.contains(refChild) ? refChild : null;
            var scopedGlobalVariables = speedySandbox ? lexicalGlobals : [];
            if (src) {
              execScripts(null, [src], proxy, {
                fetch: _fetch2,
                strictGlobal: strictGlobal,
                scopedGlobalVariables: scopedGlobalVariables,
                beforeExec: function beforeExec() {
                  var isCurrentScriptConfigurable = function isCurrentScriptConfigurable() {
                    var descriptor = Object.getOwnPropertyDescriptor(document, 'currentScript');
                    return !descriptor || descriptor.configurable;
                  };
                  if (isCurrentScriptConfigurable()) {
                    Object.defineProperty(document, 'currentScript', {
                      get: function get() {
                        return element;
                      },
                      configurable: true
                    });
                  }
                },
                success: function success() {
                  manualInvokeElementOnLoad(element);
                  element = null;
                },
                error: function error() {
                  manualInvokeElementOnError(element);
                  element = null;
                }
              });
              var dynamicScriptCommentElement = document.createComment("dynamic script ".concat(src, " replaced by qiankun"));
              dynamicScriptAttachedCommentMap.set(element, dynamicScriptCommentElement);
              return rawDOMAppendOrInsertBefore.call(_mountDOM, dynamicScriptCommentElement, _referenceNode);
            }
            // inline script never trigger the onload and onerror event
            execScripts(null, ["<script>".concat(text, "</script>")], proxy, {
              strictGlobal: strictGlobal,
              scopedGlobalVariables: scopedGlobalVariables
            });
            var dynamicInlineScriptCommentElement = document.createComment('dynamic inline script replaced by qiankun');
            dynamicScriptAttachedCommentMap.set(element, dynamicInlineScriptCommentElement);
            return rawDOMAppendOrInsertBefore.call(_mountDOM, dynamicInlineScriptCommentElement, _referenceNode);
          }
        default:
          break;
      }
    }
    return rawDOMAppendOrInsertBefore.call(this, element, refChild);
  };
}
function getNewRemoveChild(headOrBodyRemoveChild, containerConfigGetter, target) {
  return function removeChild(child) {
    var tagName = child.tagName;
    if (!isHijackingTag(tagName)) return headOrBodyRemoveChild.call(this, child);
    try {
      var attachedElement;
      var _containerConfigGette = containerConfigGetter(child),
        appWrapperGetter = _containerConfigGette.appWrapperGetter,
        dynamicStyleSheetElements = _containerConfigGette.dynamicStyleSheetElements;
      switch (tagName) {
        case STYLE_TAG_NAME:
        case LINK_TAG_NAME:
          {
            attachedElement = dynamicLinkAttachedInlineStyleMap.get(child) || child;
            // try to remove the dynamic style sheet
            var dynamicElementIndex = dynamicStyleSheetElements.indexOf(attachedElement);
            if (dynamicElementIndex !== -1) {
              dynamicStyleSheetElements.splice(dynamicElementIndex, 1);
            }
            break;
          }
        case SCRIPT_TAG_NAME:
          {
            attachedElement = dynamicScriptAttachedCommentMap.get(child) || child;
            break;
          }
        default:
          {
            attachedElement = child;
          }
      }
      var appWrapper = appWrapperGetter();
      var container = target === 'head' ? getAppWrapperHeadElement(appWrapper) : appWrapper;
      // container might have been removed while app unmounting if the removeChild action was async
      if (container.contains(attachedElement)) {
        return rawRemoveChild.call(attachedElement.parentNode, attachedElement);
      }
    } catch (e) {
      console.warn(e);
    }
    return headOrBodyRemoveChild.call(this, child);
  };
}
export function patchHTMLDynamicAppendPrototypeFunctions(isInvokedByMicroApp, containerConfigGetter) {
  // Just overwrite it while it have not been overwrite
  if (HTMLHeadElement.prototype.appendChild === rawHeadAppendChild && HTMLBodyElement.prototype.appendChild === rawBodyAppendChild && HTMLHeadElement.prototype.insertBefore === rawHeadInsertBefore) {
    HTMLHeadElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp,
      target: 'head'
    });
    HTMLBodyElement.prototype.appendChild = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawBodyAppendChild,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp,
      target: 'body'
    });
    HTMLHeadElement.prototype.insertBefore = getOverwrittenAppendChildOrInsertBefore({
      rawDOMAppendOrInsertBefore: rawHeadInsertBefore,
      containerConfigGetter: containerConfigGetter,
      isInvokedByMicroApp: isInvokedByMicroApp,
      target: 'head'
    });
  }
  // Just overwrite it while it have not been overwrite
  if (HTMLHeadElement.prototype.removeChild === rawHeadRemoveChild && HTMLBodyElement.prototype.removeChild === rawBodyRemoveChild) {
    HTMLHeadElement.prototype.removeChild = getNewRemoveChild(rawHeadRemoveChild, containerConfigGetter, 'head');
    HTMLBodyElement.prototype.removeChild = getNewRemoveChild(rawBodyRemoveChild, containerConfigGetter, 'body');
  }
  return function unpatch() {
    HTMLHeadElement.prototype.appendChild = rawHeadAppendChild;
    HTMLHeadElement.prototype.removeChild = rawHeadRemoveChild;
    HTMLBodyElement.prototype.appendChild = rawBodyAppendChild;
    HTMLBodyElement.prototype.removeChild = rawBodyRemoveChild;
    HTMLHeadElement.prototype.insertBefore = rawHeadInsertBefore;
  };
}
export function rebuildCSSRules(styleSheetElements, reAppendElement) {
  styleSheetElements.forEach(function (stylesheetElement) {
    // re-append the dynamic stylesheet to sub-app container
    var appendSuccess = reAppendElement(stylesheetElement);
    if (appendSuccess) {
      /*
      get the stored css rules from styled-components generated element, and the re-insert rules for them.
      note that we must do this after style element had been added to document, which stylesheet would be associated to the document automatically.
      check the spec https://www.w3.org/TR/cssom-1/#associated-css-style-sheet
       */
      if (stylesheetElement instanceof HTMLStyleElement && isStyledComponentsLike(stylesheetElement)) {
        var cssRules = getStyledElementCSSRules(stylesheetElement);
        if (cssRules) {
          // eslint-disable-next-line no-plusplus
          for (var i = 0; i < cssRules.length; i++) {
            var cssRule = cssRules[i];
            var cssStyleSheetElement = stylesheetElement.sheet;
            cssStyleSheetElement.insertRule(cssRule.cssText, cssStyleSheetElement.cssRules.length);
          }
        }
      }
    }
  });
}