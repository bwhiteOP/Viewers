# @onepacs/viewer

&leftarrow; [Back to parent](../README.md)

## Project structure

This package serves as the primary integration point between `@ohif/viewer` and all the `@onepacs/packages`.

```bash
.
├── src
│   ├── commands/             # extends existing cornerstone commands
│   ├── components/           # customized components
│   ├── config/               # configuration for @ohif/viewer
│   ├── hooks/                # reusable react hooks
│   ├── init/                 # reusable react hooks
│   ├── ohif/                 # Integration with @ohif/viewer
│   ├── redux/                # helper for working with redux store
|   ├── routes/               # React-router extensions for @ohif/viewer
|   ├── ...                   #
|   ├── toolbar/              # OnePacs customized toolbar
|   ├── viewport/             # OnePacs customized viewport and viewport overlay
│   ├── extension.js          # Impleent ohif viewer extension point
|   └── index.js              # entry point of this package
│
├── README.md               # This file
└── ...
```

## Viewers configuration

See [config/README.md](./src/config/README.md).

## Integration with `@ohif/viewer`

See [ohif/README.md](./src/ohif/README.md).

## OnePacs specific routes

See [routes/README.md](./src/routes/README.md).
