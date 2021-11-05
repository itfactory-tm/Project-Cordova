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

    return {
        init: init,
        toPage: toPage,
    };
})();
