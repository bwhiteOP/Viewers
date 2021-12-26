/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 09, 2020 by Jay Liu
 */

import React from 'react';
import { ohifViewerModulesProvider, OHIF_VIEWER_MODULE_TYPE } from '../../ohif/ohifViewerModulesProvider';
import withTooltip from '../withTooltip';
import withMouseEvent from '../withMouseEvent';

function LayoutButton(props) {
    const ConnectedLayoutButton = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.ConnectedLayoutButton);
    return (
        <ConnectedLayoutButton {...props} />
    )
}

export default withTooltip(withMouseEvent(LayoutButton));
