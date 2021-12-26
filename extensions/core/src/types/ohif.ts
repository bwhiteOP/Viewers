/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 16, 2020 by Jay Liu
 */

/**
 * This is the OHIF `JSON launch` schema.
 * It is meant to support a similar schema used by OHIF Viewer v1 (meteor.js based)
 * @see https://docs.ohif.org/deployment/#what-if-my-archive-doesnt-support-dicomweb
 * @see https://github.com/OHIF/Viewers/issues/1500
 */

import { Dictionary } from './general';

export interface OHIFStudy {
    StudyInstanceUID: string;   // "1.2...."
    StudyDescription: string;   // "CHEST"
    StudyDate: string;          // "20010109"
    StudyTime: string;          // "084353.000000"
    StudyDateUTC: string;
    PatientName: string;        // "MISTER^DX"
    PatientID: string;          // "3524578"
    PatientSex: string;         // "M"
    PatientHistory: string;
    InstitutionName: string;
    series: OHIFSeries[];
    displaySets?: DisplaySet[];
}

export interface DisplaySet {
    plugin: string;
    Modality: string;
    displaySetInstanceUID: string;
    wadoRoot: string;
    wadoUri: string;
    SOPInstanceUID: string;
    SeriesInstanceUID: string;
    StudyInstanceUID: string;
    authorizationHeaders: any;

    SeriesDescription?: string;
    SeriesNumber?: number;
    InstanceNumber?: number;
    numImageFrames?: number;
    frameIndex?: number;

    // https://github.com/OHIF/Viewers/issues/2259
    inconsistencyWarnings?: string[];
    reconstructionIssues?: string[];

    images?: OHIFImage[];
};

export interface OHIFImage extends OHIFMetadata {
    getImageId(frame?: number): string;
}

export interface OHIFSeries {
    SeriesDescription: string;  // "Research Derived series"
    SeriesInstanceUID: string;  // "2.25...."
    SeriesNumber: number;       // 99
    SeriesDate: string;         // "20200901"
    SeriesTime: string;         // "022440"
    Modality: string;           // "MR"
    instances: OHIFInstance[];
}

export interface OHIFInstance {
    metadata: OHIFMetadata;
    url: string;
}

export interface OHIFMetadata {
    Columns: number;            //  512
    Rows: number;               //  512
    InstanceNumber: number;     //  3
    NumberOfFrames: number;
    AcquisitionNumber: number;  //  0
    PhotometricInterpretation: string;  //  "MONOCHROME2"
    BitsAllocated: number;      //  16
    BitsStored: number;         //  16
    PixelRepresentation: number;  //  1
    SamplesPerPixel: number;    //  1
    PixelSpacing: number[];     // [0.390625, 0.390625]
    HighBit: number;            //  15
    ImageOrientationPatient: number[];  // [0,1,0,0,0,-1]
    ImagePositionPatient: number[];     // [11.600000,-92.500000, 98.099998]
    FrameOfReferenceUID: string;        //  "1.2.840.113619.2.5.1762583153.223134.978956938.470"
    ImageType: string[];        // ["ORIGINAL","PRIMARY","OTHER"]
    Modality: string;           //  "MR"
    TransferSyntax: string;
    SOPInstanceUID: string;
    SOPClassUID: string;
    SeriesInstanceUID: string;
    StudyInstanceUID: string;

    getData(): any;
    getDataProperty(propertyName: string): any;
    getObjectID(): string;
    setCustomAttribute(attribute: string, value: any): void;
    getCustomAttribute(attribute: string): any;
    customAttributeExists(attribute: string): boolean;
    setCustomAttributes(attributeMap: Object): void;
}

export interface OHIFContext {
    appConfig: any;
    activeContexts: string[];
}

export interface HotkeyDefinition {
    keys: string[];
    label: string;
}

export interface HotkeyCommand extends HotkeyDefinition {
    commandName: string;
}

export type HotkeyDictionary = Dictionary<HotkeyDefinition>;

export interface HotkeysManager {
    hotkeyDefaults: HotkeyCommand[];
    // The key is command name
    hotkeyDefinitions: HotkeyDictionary;

    setHotkeys(hotkeyDefinitions: HotkeyDictionary | HotkeyCommand[]): void;
    setDefaultHotkeys(hotkeyDefinitions: HotkeyDictionary | HotkeyCommand[]): void;
    restoreDefaultBindings(): void;
    registerHotkeys(hotkeyDefinition: HotkeyCommand): void;

    record(event): void;
    disable(): void;
    enable(): void;
    destroy(): void;
}

export interface OHIF {
    app: {
        commandsManager: any;
        hotkeysManager: HotkeysManager;
        servicesManager: any;
        extensionManager: any;
        AppContext: React.Context<OHIFContext>;
    }
    cornerstone: import('./cornerstone').cornerstone;
}
