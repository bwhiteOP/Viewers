# @onepacs/presentation-state

&leftarrow; [Back to parent](../README.md)

This package provides serialization/deserialization of presentation-states from DICOM images. It is also responsible for drawing annotation tools to viewport. 

Most of the code were copied and then modified from the WebViewer 1 packages.
* [onepacs-presentation-state](https://github.com/onepackius/OP_WEBV/tree/master/OnePacsWebViewer/packages/onepacs-presentation-state)


## Project structure

```bash
.
├── src/
│   ├── commands/             # extends existing cornerstone commands
│   ├── drawing/              # drawing graphical annotation to viewport
│   ├── presentation-states/  # retrieving, saving, loading of presentation states
│   ├── serialization/        # serialization/deserialization of a presentation-state
│   ├── extension.js          # Impleent ohif viewer extension point
|   └── index.js              # entry point of this package
│
├── README.md               # This file
└── ...
```



