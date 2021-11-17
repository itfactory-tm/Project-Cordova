$(function () {
    document.addEventListener("deviceReady", onDeviceReady());
});

let user = undefined;

function onDeviceReady() {
    // setTimeout(() => {
    //     cordova.plugins.backgroundMode.enable();
    //     cordova.plugins.backgroundMode.overrideBackButton();
    //     cordova.plugins.backgroundMode.setDefaults({
    //         title: "Next Deadline:",
    //         text: "knaapje",
    //         hidden: false,
    //     });
    //     cordova.plugins.backgroundMode.configure({
    //         title: "Next Deadline:",
    //         text: "knaapje",
    //         hidden: false,
    //     });
    //     navigator.vibrate([1000, 1000, 1000, 1000, 1000]);
    //     setInterval(() => {
    //         console.log("test");
    //     });
    //     cordova.plugins.backgroundMode.moveToBackground();
    // }, 1000);
    console.log("Device is ready");
    $(".error").hide();
    $("#newDeadlineMap").hide();
    Navigation.init();
    Login.init();
    NewGroup.init();
    NewDeadline.init();
    LoadMaps.init();
    $("#top-navigation-left").on("click", () => {
        navigator.vibrate([1000, 1000, 1000, 1000, 1000, 1000, 1000, 1000]);
        const media = new Media(
            cordova.file.applicationDirectory + "www/assets/sound.mp3"
        );
        console.log(media.getDuration());
        media.setVolume(1.0);
        media.play();
        const interval = setInterval(() => {
            window.plugins.flashlight.toggle();
        }, 100);
        setTimeout(() => {
            clearInterval(interval);
            window.plugins.flashlight.switchOff();
        }, 5000);
    });
}

// TODO
// https://gist.github.com/prof3ssorSt3v3/fe22e9cc031f53213900fcb8d010958f
