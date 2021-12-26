# @onepacs/user

&leftarrow; [Back to parent](../README.md)

This package manages the user session and preferences. It is also responsible for
timing out the user session once it expires.

Most of the code were copied and then modified from the WebViewer 1 packages.
* [onepacs-user](https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-user)

## Project structure

```bash
.
├── src/
│   ├── commands/         # extends existing cornerstone commands
│   ├── user/             # user identity, permission and redux store
│   ├── userPreferences/  # user preferences, migrations and redux store
│   ├── extension.js      # Impleent ohif viewer extension point
|   └── index.js          # entry point of this package
│
├── README.md               # This file
└── ...
```

