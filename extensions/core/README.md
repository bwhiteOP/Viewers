# @onepacs/core

&leftarrow; [Back to parent](../README.md)

This package contains the core library that is shared with the server and all the viewer packages. It is the only package that targets both the server and browser environments. As a result, the `package.json`, `babel.config.js` and `webpack.config.js` configuration files are different from the other packages.

## Project structure

```bash
.
├── src/
│   ├── types/                    # Typescript type definitions
│   ├── both/                     # Contains js modules for server/client
|   |   └── ...
|   |
│   ├── client/                   # Contains js modules for client only
|   |   ├── publicSettings.js     # For accessing public settings.json
|   |   ├── settings.public.json  # Public settings file to be overwritten at built time
|   |   └── ...
|   |
│   ├── server/                   # Contains JS modules for server only
|   |   └── ...
|   |
|   ├── browser.js                # Entry point for browser/client
|   └── index.js                  # Entry point for node/server
│
├── README.md                     # This file
└── ...
```

## Usage

Here are some of the most commonly used modules in this package.
```js
// For both server/client
import { types, log } from '@onepacs/core';

// For client only
import { localStorageUtils, publicSettings } from '@onepacs/core';
```

## Build Configurations

### package.json

The [main](https://docs.npmjs.com/files/package.json#main) field is the primary entry point for server, whereas the [browser](https://docs.npmjs.com/files/package.json#browser) field is the entry point for browser.

<table>
<tr>
    <th> @onepacs/core </th>
    <th> browser only packages </th>
</tr>
<tr><td>

```json
{
    "main": "dist/index.umd.js",
    "browser": "dist/browser.umd.js",
    "types": "dist/browser.d.ts",
}
```

</td>
<td>

```json
{
    "main": "dist/index.umd.js",
    "module": "src/index.js",
    "types": "dist/index.d.ts",
}
```

</td></tr>
</table>

### Babel and Webpack configuration

This package uses the customized [babel.base.js](../../babel.base.js) and [webpack.base.js](../../webpack.base.js) files in the root of `OnePacsWebViewer` folder. The other packages built only for the viewer make use of the base configuration files from the `Viewers` repo.

In addition, the [webpack.config.js](./webpack.config.js) exports configurations of both target environments. See the [webpack documentation on targets](https://webpack.js.org/concepts/targets/) for more details.

```js
const serverConfig = webpackBase({ ROOT_DIR, SRC_DIR, DIST_DIR, pkg, TARGET: 'node' });
const clientConfig = webpackBase({ ROOT_DIR, SRC_DIR, DIST_DIR, pkg, TARGET: 'web' });

module.exports = [ serverConfig, clientConfig ]
```

## Development

The `onepacs/core` package is shared between the server (node) and client (windows). Even though they both uses javascript, writing code that runs in the browser is different from code that runs in node.js.

For one thing, the global `document` and `window` exist in the browser but not in node.js.  The [window.performance](https://developer.mozilla.org/en-US/docs/Web/API/Window/performance) and the [node.js performance](https://nodejs.org/api/perf_hooks.html) both have the method `performance.now()` but are quite different otherwise.

Makesure the code work on their target platform and place the code in `both`, `client` folders accordingly. A `server` only folder can also be added by including it in the `index.js`, which is the entry point when run via node.js.

For more information, see the differences between [Node.js and the Browser](https://nodejs.dev/learn/differences-between-nodejs-and-the-browser).

