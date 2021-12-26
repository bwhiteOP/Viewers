/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 20, 2020 by Jay Liu
 */

import OHIF from '@ohif/core';
import dcmjs from 'dcmjs';

import { appInfo } from '@onepacs/core';
import {
    serializeRelationshipModule,
    serializeSoftcopyVoiLutModule,
    serializeDisplayedAreaModule,
    serializeSpatialTransformationModule,
    serializeGraphicAnnotationModule
} from '../serialization';

export default function (enabledElement, instance) {
    const { viewport, canvas, image } = enabledElement;
    if (!viewport || !canvas || !image) {
        return;
    }

    const { utils: { sopClassDictionary }} = OHIF;

    /** @type {{ DicomMetaDictionary: any, DicomDict: any }} */
    const { DicomMetaDictionary, DicomDict } = dcmjs.data;
    const currentDate = DicomMetaDictionary.date();
    const currentTime = DicomMetaDictionary.time();
    const seriesInstanceUID = DicomMetaDictionary.uid();
    const sopInstanceUID = DicomMetaDictionary.uid();

    const referencedSeriesSequence = serializeRelationshipModule(instance);
    const softcopyVOILUTSequence = serializeSoftcopyVoiLutModule(instance, viewport);
    const displayedAreaSelectionSequence = serializeDisplayedAreaModule(enabledElement, instance);
    const spatialTransformationModule = serializeSpatialTransformationModule(viewport);
    const graphicAnnotationModule = serializeGraphicAnnotationModule(enabledElement, instance);

    const prDataset = {
        // UIDs
        SOPClassUID: sopClassDictionary.GrayscaleSoftcopyPresentationStateStorage,
        StudyInstanceUID: instance.StudyInstanceUID,
        SeriesInstanceUID: seriesInstanceUID,
        SOPInstanceUID: sopInstanceUID,
        // Patient
        PatientName: instance.PatientName || '',
        PatientID: instance.PatientID || '',
        IssuerOfPatientID: instance.IssuerOfPatientID || '',
        // Study
        StudyID: instance.StudyID,
        StudyDate: instance.StudyDate,
        StudyTime: instance.StudyTime,
        StudyDescription: instance.StudyDescription,
        ReferringPhysicianName: instance.ReferringPhysicianName,
        // Series
        SeriesDate: currentDate,
        SeriesTime: currentTime,
        SeriesDescription: 'FOR_PRESENTATION',
        Modality: 'PR',
        // Instance
        InstanceNumber: '999',
        // General equipment
        SoftwareVersions: appInfo.version,
        Manufacturer: appInfo.author,
        ManufacturerModelName: appInfo.description,
        ContentLabel: 'FOR_PRESENTATION',
        InstitutionName: instance.InstitutionName || '',
        // Presentation State
        PresentationCreationDate: currentDate,
        PresentationCreationTime: currentTime,
        // Sequences
        ReferencedSeriesSequence: referencedSeriesSequence,
        SoftcopyVOILUTSequence: softcopyVOILUTSequence,
        DisplayedAreaSelectionSequence: displayedAreaSelectionSequence,
        ...spatialTransformationModule,
        ...graphicAnnotationModule,
        _meta: {
            FileMetaInformationVersion: {
                Value: new Uint8Array([0, 1]).buffer
            }
        }
    };

    const prMeta = DicomMetaDictionary.denaturalizeDataset({
        FileMetaInformationVersion: prDataset._meta.FileMetaInformationVersion.Value[0],
        MediaStorageSOPClassUID: prDataset.SOPClassUID,
        MediaStorageSOPInstanceUID: prDataset.SOPInstanceUID,
        TransferSyntaxUID: '1.2.840.10008.1.2',
        ImplementationClassUID: DicomMetaDictionary.uid(),
        ImplementationVersionName: `${appInfo.name}-${appInfo.version}`
    });

    const prDicomDict = new DicomDict(prMeta);
    prDicomDict.dict = DicomMetaDictionary.denaturalizeDataset(prDataset);

    return prDicomDict.write();
}
