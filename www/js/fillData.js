const FillData = (function () {
    let filterList = [];
    const init = function () {
        if (
            localStorage.getItem("userFilterMapping") !== null &&
            localStorage.getItem("userFilterMapping") !== undefined
        ) {
            setFilterList(
                JSON.parse(localStorage.getItem("userFilterMapping"))[
                    localStorage.getItem("loggedInUser")
                ]
            );
        }
        _clearNodes();
        _fillLogin();
        _fillGroups();
        _fillAgenda();
    };

    const setFilterList = function (list) {
        filterList = list;

        // There is no user - filter mapping in local storage
        if (localStorage.getItem("userFilterMapping") == null) {
            const jsonMapping = {};
            jsonMapping[user] = filterList;
            localStorage.setItem(
                "userFilterMapping",
                JSON.stringify(jsonMapping)
            );
        }

        // There is user - filter mapping in local storage
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

    const _fillLogin = function () {
        if (localStorage.getItem("loggedInUser") != null) {
            $("#login-username").attr(
                "value",
                localStorage.getItem("loggedInUser")
            );
        }
    };

    const _fillGroups = function () {
        $.getJSON("http://81.83.211.187:80/getGroups", function (data) {
            $.each(data, function (index, value) {
                if (value.user.username === user) {
                    $("#groups-tab").append(
                        `<div data-deSelect="false" data-colour="${value.colour}" class="group-box d-flex justify-content-between align-items-center mb-3">
                            <div class="group-title pl-2">${value.name}</div>
                            <div class="remove-group trash pr-2">
                                <i data-id="${value.id}" class="fas fa-trash"></i>
                            </div>
                        </div>`
                    );
                    $("#deadline-group option").removeAttr("selected");
                    $("#deadline-group").append(
                        `<option selected value="${value.name}">${value.name}</option>`
                    );
                }
            });
            $("#deadline-group option:last-child").attr("selected");
            $("#groups-tab .group-box").each(function () {
                const groupBox = $(this);
                let colour = groupBox.data("colour");
                colour = colour.replace("rgba(", "");
                colour = colour.replace(")", "");
                const rgbaArray = colour.split(", ");
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
                if (
                    (299 * rgbaArray[0] +
                        587 * rgbaArray[1] +
                        114 * rgbaArray[2]) /
                        1000 <
                    50
                ) {
                    groupBox.css("color", "#aaa");
                }
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
            $(".remove-group i").on("click", (e) => {
                RemoveItems.removeGroup(e);
            });
            $("#groups-tab>div.group-box").on("click", (e) => {
                const group = $(e.target);
                let groupId = group.find("i").data("id");
                if (groupId === undefined) {
                    groupId = group
                        .parent("div.group-box")
                        .find("i")
                        .data("id");
                }
                if (groupId !== undefined) {
                    if (group.data("deSelect") == "true") {
                        let backgroundColour = $(e.target)
                            .css("background-color")
                            .replace("rgba(", "rgb(")
                            .replace(", 0.6)", ")");
                        group.data("deSelect", "false");
                        group.css("background-color", backgroundColour);
                        setFilterList(
                            filterList.filter((item) => item !== groupId)
                        );
                    } else {
                        let backgroundColour = $(e.target)
                            .css("background-color")
                            .replace("rgb(", "rgba(")
                            .replace(")", `, 0.6)`);
                        group.data("deSelect", "true");
                        group.css("background-color", backgroundColour);
                        if (filterList === undefined) {
                            filterList = [];
                        }
                        let localFilterList = filterList;
                        localFilterList.push(groupId);
                        setFilterList(localFilterList);
                    }
                }
            });
        });
    };

    const _fillAgenda = function () {
        $.getJSON("http://81.83.211.187:80/getDeadlines", function (data) {
            let dateList = [];
            let dateMap = {};
            data.sort(function (a, b) {
                if (a.date == b.date) {
                    return a.group.id > b.group.id ? 1 : -1;
                }
                return a.date > b.date ? 1 : -1;
            });
            $.each(data, function (key, value) {
                if (value.group.user.username === user) {
                    const deadline = data[key];
                    const date = data[key].date;

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
                    dateList.push(date);
                    if (!dateMap[date] === true) {
                        dateMap[date] = false;
                    }
                    if (!filterList.includes(deadline.group.id)) {
                        dateMap[date] = true;
                        $(`div[data-date*=${date}]`).append(
                            `<div class="box">
                                <div data-colour="${deadline.group.colour}" class="group"></div>
                                <div class="content px-2 d-flex flex-column justify-content-center">

                                    <div class="d-flex flex-row justify-content-between">
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
            $.each(dateMap, function (key, value) {
                if (!value) {
                    $(`div[data-date*=${key}]`).remove();
                }
            });
            $("#deadline-tab .group").each(function () {
                const groupBox = $(this);
                groupBox.css("background-color", groupBox.data("colour"));
                groupBox.css("border-color", groupBox.data("colour"));
            });
            $(".remove-deadline i").on("click", (e) => {
                RemoveItems.removeDeadline(e);
            });
            $(".box").on("click", function (e) {
                const deadlineExtraSection = $(this).find(
                    ".deadline-extra-section"
                );
                if (!deadlineExtraSection.hasClass("opened")) {
                    $(".deadline-extra-section").slideUp();
                    if (
                        deadlineExtraSection.data("lat") != "1000" &&
                        deadlineExtraSection.data("lng") != "1000"
                    ) {
                        $(".deadline-extra-section.opened").empty();

                        deadlineExtraSection.slideDown();
                        deadlineExtraSection.empty();
                        deadlineExtraSection.append(
                            `<div class="mx-1">
                            <div class="my-2" id="currentDeadlineMap"></div>
                        </div>`
                        );
                        LoadMaps.showDeadlineMap(deadlineExtraSection);
                    }
                    $(".deadline-extra-section.opened").removeClass("opened");
                    deadlineExtraSection.addClass("opened");
                }
            });
        });
    };

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
