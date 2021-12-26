/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * September 15, 2020 by Jay Liu
 */

/**
 * UI types
 */

/**
 * Type definition for the React.useState hook 
 */
export type useState<T> = [ T, React.Dispatch<React.SetStateAction<T>>];
