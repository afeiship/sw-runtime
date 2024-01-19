type HandlerEvent = {
  context: any;
};

type InstallRuntimeOptions = ISwRuntimeOptions & InstallOptions;

interface NxStatic {
  $sw: any;
}

interface ISwRuntimeOptions {
  force?: boolean;
  swDest?: string;
  updateViaCache?: 'none' | 'imports' | 'all';
  autoUpdate?: boolean;
  autoUpdateInterval?: number;
  onAutoUpdate?: (event: HandlerEvent) => void;
}

interface InstallOptions {
  /**
   * Event called exactly once when ServiceWorker or AppCache is installed.
   * Can be useful to display "App is ready for offline usage" message.
   *
   * @memberOf InstallOptions
   */
  onInstalled?: (event: HandlerEvent) => void;;

  /**
   * Not supported for AppCache.
   * Event called when update is found and browsers started updating process.
   * At this moment, some assets are downloading.
   *
   * @memberOf InstallOptions
   */
  onUpdating?: (event: HandlerEvent) => void;;

  /**
   * Event called when onUpdating phase finished.
   * All required assets are downloaded at this moment and are ready to be updated.
   * Call runtime.applyUpdate() to apply update.
   *
   * @memberOf InstallOptions
   */
  onUpdateReady?: (event: HandlerEvent) => void;;

  /**
   * Event called when upUpdating phase failed by some reason.
   * Nothing is downloaded at this moment and current update process
   * in your code should be canceled or ignored.
   *
   * @memberOf InstallOptions
   */
  onUpdateFailed?: (event: HandlerEvent) => void;;

  /**
   * Event called when update is applied,
   * either by calling runtime.applyUpdate() or
   * some other way by a browser itself.
   *
   * @memberOf InstallOptions
   */
  onUpdated?: (event: HandlerEvent) => void;;
}
