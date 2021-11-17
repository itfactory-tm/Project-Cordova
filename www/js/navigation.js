const Navigation = (function () {
    let pages;
    let mainSelector;
    let currentPage;

    const init = function () {
        currentPage = 5;
        pages = $("main>div");
        mainSelector = $("#main-selector");
        pages.hide();
        toPage(currentPage);

        $("#top-navigation-left").on("click", () => toPage(0));
        $("#top-navigation-right").on("click", () => toPage(5));
        $(".navigation-filter").on("click", () => toPage(1));
        $(".navigation-about").on("click", () => toPage(2));
        $(".navigation-new-deadline").on("click", () => toPage(3));
        $(".navigation-new-group").on("click", () => toPage(4));
        $("#voice").on("click", () => voiceNavigation());
    };

    const toPage = function (page) {
        FillData.init();
        pages.hide();
        $(pages[page]).show();
        mainSelector.text($(pages[page]).data("tab"));
        currentPage = page;

        const hideOnLogin = $(".hide-on-login");
        if (page === 5) {
            hideOnLogin.hide();
        } else {
            hideOnLogin.show();
        }
    };

    const voiceNavigation = function () {
        let options = {
            language: "en-US",
            matches: 5,
            showPopup: true,
            showPartial: true,
        };
        window.plugins.speechRecognition.startListening((data) => {
            console.log(data);

            if (data != null && data != undefined) {
                for (let i = 0; i < 5; i++) {
                    let array = data[i].split(" ");

                    // Check if first word is log, show or new
                    if (array[0] == "log" && array[1] == "out") {
                        // Navigate to logout page
                        toPage(5);
                        return;
                    } else if (array[0] == "show") {
                        // Check if second word is groups or deadlines
                        if (array[1] == "groups") {
                            toPage(1);
                            return;
                        } else if (array[1] == "deadlines") {
                            toPage(0);
                            return;
                        }
                    } else if (array[0] == "new") {
                        // Check if second word is group or deadline
                        if (array[1] == "group") {
                            toPage(4);
                            return;
                        } else if (array[1] == "deadline") {
                            toPage(3);
                            return;
                        }
                    }
                }
            }
        }, options);
    };

    return {
        init: init,
        toPage: toPage,
    };
})();
