# @onepacs/cornerstone

&leftarrow; [Back to parent](../README.md)

This package provides customization to the `cornerstone` and `cornerstoneTools` library as well as adding new features on top of the existing `@ohif/extension-cornerstone` extension.  The package should contain no redux store nor any of the Viewers/UI logic.

Here are some of the implemented features
* register `webImageLoader` and `websocketImageLoader` with `cornerstone`
* override some `cornerstone` methods to support combined wado/websocket url as the `imageId`
* customize various annotation tools originally defined in the `cornerstoneTools` library

Many of the code were copied/modified from the WebViewer 1 packages.
* [onepacs-cornerstone-override](https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-cornerstone-overrides)
* [onepacs-image-loaders](https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-image-loaders)
* [onepacs-tools](https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-tools)

## Project structure

```bash
.
├── src/
│   ├── commands/        # Extends existing cornerstone commands
│   ├── image-loaders/   # Defines Web and Websocket image loaders
│   ├── overrides/       # Overrides default behaviour of the Cornerstone library
|   ├── tools/           # Customize annotation tools to replace some existing Cornerstone Tools.
│   ├── utils/
│   ├── extension.js     # Impleent ohif viewer extension point
|   └── index.js         # entry point of this package
│
├── README.md            # This file
└── ...
```

## Resources

* [Cornerstone documentation](https://docs.cornerstonejs.org/)
* [Cornerstone Tools documentation](https://tools.cornerstonejs.org/)
* [Cornerstone Tools source](https://github.com/cornerstonejs/cornerstoneTools)
* [@ohif/extension-cornerstone](https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/extensions/cornerstone)
