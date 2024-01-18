interface ISwRuntimeOptions {
  force?: boolean;
}

class SwRuntime {
  private options: ISwRuntimeOptions;

  constructor(inOptions: ISwRuntimeOptions) {
    this.options = inOptions;
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
}

export default SwRuntime;
