/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 05, 2020 by Jay Liu
 */

import './Viewer.styl';
import './variables.css';
import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { getViewports } from '../../redux/selectors/viewports';
import { ohifViewerModulesProvider, OHIF_VIEWER_MODULE_TYPE } from '../../ohif/ohifViewerModulesProvider';
import { ToolbarRow as OnePacsToolbarRow } from '../Toolbar/ToolbarRow';
import { StudyBrowser as OnePacsStudyBrowser } from '../StudyBrowser/StudyBrowser';
import {
    useAfterUserPreferencesLoaded,
    useAutoPlayCineDialog,
    useInitialLayout,
    useLoadPresentationStates,
    useMeasurementApi,
    usePanels,
    useTimepointApi,
} from './initialization';
import {
    useOhifContext,
    useUnmountDismissDialogs,
} from '../../hooks';

/**
 * OnePacs customized Viewer React component.
 * This is heavily modified from the OHIF Viewer class. The Header and Measurement panel are removed.
 * The ToolbarRow is a customized Toolbar from OnePacs.
 * @see https://github.com/onepackius/Viewers/blob/OnePacs/master/platform/viewer/src/connectedComponents/ConnectedViewer.js
 * @param {*} props
 */
export function Viewer({
    studies,
    isStudyLoaded,
    studyInstanceUIDs,
}) {
    const { appConfig } = useOhifContext();
    const viewports = useSelector(getViewports);
    const { activeViewportIndex } = viewports;

    useInitialLayout(studies);
    useLoadPresentationStates(studies);
    useAutoPlayCineDialog();
    useUnmountDismissDialogs();
    const { viewportStyle } = useAfterUserPreferencesLoaded();
    const timepointApi = useTimepointApi(studies, studyInstanceUIDs);
    useMeasurementApi(studies, isStudyLoaded, timepointApi);
    const { leftPanel, rightPanel } = usePanels();
    const LeftPanelComponent = leftPanel.panel?.component;
    const RightPanelComponent = rightPanel.panel?.component;

    /** Exported object from @ohif/viewer */
    // const OhifStudyBrowser = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.ConnectedStudyBrowser);
    const ConnectedViewerMain = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.ConnectedViewerMain);
    const SidePanel = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.SidePanel);
    const ErrorBoundaryDialog = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.ErrorBoundaryDialog);
    const OhifToolbarRow = ohifViewerModulesProvider.get(OHIF_VIEWER_MODULE_TYPE.ToolbarRow);

    const ToolbarRow = appConfig.onePacs.useOnePacs ? OnePacsToolbarRow : OhifToolbarRow;


    return (
        <>
        {/* TOOLBAR */}
        <ErrorBoundaryDialog context="ToolbarRow">
            <ToolbarRow
                studies={studies}
                isLeftPanelOpen={leftPanel.isOpen}
                isRightPanelOpen={rightPanel.isOpen}
                selectedLeftPanel={leftPanel.panelId}
                selectedRightPanel={rightPanel.panelId}
                selectLeftPanel={leftPanel.selectPanel}
                selectRightPanel={rightPanel.selectPanel}
            />
        </ErrorBoundaryDialog>

        {/* VIEWPORTS + SIDEPANELS */}
        <div className="FlexboxLayout">
            {/* LEFT */}
            <ErrorBoundaryDialog context="LeftSidePanel">
                <SidePanel from="left" isOpen={leftPanel.isOpen}>
                    {LeftPanelComponent ? (
                        // @ts-ignore
                        <LeftPanelComponent
                            viewports={viewports}
                            studies={studies}
                            activeIndex={activeViewportIndex}
                        />
                    ) : (
                        // <OhifStudyBrowser studies={studies} />
                        <OnePacsStudyBrowser studies={studies} />
                    )}
                </SidePanel>
            </ErrorBoundaryDialog>

            {/* MAIN */}
            <div className={classNames('main-content')} style={viewportStyle}>
                <ErrorBoundaryDialog context="ViewerMain">
                    <ConnectedViewerMain
                        studies={studies}
                        isStudyLoaded={isStudyLoaded}
                    />
                </ErrorBoundaryDialog>
            </div>

            {/* RIGHT */}
            <ErrorBoundaryDialog context="RightSidePanel">
                <SidePanel from="right" isOpen={rightPanel.isOpen}>
                    {RightPanelComponent && (
                        // @ts-ignore
                        <RightPanelComponent
                            isOpen={rightPanel.isOpen}
                            viewports={viewports}
                            studies={studies}
                            activeIndex={activeViewportIndex}
                        />
                    )}
                </SidePanel>
            </ErrorBoundaryDialog>
        </div>
        </>
    )
}

Viewer.propTypes = {
    studies: PropTypes.arrayOf(
        PropTypes.shape({
            StudyInstanceUID: PropTypes.string.isRequired,
            StudyDate: PropTypes.string,
            PatientID: PropTypes.string,
            displaySets: PropTypes.arrayOf(
                PropTypes.shape({
                    displaySetInstanceUID: PropTypes.string.isRequired,
                    SeriesDescription: PropTypes.string,
                    SeriesNumber: PropTypes.number,
                    InstanceNumber: PropTypes.number,
                    numImageFrames: PropTypes.number,
                    Modality: PropTypes.string.isRequired,
                    images: PropTypes.arrayOf(
                        PropTypes.shape({
                            getImageId: PropTypes.func.isRequired,
                        })
                    ),
                })
            ),
        })
    ),
    studyInstanceUIDs: PropTypes.array,
    isStudyLoaded: PropTypes.bool,
};
