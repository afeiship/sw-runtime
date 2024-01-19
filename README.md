# sw-runtime
> Service worker runtime.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

## installation
```shell
npm install @jswork/sw-runtime
```

## usage
```js
import SwRuntime from '@jswork/sw-runtime';

// App Did Mount, config sw
window.onload = function () {
  SwRuntime.install({
    autoUpdate: true,
    autoUpdateInterval: 5 * 1000,
    onAutoUpdate: function () {
      console.log('SW Event:', 'onAutoUpdate');
    },
    onUpdateReady: function ({ context }) {
      console.log('SW Event:', 'onUpdateReady');
      setTimeout(function () {
        console.log('SW Event:', 'do applyUpdate');
        // Need to reload page, or it will be pending.
        context.applyUpdate();
      }, 1000);
    },
  });
};
```

## todos
1. unpkg/jsdelivr cdn zero cache?(not ok)
2. auto update interval(ok)

## license
Code released under [the MIT license](https://github.com/afeiship/sw-runtime/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/sw-runtime
[version-url]: https://npmjs.org/package/@jswork/sw-runtime

[license-image]: https://img.shields.io/npm/l/@jswork/sw-runtime
[license-url]: https://github.com/afeiship/sw-runtime/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/sw-runtime
[size-url]: https://github.com/afeiship/sw-runtime/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/sw-runtime
[download-url]: https://www.npmjs.com/package/@jswork/sw-runtime
