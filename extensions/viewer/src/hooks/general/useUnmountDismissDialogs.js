/* 
 * Copyright (c) 2020 OnePacs LLC, All rights reserved
 * December 01, 2020 by Jay Liu
 */

import { useDialog } from '@ohif/ui';
import { useMountUnmount } from './useMountUnmount';

/**
 * Dismiss all dialog when component unmounts.
 */
export function useUnmountDismissDialogs() {
    const dialogService = useDialog();
    useMountUnmount(
        undefined,
        () => { dialogService && dialogService.dismissAll(); }
    );
}
