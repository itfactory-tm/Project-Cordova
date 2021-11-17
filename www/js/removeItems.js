const RemoveItems = (function () {
    const removeGroup = function (e) {
        const id = $(e.target).data("id");
        $.getJSON(
            `http://81.83.211.187:80/isRemovable?id=${id}`,
            function (data) {
                if (data) {
                    $.getJSON(
                        `http://81.83.211.187:80/removeGroup?id=${id}`,
                        function (data) {
                            FillData.init();
                        }
                    );
                    FillData.setFilterList(
                        FillData.filterList.filter((item) => item !== id)
                    );
                } else {
                    const message = "There is still a deadline in this group.";
                    const title = "You cannot delete this group";
                    const button = "Close";
                    navigator.notification.alert(message, title, button);
                }
            }
        );
    };

    const removeDeadline = function (e) {
        const id = $(e.target).data("id");
        // cordova.plugins.notification.local.cancel(id);
        $.getJSON(
            `http://81.83.211.187:80/removeDeadline?id=${id}`,
            function (data) {
                FillData.init();
            }
        );
    };

    return {
        removeGroup: removeGroup,
        removeDeadline: removeDeadline,
    };
})();
