// FillData.js
// In this file, you can find the code to make api calls to the restAPI
// Deadline cards are appended and separated per day
// Groups are appended

const FillData = (function () {
    let filterList = [];
    const init = function () {
        // If there is an userFilterMapping stored in localstorage, it is passed on to the setFilterList function
        // userFilterMapping: Each user mapped to an array of id's that represent the groups that are filtered
        if (
            localStorage.getItem("userFilterMapping") !== null &&
            localStorage.getItem("userFilterMapping") !== undefined
        ) {
            setFilterList(
                JSON.parse(localStorage.getItem("userFilterMapping"))[
                    // Only give the array that belongs to the user that is logged in
                    localStorage.getItem("loggedInUser")
                ]
            );
        }

        _clearNodes();
        _fillLogin();
        _fillGroups();
        _fillAgenda();
    };

    // Function to set value array that corresponds to the current user
    // This array is used to decide whether to display a deadline or not
    // The data is stored in local storage so the user doesn't have to set a new filter every times he/she uses the app
    const setFilterList = function (list) {
        filterList = list;

        // There is no userFilterMapping in local storage
        // We create a completely new array that is equal to the filterlist
        // This is being checked again because multiple functions use this function
        if (localStorage.getItem("userFilterMapping") == null) {
            const jsonMapping = {};
            jsonMapping[user] = filterList;
            localStorage.setItem(
                "userFilterMapping",
                JSON.stringify(jsonMapping)
            );
        }

        // There is userFilterMapping in local storage
        // The array in localstorage that belons to this user is updated with the new filterlist
        else {
            let userFilterMapping = JSON.parse(
                localStorage.getItem("userFilterMapping")
            );
            userFilterMapping[user] = filterList;
            localStorage.setItem(
                "userFilterMapping",
                JSON.stringify(userFilterMapping)
            );
        }
    };

    // Function to fill in the username of the user that was last logged in
    // If there is a last logged in username stored in localstorage
    const _fillLogin = function () {
        if (localStorage.getItem("loggedInUser") != null) {
            $("#login-username").attr(
                "value",
                localStorage.getItem("loggedInUser")
            );
        }
    };

    // Function to append all the groups for this user account to the groups tab
    const _fillGroups = function () {
        // This api call doesn't need parameters
        $.getJSON("http://lennertsoffers.com/getGroups", function (data) {
            // An array of groups is returned an is now in the variable 'data'
            // We loop trough each group in 'data'
            $.each(data, function (index, value) {
                // If the user property of this group corresponds to the currend user
                // The group is added to the groups tab with its data
                if (value.user.username === user) {
                    // Appends the user to the filter tab
                    $("#groups-tab").append(
                        `<div data-deSelect="false" data-colour="${value.colour}" class="group-box d-flex justify-content-between align-items-center mb-3">
                            <div class="group-title pl-2">${value.name}</div>
                            <div class="remove-group trash pr-2">
                                <i data-id="${value.id}" class="fas fa-trash"></i>
                            </div>
                        </div>`
                    );

                    // Appends the user to the dropdown menu on the create deadline screen
                    $("#deadline-group option").removeAttr("selected");
                    $("#deadline-group").append(
                        `<option selected value="${value.name}">${value.name}</option>`
                    );
                }
            });

            // Selects the last added group from the dropdown
            $("#deadline-group option:last-child").attr("selected");

            // We loop over each group to set the colour of the box
            $("#groups-tab .group-box").each(function () {
                const groupBox = $(this);
                // The colour is already stored in a data tag when the html was appended earlier
                let colour = groupBox.data("colour");

                // Here we create an array of the colour stored in the data tag
                colour = colour.replace("rgba(", "");
                colour = colour.replace(")", "");
                const rgbaArray = colour.split(", ");

                // This code seems to replace an rgba value with the same value, but this is not the case
                // When the data is retrieved from the API, there is no alpha value, or it is other than 1
                // We set the alpha value to one
                groupBox.css(
                    "background-color",
                    "rgba(" +
                        rgbaArray[0] +
                        "," +
                        rgbaArray[1] +
                        "," +
                        rgbaArray[2] +
                        "," +
                        1 +
                        ")"
                );

                // If the contrast between the text and the colour of the box is too low
                // The text colour is replaced by a lighter colour
                if (
                    (299 * rgbaArray[0] +
                        587 * rgbaArray[1] +
                        114 * rgbaArray[2]) /
                        1000 <
                    50
                ) {
                    groupBox.css("color", "#aaa");
                }

                // If there is a filterlist stored in localstorage for the current user
                // We update the value of the background colour for this group
                if (filterList !== undefined) {
                    if (filterList.includes(groupBox.find("i").data("id"))) {
                        let backgroundColour = groupBox
                            .css("background-color")
                            .replace("rgb(", "rgba(")
                            .replace(")", `, 0.6)`);
                        groupBox.data("deSelect", "true");
                        groupBox.css("background-color", backgroundColour);
                    }
                }
            });

            // Add an event listener to the trash bin icon to delete the group
            $(".remove-group i").on("click", (e) => {
                // We are redirected to the removeGroup function in removeItems.js
                RemoveItems.removeGroup(e);
            });

            // Setting a new filter
            // Eventlistener on whole group card in the filter tab
            $("#groups-tab>div.group-box").on("click", (e) => {
                const group = $(e.target);
                // Retrieve the groupId that is added in the html when the group was appended
                let groupId = group.find("i").data("id");
                // if (groupId === undefined) {
                //     groupId = group
                //         .parent("div.group-box")
                //         .find("i")
                //         .data("id");
                // }
                if (groupId !== undefined) {
                    // The boolean deSelect means if the class should be removed from the filter when it gets tapped or clicked

                    // If the group has the class deSelect (should've be added if this group was in the filterlist record in localstorage)
                    if (group.data("deSelect") == "true") {
                        // The colour without alpha value gets created
                        let backgroundColour = $(e.target)
                            .css("background-color")
                            .replace("rgba(", "rgb(")
                            .replace(", 0.6)", ")");

                        // Next time the group gets clicked, it should be deSelected again
                        // (So added to the groups that are filtered out of the deadlines)
                        group.data("deSelect", "false");
                        group.css("background-color", backgroundColour);

                        // Update the filterlist record in localstorage
                        setFilterList(
                            // Returns the filterlist without the id of the group that was reselected
                            filterList.filter((item) => item !== groupId)
                        );
                    }

                    // The group wasn't deselected which means it should be deselected now
                    else {
                        // Create new background colour from original with alpha value 0.6
                        let backgroundColour = $(e.target)
                            .css("background-color")
                            .replace("rgb(", "rgba(")
                            .replace(")", `, 0.6)`);
                        group.data("deSelect", "true");
                        group.css("background-color", backgroundColour);

                        // If there was no filterlist, it should be initialized because we will add an id to it
                        if (filterList === undefined) {
                            filterList = [];
                        }

                        // Create a local variable of filterlist because the setFilterList functions takes an array as argument
                        let localFilterList = filterList;
                        localFilterList.push(groupId);
                        setFilterList(localFilterList);
                    }
                }
            });
        });
    };

    // Function to append all the deadlines for this user account to the deadlines tab
    const _fillAgenda = function () {
        // The api call to get all the deadlines doens't take any arguments
        $.getJSON("http://lennertsoffers.com/getDeadlines", function (data) {
            let dateList = [];
            let dateMap = {};

            // Sorts all the deadlines on date and then on group
            data.sort(function (a, b) {
                if (a.date == b.date) {
                    return a.group.id > b.group.id ? 1 : -1;
                }
                return a.date > b.date ? 1 : -1;
            });

            // Loop over sorted array of deadlines
            $.each(data, function (key, value) {
                if (value.group.user.username === user) {
                    const deadline = data[key];
                    const date = data[key].date;

                    // Add new date line to subdivide the deadlines per day
                    // This line only gets added when this is the first time the date occurs in the array of deadines
                    // We keep track of all the dates that were already added in the datelist array
                    if (!dateList.includes(date)) {
                        let days = [
                            "Sunday",
                            "Monday",
                            "Tuesday",
                            "Wednesday",
                            "Thursday",
                            "Friday",
                            "Saturday",
                        ];
                        const formatDate = new Date(date);
                        // We want the full name of the day of week
                        // days[formatDate.getDay()] selects the name of the weekday
                        $("#deadline-tab").append(
                            `<div data-date="${date}" class="date-group">
                                <div class="date mb-2">${
                                    days[formatDate.getDay()]
                                } - ${formatDate.getDate()}/${
                                formatDate.getMonth() + 1
                            }</div>
                            </div>`
                        );
                    }

                    // The date of the deadline gets added to the dateList
                    dateList.push(date);

                    // A new field is added to the dateMap object
                    // These fields will be used later to check if there are deadlines under this date
                    // It is possible that there won't be any because of the filter function
                    if (!dateMap[date] === true) {
                        dateMap[date] = false;
                    }

                    // Instanciate the filterList if it doesn't exist to not get an error when we use the includes method
                    if (filterList === undefined) {
                        filterList = [];
                    }

                    // Only append the deadline when the group this deadline is in is not filtered on
                    if (!filterList.includes(deadline.group.id)) {
                        // There is at least one dealine below the date
                        dateMap[date] = true;
                        $(`div[data-date*=${date}]`).append(
                            `<div class="box">
                                <div data-colour="${deadline.group.colour}" class="group"></div>
                                <div class="content px-2 d-flex flex-column justify-content-center">

                                    <div class="d-flex flex-row justify-content-between py-1">
                                        <div>
                                            <div class="title">${deadline.title}</div>
                                            <div class="subject">${deadline.description}</div>
                                        </div>
                                        <div class="remove-deadline trash d-flex flex-column justify-content-center"><i
                                                data-id="${value.id}" class="fas fa-trash"></i>
                                        </div>
                                    </div>
                                    <div class="deadline-extra-section mt-2" data-lat="${deadline.location.lat}" data-lng="${deadline.location.lng}">
                                    </div>
                                </div>
                            </div>`
                        );
                    }
                }
            });

            // Remove dates that don't have any groups in them
            $.each(dateMap, function (key, value) {
                if (!value) {
                    $(`div[data-date*=${key}]`).remove();
                }
            });

            // Sets the background and border colour to the value of the data-colour
            // This colour was added when the deadline card was added before
            $("#deadline-tab .group").each(function () {
                const groupBox = $(this);
                groupBox.css("background-color", groupBox.data("colour"));
                groupBox.css("border-color", groupBox.data("colour"));
            });

            // Add an eventlistener on the trash can icons so the deadlines can be removed
            $(".remove-deadline i").on("click", (e) => {
                RemoveItems.removeDeadline(e);
            });

            // Display the location in a map when there is a location added
            $(".box").on("click", function (e) {
                const deadlineExtraSection = $(this).find(
                    ".deadline-extra-section"
                );

                // Do not close and reopen the same map
                // If a box that is already open is clicked, it won't close and open again
                // A box that is opened is identified by the opened class
                if (!deadlineExtraSection.hasClass("opened")) {
                    // Close the current opened map
                    $(".deadline-extra-section").slideUp();

                    // Check if there is a value in the lat and lng data tags
                    // If the value is 1000, there is no value
                    if (
                        deadlineExtraSection.data("lat") != "1000" &&
                        deadlineExtraSection.data("lng") != "1000"
                    ) {
                        // There can only exist one map on the page based on the code in
                        // loadMaps.js
                        // We remove the card that was opened before
                        $(".deadline-extra-section.opened").empty();

                        // Slide down the new map and append the new map to it
                        deadlineExtraSection.slideDown();
                        deadlineExtraSection.empty();
                        deadlineExtraSection.append(
                            `<div class="mx-1">
                            <div class="my-2" id="currentDeadlineMap"></div>
                        </div>`
                        );
                        LoadMaps.showDeadlineMap(deadlineExtraSection);
                    }

                    // Remove the opened class from the map that was opened before
                    $(".deadline-extra-section.opened").removeClass("opened");
                    // Add the opened class to this map
                    deadlineExtraSection.addClass("opened");
                }
            });
        });
    };

    // Function to clear all the previous content in the screens and the dropdown
    // This must be done because otherwise we would have double data
    const _clearNodes = function () {
        $("#deadline-tab").empty();
        $("#groups-tab").empty();
        $("#deadline-group").empty();
    };

    return {
        init: init,
        setFilterList: setFilterList,
        filterList: filterList,
    };
})();
