// navigation.js
// Handles all navigation in the app
// Including navigation with voice commands

const Navigation = (function () {
    let pages;
    let mainSelector;
    let currentPage;

    // Function to initialize all buttons and navigation links
    const init = function () {
        // The page a user starts is the login page (page nr 5)
        currentPage = 5;

        // All divs directly in the main element are separate pages
        pages = $("main>div");

        // Text in the middle of the top of the screen displays the current page
        mainSelector = $("#main-selector");

        // Hide every page except from the currentpage
        pages.hide();
        toPage(currentPage);

        // Adds eventlisteners to each navigation link
        $("#top-navigation-left").on("click", () => toPage(0));
        $("#top-navigation-right").on("click", () => toPage(5));
        $(".navigation-filter").on("click", () => toPage(1));
        $(".navigation-about").on("click", () => toPage(2));
        $(".navigation-new-deadline").on("click", () => toPage(3));
        $(".navigation-new-group").on("click", () => toPage(4));
        $("#voice").on("click", () => voiceNavigation());
    };

    // Main navigation function of the application
    // The page arguments specifies the index of the page that needs to be shown
    const toPage = function (page) {
        // Fill all data again before showing a new page
        FillData.init();

        // Hide every page except from the currentpage
        pages.hide();
        $(pages[page]).show();

        // Set the text in the main selector to inform the user on which page he/she is
        mainSelector.text($(pages[page]).data("tab"));

        // Update the currentPage variable with the page navigated to
        currentPage = page;

        // On the login page, there may be no navigation links visible, so they are hidden in that case
        const hideOnLogin = $(".hide-on-login");
        if (page === 5) {
            hideOnLogin.hide();
        } else {
            hideOnLogin.show();
        }
    };

    // Secondary navigation possibility that uses voice recognition
    // The voice recognition is done by the speechrecognition plugin that makes use of Google speech
    const voiceNavigation = function () {
        // Specify the option the voice recognition should use
        // Matches: Number of strings that are recognized by Google speech
        // ShowPopup: Shows the Google speech popup on your phone
        // ShowPartial: Shows the string that is recognized by Google speech in realtime
        let options = {
            language: "en-US",
            matches: 5,
            showPopup: true,
            showPartial: true,
        };

        // Start listening to the microphone with the options specified
        window.plugins.speechRecognition.startListening(
            (data) => {
                // If there was no error in the speechrecognition, data shouldn't be empty
                if (data != null && data != undefined) {
                    // The data that is returned is an array of strings
                    // Each string is an possibility that Google speech recognised
                    // For example you said 'New deadline'
                    // The data will be: ['new deadline', 'new headline', 'jew deadline', 'jew headline', 'new hairline']
                    // Now we loop trough this array and search for matches
                    for (let i = 0; i < 5; i++) {
                        // Make a new array from the string
                        let array = data[i].split(" ");
                        // Check if first word is log, about, show or new
                        if (array[0] == "log" && array[1] == "out") {
                            // Navigate to logout page
                            toPage(5);
                            return;
                        } else if (array[0] == "about") {
                            // Navigate to about page
                            toPage(2);
                            return;
                        } else if (array[0] == "show") {
                            // Check if second word is groups or deadlines
                            if (array[1] == "groups") {
                                // Navigate to groups page
                                toPage(1);
                                return;
                            } else if (array[1] == "deadlines") {
                                // Navigate to deadline page
                                toPage(0);
                                return;
                            }
                        } else if (array[0] == "new") {
                            // Check if second word is group or deadline
                            if (array[1] == "group") {
                                // Navigate to new group page
                                toPage(4);
                                // When 'new group' is followed up by another word or words, this will be filled in automatically as group name
                                let stringBuilder = "";
                                for (let i = 2; i < array.length; i++) {
                                    stringBuilder += array[i] + " ";
                                }
                                stringBuilder = stringBuilder.trim();
                                $("#group-name").val(stringBuilder);
                                return;
                            } else if (array[1] == "deadline") {
                                // If the next word is title -> Fill in title of deadline
                                toPage(3);
                                if (array[2] == "title") {
                                    let index = 3;
                                    // When 'new deadline' is followed up by 'name <name>, description<description>', this data is added to the new deadline input fields
                                    // Keep appending words to title until the word to add is 'description' or there are no words left
                                    let stringBuilder = "";
                                    // Name of the deadline
                                    while (
                                        index < array.length &&
                                        array[index] != "description"
                                    ) {
                                        stringBuilder += array[index] + " ";
                                        index++;
                                    }
                                    stringBuilder = stringBuilder.trim();
                                    $("#deadline-title").val(stringBuilder);
                                    // Description of the deadline
                                    if (array[index] == "description") {
                                        stringBuilder = "";
                                        // Fill in description with following words
                                        for (
                                            let i = index + 1;
                                            i < array.length;
                                            i++
                                        ) {
                                            stringBuilder += array[i] + " ";
                                        }
                                        stringBuilder = stringBuilder.trim();
                                        $("#deadline-subject").val(
                                            stringBuilder
                                        );
                                    }
                                }
                                return;
                            }
                        }
                    }
                }
            },
            (error) => console.log(error),
            options
        );
    };

    return {
        init: init,
        toPage: toPage,
    };
})();
