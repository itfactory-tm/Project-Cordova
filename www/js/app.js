$(function () {
    document.addEventListener("deviceReady", onDeviceReady());
});

let user = undefined;

function onDeviceReady() {
    console.clear();
    console.log("Device is ready");
    $(".error").hide();
    $("#newDeadlineMap").hide();
    Navigation.init();
    Login.init();
    NewGroup.init();
    NewDeadline.init();
    LoadMaps.init();
}

// TODO
// https://gist.github.com/prof3ssorSt3v3/fe22e9cc031f53213900fcb8d010958f
