// BackgroundMode.js
// Initialisation of the background plugin
// This plugin is used to make the app operate, even if it is moved to the background

const BackgroundMode = (function () {
    const init = function () {
        // A well known problem: The background mode variable isn't ready on 'onDeviceReady'
        // Wait 1 second for the recources to load
        setTimeout(() => {
            // This enables the app to operate in the background
            cordova.plugins.backgroundMode.enable();

            // The Android back button is overridden
            // It doesn't close the app but rather moves it to the background where it continues with operating
            cordova.plugins.backgroundMode.overrideBackButton();
        }, 1000);
    };

    return {
        init: init,
    };
})();
