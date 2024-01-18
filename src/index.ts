interface ISwRuntimeOptions {
  force?: boolean;
  events?: boolean;
  autoUpdate?: boolean;
  swDest?: string;
}

const defaults: ISwRuntimeOptions = {
  force: false,
  events: false,
  autoUpdate: false,
  swDest: './sw.js',
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

  install() {
    const { swDest, events } = this.options;
    if (this.has()) {
      const registration = navigator.serviceWorker.register(swDest, { scope: '/' });
      if (events) {
        const handleUpdating = function (registration) {
          console.log('Service Worker is updating...');
        };
      }
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

  applyUpdate() {
    if (this.has()) {
      navigator.serviceWorker.getRegistration().then((registration) => {
        if (registration && registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
      });
    }
  }
}

export default SwRuntime;
