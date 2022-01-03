/* 
 * Copyright (c) 2021 OnePacs LLC, All rights reserved
 * August 5, 2021 by Jay Liu
 */

//import { SimpleDialog } from '@ohif/ui';

export function getShowTextInputDialog(UIDialogService) {

    /**
     * Copy from the callInputDialog method of https://github.com/onepackius/Viewers/tree/OnePacs/8.0.1/extensions/cornerstone/src/init.js
     * @param {*} data 
     * @param {*} event 
     * @param {*} callback 
     */
    function textInputCallback(data, event, callback) {
        if (UIDialogService) {
            let dialogId = UIDialogService.create({
                centralize: true,
                isDraggable: false,
                content: <div></div>, //SimpleDialog.InputDialog,
                useLastPosition: false,
                showOverlay: true,
                contentProps: {
                    title: 'Enter your annotation',
                    label: 'New label',
                    measurementData: data ? { description: data.text } : {},
                    onClose: () => UIDialogService.dismiss({ id: dialogId }),
                    onSubmit: value => {
                        callback(value);
                        UIDialogService.dismiss({ id: dialogId });
                    },
                },
            });
        }
    }

    return textInputCallback;
}

