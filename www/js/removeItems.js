// removeItems.js
// Removal of deadlines and groups is managed here

const RemoveItems = (function () {
    // Function that handles the deletion of a group and takes a group box as argument
    const removeGroup = function (e) {
        // The id of the group is found in the data-id attribute
        const id = $(e.target).data("id");

        // The restAPI answers with true or false if we do the 'isRemovable' request with an id
        // A group is not removable if there are still users in this group
        $.getJSON(
            `http://lennertsoffers.com/plennert/isRemovable?id=${id}`,
            function (data) {
                // If the group is removable, the group gets removed
                if (data) {
                    // This api request removes the group with the specified id
                    $.getJSON(
                        `http://lennertsoffers.com/plennert/removeGroup?id=${id}`,
                        function (data) {
                            // After removal of a group, the data is changed
                            // We need to fill the data again
                            FillData.init();
                        }
                    );

                    // If the removed group was in the filterlist, it gets removed from it
                    FillData.setFilterList(
                        FillData.filterList.filter((item) => item !== id)
                    );
                }

                // If the group isn't removable, the user gets an alert
                // The alert is generated using the dialogs plugin
                else {
                    const message = "There is still a deadline in this group.";
                    const title = "You cannot delete this group";
                    const button = "Close";
                    navigator.notification.alert(message, title, button);
                }
            }
        );
    };

    // Function that handles the deletion of a group and takes a deadline box as argument
    const removeDeadline = function (e) {
        // The id of the deadline is found in the data-id attribute
        const id = $(e.target).data("id");

        // A deadline can always be removed so we do the removeDeadline api call with the deadlineId specified
        $.getJSON(
            `http://lennertsoffers.com/plennert/removeDeadline?id=${id}`,
            function (data) {
                // After removal of a deadline, the data is changed
                // We need to fill the data again
                FillData.init();

                // If there is a timeout running for this deadline, it is cleared
                clearTimeout(idTimeoutMapping[id]);

                // The id of this deadline is removed as attribute in the idTimoutMapping object
                delete idTimeoutMapping[id];
            }
        );
    };

    return {
        removeGroup: removeGroup,
        removeDeadline: removeDeadline,
    };
})();
