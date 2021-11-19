// newDeadline.js
// The creation of a new deadline is handled here

const NewDeadline = (function () {
    // The parameters that are needed to create a new deadline
    const parameters = {
        title: "",
        description: "",
        group: "",
        date: "",
        lat: "",
        lng: "",
    };

    // Function that adds eventlisteners to buttons, does forms validation and makes the newDeadline api request
    const init = function () {
        _mapToggler();
        _notifyToggler();
        _updatePreview();

        // Eventlistener for when a new deadline should be created
        $(".create-deadline-button").on("click", () => {
            // If all fields are filled in, the program can continue
            if (_checkValues()) {
                // An api request is send to create the new deadline with the parameters specified
                $.getJSON(
                    "http://lennertsoffers.com/newDeadline?",
                    parameters,
                    function (id) {
                        // The api will return the id of the newly created deadline if there were no errors
                        console.log(`Deadline created: ${id}`);

                        // If the 'notify me' option is selected, the notification is created and sceduled here
                        // The notification will be a voice message including the name of the deadline and description
                        if ($("#notifyMeOption").prop("checked")) {
                            // You will be notified the day before the deadline and at the hour you specified
                            let dayBefore = new Date(parameters.date);
                            const now = new Date();
                            if ($("#notifyTimeOfDay").val() == "am") {
                                const hours =
                                    parseInt($("#notifyTime").val(), 10) + 12;
                                dayBefore.setHours(hours);
                            } else {
                                const hours =
                                    parseInt($("#notifyTime").val(), 10) + 12;
                                dayBefore.setHours(hours);
                            }
                            dayBefore.setDate(dayBefore.getDate() - 1);

                            // Convert the date to the amount of miliseconds until you should get notified
                            const millisecondsBeforeAlarm =
                                dayBefore.getTime() - now.getTime();

                            // Set the script of the notification
                            const text = `${parameters.title}, ${parameters.description}`;

                            // Play the voice message after the amount of miliseconds
                            const timeout = setTimeout(() => {
                                // The plugin tts is used to convert a text to a voice message
                                TTS.speak(
                                    {
                                        text: text,
                                        locale: "en-GB",
                                    },
                                    () => console.log(text),
                                    (error) => console.log(error)
                                );
                            }, millisecondsBeforeAlarm);

                            // Add an attribute <id of deadline> with value the timeout to the idTimeoutMapping object
                            // In this way, if you remove a deadline, the notification can be cancelled to
                            idTimeoutMapping[id] = timeout;
                        }
                        _clearTab();
                    }
                );
            }
        });
        $(".cancel-deadline-button").on("click", () => {
            _clearTab();
        });
    };

    // When you select 'enter location', you get the possibility to select a location on a map
    const _mapToggler = function () {
        $("#showDeadlineLocationOption").on("click", (e) => {
            if ($(e.target).prop("checked")) {
                $("#newDeadlineMap").slideDown();
            } else {
                $("#newDeadlineMap").slideUp();
            }
        });
    };

    // When you select 'notify me', you get the possibility to specify the time of the day you want to get notified
    const _notifyToggler = function () {
        $("#notifyMeOption").on("click", (e) => {
            if ($(e.target).prop("checked")) {
                $(".notifyTimePicker").slideDown();
            } else {
                $(".notifyTimePicker").slideUp();
            }
        });
    };

    // Clears all fields of the form and navigates to the deadlines page
    const _clearTab = function () {
        $("#deadline-title").val("");
        $("#deadline-subject").val("");
        $("#deadline-date").val("");
        $("#preview-title").text("");
        $("#preview-subject").text("");
        $(".error").hide();
        Navigation.toPage(0);
    };

    // Initializes the live preview of the deadline you are creating
    const _updatePreview = function () {
        $("#deadline-title").on("input", () => {
            $("#preview-title").text($("#deadline-title").val());
        });

        $("#deadline-subject").on("input", () => {
            $("#preview-subject").text($("#deadline-subject").val());
        });
    };

    // Checks if all required fields are filled in and assigns the values to the parameters object
    // If not, it displays an error message
    const _checkValues = function () {
        // If correctValues is still true at the end, _checkValues will return true
        let correctValues = true;
        $(".error").hide();

        // Title is filled in
        if ($("#deadline-title").val() === "") {
            $("#specify-title").show();
            correctValues = false;
        } else {
            parameters.title = $("#deadline-title").val();
        }

        // Description is filled in
        if ($("#deadline-subject").val() === "") {
            $("#specify-description").show();
            correctValues = false;
        } else {
            parameters.description = $("#deadline-subject").val();
        }

        // Date is selected
        if ($("#deadline-date").val() === "") {
            $("#specify-date").show();
            correctValues = false;
        } else {
            parameters.date = $("#deadline-date").val();
        }

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
