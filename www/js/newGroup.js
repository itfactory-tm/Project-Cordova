const NewGroup = (function () {
    const parameters = {
        username: "",
        name: "",
        colour: "",
    };

    let groupColours;

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

        // Groupname
        const groupNameString = $("#group-name").val();
        if (groupNameString !== "") {
            parameters.name = groupNameString;
            nameSpecified = true;
        } else {
            $("#specify-name").show();
        }

        // Colour
        const r = $("input#group-colour-r").val();
        const g = $("input#group-colour-g").val();
        const b = $("input#group-colour-b").val();
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
        } else if (groupColours.hasClass("selected")) {
            let colourString = $("div.selected").css("background-color");
            colourString = colourString.replace("rgb(", "rgba(");
            colourString = colourString.replace(")", ", 1)");
            parameters.colour = colourString;
            colourSpecified = true;
            console.log(parameters.colour);
        } else {
            $("#specify-colour").show();
        }

        if (nameSpecified && colourSpecified) {
            $.getJSON(
                "http://81.83.211.187:80/newGroup",
                parameters,
                function (data) {
                    console.log(`Group created: ${data}`);
                    _clearSelection();
                    Navigation.toPage(0);
                }
            );
        }
    };

    const _cancelGroup = function () {
        _clearSelection();
        Navigation.toPage(0);
    };

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
