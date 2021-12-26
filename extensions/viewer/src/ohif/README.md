# Integration with @ohif/viewer

&leftarrow; [Back to parent](../../README.md)

The `@ohif/viewer` in the `Viewers` repo is the main client app. It is not possible to reference it from other packages.  Yet we need to expose some of the `@ohif/viewer` modules/classes so that `@onepacs/viewer` can extend its features. The `ohif/ohifViewerModulesProvider.js`  allows `@ohif/viewer` to register modules to be used in `@onepacs/viewer`.

## Usage

In `ohif/viewer`, specifically [Viewers/platform/viewer/src/integration/onepacs.js](../../../../../../Viewers/platform/viewer/src/integration/onepacs.js)

```js
import {
  getAppConfig,
  ohifViewerModulesProvider,
  OHIF_VIEWER_MODULE_TYPE,
} from '@onepacs/viewer';

import { ConnectedViewer } from 'path/to/ConnectedViewer';

ohifViewerModulesProvider.register(
    OHIF_VIEWER_MODULE_TYPE.CONNECTED_VIEWER,
    ConnectedViewer
);
```

Anywhere in `@onepacs/viewer`
```js
import {
    ohifViewerModulesProvider,
    OHIF_VIEWER_MODULE_TYPE
} from 'path/to/ohif/ohifViewerModulesProvider';

function MyReactComponent() {
    const ConnectedViewer = ohifViewerModulesProvider.get(
        OHIF_VIEWER_MODULE_TYPE.CONNECTED_VIEWER
    );

    return (
        <ConnectedViewer ... />
    );
}

```
