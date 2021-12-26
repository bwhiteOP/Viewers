# Viewers Configuration

&leftarrow; [Back to parent](../../README.md)

The [config/appConfig.js](./src/config/appConfig.js) module exports a configuration provider that is used by `@ohif/viewer` on startup of the viewer application. The configuration provider can be a javascript object or a method that returns the object. The appConfig itself looks like this:

```js
{
    // default: '/'
    routerBasename: '/',
    extensions: extensions,
    showStudyList: true,
    filterQueryParam: false,
    servers: servers,
    hotkeys: hotkeys,
    onePacs: onePacs,
    cornerstoneExtensionConfig: cornerstoneExtensionConfig
}
```

The `extensions` configuration provides additional features to `@ohif/viewer` via the built in [extension mechanism](https://docs.ohif.org/extensions/).

The `onePacs` configuration customizes the various OHIF packages by adding/removing certain existing OHIF features.

The `cornerstoneExtensionConfig` configuration is imported from the [@onepacs/cornerstone](../cornerstone/README.md) package and add/customizes existing [cornerstone tools](https://tools.cornerstonejs.org/).

For more detail about configuration, see the OHIF docs.
* https://docs.ohif.org/configuring/
* https://docs.ohif.org/viewer/configuration.html
