
    // Wait for device API libraries to load
    //
    function onLoad() {
        document.addEventListener("deviceready", onDeviceReady, false);
    }

    // device APIs are available
    //
    function onDeviceReady() {
        document.addEventListener("pause", onPause, false);
        document.addEventListener("resume", onResume, false);
    }


    // Handle the pause event
    //
    function onPause() {
    }

    // Handle the resume event
    //
    function onResume() {
    }
