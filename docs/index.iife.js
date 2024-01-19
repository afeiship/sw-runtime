"use strict";
var SwRuntime = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/index.ts
  var src_exports = {};
  __export(src_exports, {
    default: () => src_default
  });
  var defaults = {
    force: false,
    swDest: "./sw.js",
    updateViaCache: "none",
    autoUpdate: false,
    autoUpdateInterval: 60 * 1e3,
    onAutoUpdate: () => {
    }
  };
  var SwRuntime = class _SwRuntime {
    get supportSw() {
      return "serviceWorker" in navigator;
    }
    constructor(inOptions) {
      this.options = { ...defaults, ...inOptions };
      this.checkAutoUpdate();
    }
    checkAutoUpdate() {
      const { autoUpdate, autoUpdateInterval, onAutoUpdate } = this.options;
      if (!autoUpdate)
        return;
      setInterval(() => {
        this.update();
        onAutoUpdate({ context: this });
      }, autoUpdateInterval);
    }
    has() {
      if (this.options.force) {
        return this.supportSw;
      } else {
        return this.supportSw && (window.location.protocol === "https:" || window.location.hostname === "localhost" || window.location.hostname.indexOf("127.") === 0);
      }
    }
    install(inOptions) {
      const { updateViaCache } = this.options;
      if (this.has()) {
        const registration = navigator.serviceWorker.register(this.options.swDest, {
          // 表示不更新任何资源。
          // 当 Service Worker 检测到更新时，它不会尝试获取新版本的任何资源。
          // 这个策略适用于希望手动控制资源更新的情况。
          updateViaCache
        });
        const sendEvent = (event) => {
          if (typeof inOptions[event] === "function") {
            inOptions[event]({ context: this });
          }
        };
        const handleUpdating = function(registration2) {
          const sw = registration2.installing || registration2.waiting;
          let ignoreInstalling;
          let ignoreWaiting;
          let stateChangeHandler;
          if (!sw || sw.onstatechange)
            return;
          if (registration2.active) {
            onUpdateStateChange();
            stateChangeHandler = onUpdateStateChange;
          } else {
            onInstallStateChange();
            stateChangeHandler = onInstallStateChange;
          }
          ignoreInstalling = true;
          if (registration2.waiting) {
            ignoreWaiting = true;
          }
          sw.onstatechange = stateChangeHandler;
          function onUpdateStateChange() {
            switch (sw.state) {
              case "redundant":
                sendEvent("onUpdateFailed");
                sw.onstatechange = null;
                break;
              case "installing":
                if (!ignoreInstalling) {
                  sendEvent("onUpdating");
                }
                break;
              case "installed":
                if (!ignoreWaiting) {
                  sendEvent("onUpdateReady");
                }
                break;
              case "activated":
                sendEvent("onUpdated");
                sw.onstatechange = null;
                break;
            }
          }
          function onInstallStateChange() {
            switch (sw.state) {
              case "redundant":
                sw.onstatechange = null;
                break;
              case "installing":
                break;
              case "installed":
                break;
              case "activated":
                sendEvent("onInstalled");
                sw.onstatechange = null;
                break;
            }
          }
        };
        registration.then(function(reg) {
          if (!reg)
            return;
          handleUpdating(reg);
          reg.onupdatefound = function() {
            handleUpdating(reg);
          };
        }).catch(function(err) {
          sendEvent("onError");
          return Promise.reject(err);
        });
      }
    }
    uninstall() {
      if (this.has()) {
        navigator.serviceWorker.getRegistrations().then((registrations) => {
          registrations.forEach((registration) => {
            registration.unregister();
          });
        });
      }
    }
    update() {
      if (this.has()) {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (!registration)
            return;
          registration.update();
        });
      }
    }
    applyUpdate() {
      if (!this.has())
        return Promise.resolve();
      return new Promise((resolve, reject) => {
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (!registration || !registration.waiting)
            return reject();
          registration.waiting.postMessage({ type: "SKIP_WAITING" });
          resolve();
        });
      });
    }
    static install(inOptions) {
      const {
        force,
        swDest,
        updateViaCache,
        autoUpdate,
        autoUpdateInterval,
        onAutoUpdate,
        ...installOptions
      } = { ...defaults, ...inOptions };
      const swRuntime = new _SwRuntime({
        force,
        swDest,
        updateViaCache,
        autoUpdate,
        autoUpdateInterval,
        onAutoUpdate
      });
      swRuntime.install(installOptions);
      return swRuntime;
    }
  };
  var src_default = SwRuntime;
  return __toCommonJS(src_exports);
})();
//# sourceMappingURL=index.iife.js.map