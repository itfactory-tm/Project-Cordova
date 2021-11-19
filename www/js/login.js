// login.js
// Logging in is handled here
// Global variable username is stored and created here

const Login = (function () {
    let username;
    let user;

    // This function handles everything around logging in
    const init = function () {
        // If there is a username stored in localdata
        if (
            localStorage.getItem("loggedInUser") != null &&
            localStorage.getItem("loggedInUser") != undefined
        ) {
            // Api call to get all the users in the system
            $.getJSON("http://lennertsoffers.com/getUsers", function (data) {
                // Check if the user stored in localstorage is an effective user of the system
                let exists = false;
                $.each(data, function (index, value) {
                    if (
                        value.username === localStorage.getItem("loggedInUser")
                    ) {
                        exists = true;
                    }
                });

                // If the user is a valid user, the login page is skipped
                // The deadline page of the user is shown directly
                if (exists) {
                    user = localStorage.getItem("loggedInUser");
                    Navigation.toPage(0);
                }
            });
        }

        // Eventlistener for submitting a username
        $("#submitUsername").on("click", (e) => {
            if (_validateLogin()) {
                // Api call to get all the users in the system
                $.getJSON(
                    "http://lennertsoffers.com/getUsers",
                    function (data) {
                        // Check if the user stored in localstorage is an effective user of the system
                        let userExists = false;
                        $.each(data, function (index, value) {
                            if (value.username === username) {
                                userExists = true;
                            }
                        });

                        // If the user doesn't exist, a new user is created
                        if (!userExists) {
                            $.getJSON(
                                `http://lennertsoffers.com/newUser?username=${username}`,
                                function (data) {
                                    console.log(`User created: ${data}`);
                                }
                            );
                        }

                        // The system stores the logged in user and navigates to the deadline page of that user
                        user = username;
                        console.log(`Logged in with user: ${user}`);
                        localStorage.setItem("loggedInUser", user);
                        Navigation.toPage(0);
                    }
                );
            }
        });
    };

    // Function returns true if the username field is filled in
    // Else it shows an error message
    const _validateLogin = function () {
        const usernameField = $("#login-username");
        $(".error").hide();
        if (usernameField.val() !== "") {
            username = usernameField.val();
            return true;
        }
        $("#specify-username").show();
        return false;
    };

    return {
        init: init,
        username: username,
    };
})();
