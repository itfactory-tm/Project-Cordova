const NewDeadline = (function () {
    const parameters = {
        title: "",
        description: "",
        group: "",
        date: "",
        lat: "",
        lng: "",
    };

    const init = function () {
        _mapToggler();
        _updatePreview();
        $(".create-deadline-button").on("click", () => {
            if (_checkValues()) {
                $.getJSON(
                    "http://81.83.211.187:80/newDeadline?",
                    parameters,
                    function (data) {
                        console.log(`Deadline created: ${data}`);
                        let dayBefore = new Date(parameters.date);
                        dayBefore.setHours(12);
                        dayBefore.setMinutes(0);
                        dayBefore.setSeconds(0);
                        dayBefore.setMilliseconds(0);
                        dayBefore.setDate(dayBefore.getDate() - 1);
                        let id = data;
                        alert(id);
                        // cordova.plugins.notification.local.schedule({
                        //     id: id,
                        //     title: parameters.title,
                        //     text: parameters.description,
                        //     trigger: { at: dayBefore },
                        // });
                        _clearTab();
                    }
                );
            }
        });
        $(".cancel-deadline-button").on("click", () => {
            _clearTab();
        });
    };

    const _mapToggler = function () {
        $("#showDeadlineLocationOption").on("click", (e) => {
            if ($(e.target).prop("checked")) {
                $("#newDeadlineMap").show();
            } else {
                $("#newDeadlineMap").hide();
            }
        });
    };

    const _clearTab = function () {
        $("#deadline-title").val("");
        $("#deadline-subject").val("");
        $("#deadline-date").val("");
        $("#preview-title").text("");
        $("#preview-subject").text("");
        $(".error").hide();
        Navigation.toPage(0);
    };

    const _updatePreview = function () {
        $("#deadline-title").on("input", () => {
            $("#preview-title").text($("#deadline-title").val());
        });

        $("#deadline-subject").on("input", () => {
            $("#preview-subject").text($("#deadline-subject").val());
        });
    };

    const _checkValues = function () {
        let correctValues = true;
        $(".error").hide();
        if ($("#deadline-title").val() === "") {
            $("#specify-title").show();
            correctValues = false;
        } else {
            parameters.title = $("#deadline-title").val();
        }
        if ($("#deadline-subject").val() === "") {
            $("#specify-description").show();
            correctValues = false;
        } else {
            parameters.description = $("#deadline-subject").val();
        }
        if ($("#deadline-date").val() === "") {
            $("#specify-date").show();
            correctValues = false;
        } else {
            parameters.date = $("#deadline-date").val();
        }
        parameters.username = "test";
        parameters.group = $("#deadline-group").val();
        parameters.lat = LoadMaps.latLng.lat;
        parameters.lng = LoadMaps.latLng.lng;
        LoadMaps.latLng.lat = 1000;
        LoadMaps.latLng.lng = 1000;
        return correctValues;
    };

    return {
        init: init,
    };
})();
