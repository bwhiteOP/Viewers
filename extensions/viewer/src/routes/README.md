# OnePacs specific routes

&leftarrow; [Back to parent](../../README.md)

The `onepackius/Viewer` repo is customized to allow `routes` extension point. The `routes` folder contains two additional routes:

1. `/studylist`

    * Displays a study list for local testdata downloaded from a OnePacs cluster.
    * Redirect to the `/viewer` route when a row is selected.
    * See [OnePacsWebViewer/.testing](../../.testing/README.md) for more details.

1. `/view/:requestId`

    * The primary routes for viewing a study from OnePacs
    * If the `requestId` is not specified, it is redirected from the study list.
    * The `ViewerRouting` module is where we can customize the look and feel of the OnePacs WebViewer.
