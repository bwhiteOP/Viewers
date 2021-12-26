/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * October 29, 2020 by Jay Liu
 */

import { Dictionary } from './general';

/**
 * Type definition of the user preferences saved in the OnePacs server.
 * The preferences are saved in the `user_app_prefs` database table.
 */
export interface UserPreferences {
    advanced?: AdvancedPreferences;
    annotation?: AnnotationPreferences;
    general?: GeneralPreferences;
    hangingProtocols?: HangingProtocolsPreferences;
    hotKeys?: HotKeysPreferences;
    layout?: LayoutPreferences;
    mouseToolsets?: MouseToolsetsPreferences;
    /** @deprecated */ seriesPanel?: SeriesPanelPreferences;
    panel?: PanelPreferences;
    suv?: SuvPreferences;
    wlPresets?: WLPresetsPreferences;
}

export interface AdvancedPreferences {
    BandwidthSavingModeEnabled: boolean;
    WebGLEnabled: boolean;
    PathologyEnabled: boolean;
}

export interface AnnotationPreferences {
    FontSizeScale: number;
}

export interface GeneralPreferences {
    MeasurementPrecision?: number;
    MultiframeAutoPlayCineEnabled?: boolean;
    ScaleOverlayEnabled?: boolean;
}

export type HangingProtocolsPreferences = Dictionary<string>;
export type HotKeysPreferences = Dictionary<string>;

export type LayoutPreferences = Layout[];
export interface Layout {
    modality: string;
    rows: number;
    columns: number;
}

export interface MouseToolsetsPreferences {
    activeIndex?: number;
    toolsets?: MouseToolset[];
}

export interface MouseToolset {
    Left: string;
    Middle: string;
    Right: string;
}

/**
 * This preferences is only used in v1.
 * @see PanelPreferences should be used instead.
 * @deprecated
 */
export interface SeriesPanelPreferences {
    isVisible: boolean;
}

export interface PanelPreferences {
    left?: { isOpen: boolean, panel?: string };
    right?: { isOpen: boolean, panel?: string,  };
}

export interface SuvPreferences {
    SuvBwEnabled: boolean;
    SuvBsaEnabled: boolean;
    SuvLbmEnabled: boolean;
}

export type WLPresetsPreferences = Dictionary<WLPreset>;
export interface WLPreset {
    id?: string;
    ww?: number;
    wc?: number;
}
