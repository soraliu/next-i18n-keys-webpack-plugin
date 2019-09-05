<h1 align="center">Welcome to next-i18n-keys 👋</h1>
<p>
  <a href="https://www.npmjs.com/package/next-i18n-keys">
    <img alt="Version" src="https://img.shields.io/npm/v/next-i18n-keys.svg">
  </a>
  <a href="https://github.com/lovesora/next-i18n-keys-webpack-plugin">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" target="_blank" />
  </a>
  <a href="https://opensource.org/licenses/MIT">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" target="_blank" />
  </a>
</p>

> Auto generate next.js page's i18n keys

### 🏠 [Homepage](https://github.com/lovesora/next-i18n-keys-webpack-plugin)

## Install

```sh
yarn install
```

## Configuration

```js
// next.config.js
const NextI18nKeysWebpackPlugin = require('next-i18n-keys');

// ...
  config.plugins.push(
    // ...
    new NextI18nKeysWebpackPlugin({
      // RegExp of placeholder in source file
      matchReg: /'\^__I18N_KEYS__\$'/,
      funcList: ['i18next.t', 'i18n.t'],
    }),
    // ...
  );
// ...
```

```js
// pages/*.js
Page.getInitialProps = async () => {
  // a object of i18n data
  const data = await fetch('https://...');
  // placeholder of keys, will be replaced by plugin
  const keys = '^__I18N_KEYS__$';
  const i18n = keys.reduce((obj, key) => (obj[key] = data[key], obj), {});

  return {
    i18n,
  };
}
```

## Author

👤 **Sora Liu <475212506@qq.com>**

* Github: [@lovesora](https://github.com/lovesora)

## 🤝 Contributing

Contributions, issues and feature requests are welcome!<br />Feel free to check [issues page](https://github.com/lovesora/next-i18n-keys-webpack-plugin/issues).

## Show your support

Give a ⭐️ if this project helped you!

## 📝 License

Copyright © 2019 [Sora Liu <475212506@qq.com>](https://github.com/lovesora).<br />
This project is [MIT](https://opensource.org/licenses/MIT) licensed.
