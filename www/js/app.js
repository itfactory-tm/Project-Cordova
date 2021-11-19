// App.js
// This is the js file where te project comes together
// In the onDeviceReady function, all partials are intitialized

let user = undefined;
let idTimeoutMapping = {};

$(function () {
    document.addEventListener("deviceReady", onDeviceReady());
});

function onDeviceReady() {
    // Hide optional error messages and optional functionalities
    $(".error").hide();
    $("#newDeadlineMap").hide();
    $(".notifyTimePicker").hide();

    // Initialization of the building blocks of the application
    // Please read the code in this order
    Navigation.init();
    Login.init();
    NewGroup.init();
    NewDeadline.init();
    LoadMaps.init();
    BackgroundMode.init();
}
