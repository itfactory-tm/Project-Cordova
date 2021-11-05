const Login = (function () {
    let username;
    const usernameField = $("#login-username");

    const init = function () {
        console.log("user = ", localStorage.getItem("loggedInUser"));
        if (
            localStorage.getItem("loggedInUser") != null &&
            localStorage.getItem("loggedInUser") != undefined
        ) {
            $.getJSON("http://81.83.211.187:80/getUsers", function (data) {
                let exists = false;
                $.each(data, function (index, value) {
                    if (
                        value.username === localStorage.getItem("loggedInUser")
                    ) {
                        exists = true;
                    }
                });
                if (exists) {
                    user = localStorage.getItem("loggedInUser");
                    console.log(`Logged in with user: ${user}`);
                    Navigation.toPage(0);
                }
            });
        }

        $("#submitUsername").on("click", (e) => {
            if (_validateLogin()) {
                $.getJSON("http://81.83.211.187:80/getUsers", function (data) {
                    let userExists = false;
                    $.each(data, function (index, value) {
                        if (value.username === username) {
                            userExists = true;
                        }
                    });
                    if (!userExists) {
                        $.getJSON(
                            `http://81.83.211.187:80/newUser?username=${username}`,
                            function (data) {
                                console.log(`User created: ${data}`);
                            }
                        );
                    }
                    user = username;
                    console.log(`Logged in with user: ${user}`);
                    localStorage.setItem("loggedInUser", user);
                    Navigation.toPage(0);
                });
            }
        });
    };

    const _validateLogin = function () {
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
