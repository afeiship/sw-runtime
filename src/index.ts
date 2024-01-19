const defaults: ISwRuntimeOptions = {
  force: false,
  swDest: './sw.js',
  updateViaCache: 'none',
};

class SwRuntime {
  private options: ISwRuntimeOptions;

  constructor(inOptions: ISwRuntimeOptions) {
    this.options = { ...defaults, ...inOptions };
  }

  has() {
    if (this.options.force) {
      return 'serviceWorker' in navigator;
    } else {
      return (
        'serviceWorker' in navigator &&
        (window.location.protocol === 'https:' ||
          window.location.hostname === 'localhost' ||
          window.location.hostname.indexOf('127.') === 0)
      );
    }
  }

  install(inOptions: InstallOptions) {
    const { updateViaCache } = this.options;
    if (this.has()) {
      const registration = navigator.serviceWorker.register(this.options.swDest!, {
        // 表示不更新任何资源。
        // 当 Service Worker 检测到更新时，它不会尝试获取新版本的任何资源。
        // 这个策略适用于希望手动控制资源更新的情况。
        updateViaCache,
      });

      const sendEvent = (event) => {
        if (typeof inOptions[event] === 'function') {
          inOptions[event]({ source: 'ServiceWorker' });
        }
      };

      const handleUpdating = function (registration) {
        const sw = registration.installing || registration.waiting;
        let ignoreInstalling;
        let ignoreWaiting;
        let stateChangeHandler;

        // No SW or already handled
        if (!sw || sw.onstatechange) return;

        // Already has SW
        if (registration.active) {
          onUpdateStateChange();
          stateChangeHandler = onUpdateStateChange;
        } else {
          onInstallStateChange();
          stateChangeHandler = onInstallStateChange;
        }

        ignoreInstalling = true;
        if (registration.waiting) {
          ignoreWaiting = true;
        }

        sw.onstatechange = stateChangeHandler;

        function onUpdateStateChange() {
          switch (sw.state) {
            case 'redundant':
              {
                sendEvent('onUpdateFailed');
                sw.onstatechange = null;
              }
              break;

            case 'installing':
              {
                if (!ignoreInstalling) {
                  sendEvent('onUpdating');
                }
              }
              break;

            case 'installed':
              {
                if (!ignoreWaiting) {
                  sendEvent('onUpdateReady');
                }
              }
              break;

            case 'activated':
              {
                sendEvent('onUpdated');
                sw.onstatechange = null;
              }
              break;
          }
        }

        function onInstallStateChange() {
          switch (sw.state) {
            case 'redundant':
              // Failed to install, ignore
              sw.onstatechange = null;
              break;

            case 'installing':
              // Installing, ignore
              break;

            case 'installed':
              // Installed, wait activation
              break;

            case 'activated':
              sendEvent('onInstalled');
              sw.onstatechange = null;
              break;
          }
        }
      };

      registration
        .then(function (reg) {
          // WTF no reg?
          if (!reg) return;

          // Installed but Shift-Reloaded (page is not controller by SW),
          // update might be ready at this point (more than one tab opened).
          // Anyway, if page is hard-reloaded, then it probably already have latest version
          // but it's not controlled by SW yet. Applying update will claim this page
          // to be controlled by SW. Maybe set flag to not reload it?
          // if (!navigator.serviceWorker.controller) return;

          handleUpdating(reg);

          reg.onupdatefound = function () {
            handleUpdating(reg);
          };
        })
        .catch(function (err) {
          sendEvent('onError');
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
        if (!registration) return;

        registration.update();
      });
    }
  }

  applyUpdate(callback, errback?) {
    if (this.has()) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (!registration || !registration.waiting) {
          errback && errback();
          return;
        }

        // skipWaiting 消息是由 Service Worker 规范定义的标准消息。
        // 这是 Service Worker API 提供的一种机制，用于在安装阶段完成后立即激活新版本的 Service Worker。
        registration.waiting.postMessage({ action: 'skipWaiting' });

        callback && callback();
      });
    }
  }
}

export default SwRuntime;
