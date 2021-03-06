# Project Cordova 2021 - 2022

-   **Name**: Lennert Soffers
-   **Class**: 2APPAI 02
-   **Email**: <a href="mailto:r0833959@student.thomasmore.be">r0833959@student.thomasmore.be</a>
-   **Student number**: r0833959
-   **APK download URL**: [http://lennertsoffers.com](http://lennertsoffers.com)

![Link to your profile photo](/www/assets/profilePic.png)

## Short description of Plennert

Plennert is an agenda/deadline planner.

When the user opens this application, he is obligated to login with a username (if he wasn't logged in yet).

Then the user arrives on his main page where he sees all his appointments or deadlines ordered by date and by group. The day before each deadline, the user gets a speech notification that says the name of the deadline and the description. When you create a new deadline, you can set the hour when the notifiction triggers.

It is possible to make groups in the groups tab. A group is a combination of a colour and name of the group. The deadlines on the home page can be filtered. If a user deselects a group, this group won't be shown on the home page. This filter is stored so if the user logs in next time his deadlines will be filtered in the same way.

When the user creates a new deadline, he has the possibility to link a location with it. This is done by pinning a point on an easy-to-use map. If the user wants to see the location of a deadline on the home page, he can simply tap on this deadline and the map will slide open. This map is made possible by the leaflet.js API.

All this data is collected on a rest API written in Spring Boot and it runs on my server at home.

Users can create multiple accounts on my application. For example, the user can use one account as a real agenda to write down some deadlines, and the other to create a planning for the upcoming exams.

The main goal for my application is to be useful in the real world. Last year, I was struggling to find an application to localize al my deadlines for school and spare time but concluded there was no application that fitted my needs. That's why I thought an application like this would be very useful for myself, and maybe for others too.

## Plugins used

-   [cordova-plugin-whitelist](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/)  
    Used for implementing a whitelist policy for navigation the application webview on Cordova 4.0 and above. It Provides security and configurability.
-   [cordova-plugin-mapbox](https://www.npmjs.com/package/cordova-plugin-mapbox)
    Used together with leaflet.js. The mapbox Cordova plugin provides OpenGL powered vector-based native mapping. These maps are used to specify the location of the appointment with a pinpoint.
-   [cordova-plugin-fullscreen](https://www.npmjs.com/package/cordova-plugin-fullscreen)
    Used to open my application on fullscreen on my Android phone. When I don't use this plugin, there is a black border above and below the screen. This makes the app hard to use.
-   [cordova-plugin-dialogs](https://www.npmjs.com/package/cordova-plugin-dialogs)
    Used to notify the user when he is doing something in the app with irreversible consequences like removing a group or deadline. The user gets an alert when he tries to delete a group in which there are still some deadlines/appointments.
-   [cordova-plugin-background-mode](https://github.com/katzer/cordova-plugin-background-mode)
    This plugin makes the app run in the background when focus is lost. All code such as timeouts keep running now. I use this to make a notification for the user. There is a timeout set and while the app is running in the background, the timeout is counting down. When it reaches 0, the notification is send. This even works when the phone is in sleep mode.
    -   [cordova-plugin-compat](https://www.npmjs.com/package/cordova-plugin-compat)
        To make the background mode plugin backwards compatible with previous version of cordova.
    -   [cordova-plugin-device](https://www.npmjs.com/package/cordova-plugin-device)
        Defines a global device object, which describes the device's hardware and software.
-   [cordova-plugin-speechrecognition](https://www.npmjs.com/package/cordova-plugin-speechrecognition)
    A plugin that uses your microphone and Google Speech to convert microphone input to an array of text strings. This is used to navigate the user trough the app and to input a title and description for a new deadline.
-   [cordova-plugin-tts](https://www.npmjs.com/package/cordova-plugin-tts)
    This plugin converts a string to a spoken message. This is the notification the user gets when the deadline is near. It converts the title and description of a deadline to a text message.

## APIs

-   [Fullrest API Spring Boot](https://spring.io/projects/spring-boot):
    A rest api that manages the CRUD of deadlines, groups and users. It runs on my server at home and is accessible by this url: [http://lennertsoffers.com/plennert](http://lennertsoffers.com/plennert).
-   [Leaflet.js](https://leafletjs.com):
    An open source javascript library for mobile-friendly interactive apps. I use leaflet to create an interactive map to show the location of deadlines. A marker is added on the location of the clicked coordinates.

## Local storage

This is where I store the user that is logged in. In this way, the app is automatically started with the correct user. The group filter is stored here as well. It is stored across sessions so that the user doesn't need to add the filter every time he starts up the app.
