# @onepacs/i18n

&leftarrow; [Back to parent](../README.md)

This package contains localized resources for the WebViewer. The resources are organized into locales folder, followed by json files as separate namespaces.  See the [OHIF documentation on i18n](https://docs.ohif.org/viewer/internationalization.html) on how to make use of these resources in UI components.

See the [documentation on i18next](https://www.i18next.com/overview/api) if translation is needed outside a react component.

## Project structure

```bash
.
├── src/
│   └── locales/
│        ├── en/                    # English locale folder
|        |   ├── index.js           # English locale js module
|        |   └── MyNamespace.json   # English resources
|        ├── ...
|        └── fr/                    # French locale folder
|            ├── index.js           # French locale js module
|            └── MyNamespace.json   # French resources
│
├── README.md                       # This file
└── ...
```

## Usage

### Within a React component

```js
import { useTranslation } from 'react-i18next';

export function MyComponent() {
    // The 'Common' comes from the file name of
    // OnePacsWebViewer/packages/i18n/src/locales/en-US/Common.json
    const { t } = useTranslation('Common');
    return (
        <div>{t('About')}</div>
    )
}
```

### Outside a React component

```js
import i18next from 'i18next';

export function getAboutText() {
    return i18next.t('Common:About');
}
```
