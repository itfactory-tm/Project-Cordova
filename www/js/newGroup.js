// newGroup.js
// The creation of a new group is handled here

const NewGroup = (function () {
    // The parameters that are needed to create a new group
    const parameters = {
        username: "",
        name: "",
        colour: "",
    };

    let groupColours;

    // Function that adds eventlisteners to buttons in create group tab and the colour picker
    const init = function () {
        const createButton = $("#new-group-tab .create-button");
        const cancelButton = $("#new-group-tab .cancel-button");
        groupColours = $("#colours div");

        createButton.on("click", _createGroup);
        cancelButton.on("click", _cancelGroup);
        groupColours.on("click", (selectedColour) => {
            const wasSelected = $(selectedColour.target).hasClass("selected");
            groupColours.removeClass("selected");
            if (!wasSelected) {
                $(selectedColour.target).addClass("selected");
            }
        });
    };

    const _createGroup = function () {
        $(".error").hide();
        // Username
        parameters.username = user;

        let nameSpecified = false;
        let colourSpecified = false;

        // If the groupname isn't specified the app shows an error messagage
        // Else it sets the value of the name attribute of the parameters and sets the nameSpecified boolean to true
        const groupNameString = $("#group-name").val();
        if (groupNameString !== "") {
            parameters.name = groupNameString;
            nameSpecified = true;
        } else {
            $("#specify-name").show();
        }

        // Put the values of the textboxes in r, b, g
        // These can be empty if the colour is specified by the colour picker
        const r = $("input#group-colour-r").val();
        const g = $("input#group-colour-g").val();
        const b = $("input#group-colour-b").val();

        // If all tree are filled in and between 0 and 255, an rgba colour is created
        if (r !== "" && g !== "" && b !== "") {
            if (
                r >= 0 &&
                r <= 255 &&
                g >= 0 &&
                g <= 255 &&
                b >= 0 &&
                b <= 255
            ) {
                parameters.colour = `rgba(${r}, ${g}, ${b}, 1)`;
                colourSpecified = true;
            } else {
                $("#not-a-colour").show();
            }
        }

        // If the textboxes aren't filled in, but a colour is selected via the colour picker, we continue with this value
        else if (groupColours.hasClass("selected")) {
            // Get the backgroundColour of the selected colour
            let colourString = $("div.selected").css("background-color");

            // Make this colour an rgba colour
            colourString = colourString.replace("rgb(", "rgba(");
            colourString = colourString.replace(")", ", 1)");
            parameters.colour = colourString;
            colourSpecified = true;
        }

        // No colour is filled in so show an error
        else {
            $("#specify-colour").show();
        }

        // If both the name and colour are specified, the api request can be completed
        if (nameSpecified && colourSpecified) {
            // The url is appended with the parameters username, name and colour
            $.getJSON(
                "http://lennertsoffers.com/plennert/newGroup",
                parameters,
                function (data) {
                    // 'data' will contain the id of the newly created group if there was no server error due to an incomplete request url
                    console.log(`Group created: ${data}`);

                    // Clear the textboxes and the selected colour
                    _clearSelection();

                    // Navigate to the deadlines page
                    Navigation.toPage(0);
                }
            );
        }
    };

    // Function that is called when the cancel button is pushed
    // It clears all data that is filled in an navigates you to the deadlines page
    const _cancelGroup = function () {
        _clearSelection();
        Navigation.toPage(0);
    };

    // Function to clear all textboxes and the border on the selected colour of the colour picker
    const _clearSelection = function () {
        $("#group-name").val("");
        $("div.selected").removeClass("selected");
        $("input#group-colour-r").val("");
        $("input#group-colour-g").val("");
        $("input#group-colour-b").val("");
    };

    return {
        init: init,
    };
})();
