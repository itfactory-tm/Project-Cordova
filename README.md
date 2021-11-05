# Project Cordova 2021 - 2022

-   **Name**: Lennert Soffers
-   **Class**: (2APPAI 02)
-   **Email**: <a href="mailto:r0833959@student.thomasmore.be">r0833959@student.thomasmore.be</a>
-   **Student number**: r0833959
-   **APK download URL**: ..

![Link to your profile photo](/www/assets/profilePic.png)

## Short description of your app

This application is an agenda/deadline planner. When the user opens this application, he is prompted to login with a username (if he wasn't logged in yet). Then the user arrives on his main page where he sees all his appointments or deadlines ordered by date and then by group. The day before each deadline, the user gets a push notification on his phone.
It is possible to make groups in the groups tab. A group is a combination of a colour and name of the group. The deadlines on the home page can be filtered, if a user deselects a group, this group won't be shown on the home page. This filter is stored so if the user logs in next time his deadlines will be filtered in the same way. When the user creates a new deadline, he has the possibility to link a location with it. This is done by pinning a point on an easy-to-use map. If the user wants to see the location of a deadline on the home page, he can simply tap on this deadline and the map will slide open. All this data is collected on a rest API written in Spring Boot and it runs on my server at home. Users can create multiple agenda on my application. For example, the user can use one agenda as a real agenda to write down some deadlines, and the other to create a planning for the upcoming exams. The main goal for my application is to be useful in the real world. Last year, I was struggling to find an application to localize al my deadlines for school and spare time but concluded there was no application that fitted my needs. Thats why I thought an application as this would be very useful for myself, and maybe for others too.

## Plugins used

-   [cordova-plugin-whitelist](https://cordova.apache.org/docs/en/latest/reference/cordova-plugin-whitelist/)  
    Used for implementing a whitelist policy for navigation the application webview on Cordova 4.0 and above. It Provides security and configurability.
-   [cordova-plugin-mapbox](https://www.npmjs.com/package/cordova-plugin-mapbox)
    Used together with leaflet js. The mapbox Cordova plugin provides OpenGL powered vector-based native mapping. These maps are used to specify the location of the appointment with a pin point.
-   [cordova-plugin-fullscreen](https://www.npmjs.com/package/cordova-plugin-fullscreen)
    Used to open my application on fullscreen on my Android phone. This makes the app more clear since there are 2 navbars on the screen (one on the bottom and one on the top). Especially the bottom navigation is packed full of information if the native Android navbar is displayed together with the navbar of my application. I've also looked up example apps that have a bottom navbar like Instagram and Twitter, and here I don't like the fact that they still show the Android navigation. That's why I've chosen to hide the native Android bottom navbar.
-   [cordova-plugin-dialogs](https://www.npmjs.com/package/cordova-plugin-dialogs)
    Used to notify the user when he/she is doing something in the app with irreversible concequences like removing a group or deadline. The user gets an alert when he tries to delete a group in which there are still some deadlines/appointments.
-   [cordova-plugin-local-notification](https://www.npmjs.com/package/cordova-plugin-local-notification-fixed)
    Used to notify the user with a push notification on his/her phone a day before a deadline or an appointment. A little downside of this plugin: It doensn't work on Android 8 (Oreo) which is especially annoying for me because my current phone has this version. That's why I'm using another older Android phone which does support this plugin.
    This plugin depends on two other plugins like:
    -   [cordova-plugin-badge](https://www.npmjs.com/package/cordova-plugin-badge): To access and modify the badge number of the app icon.
    -   [cordova-plugin-device](https://www.npmjs.com/package/cordova-plugin-device): Defines a global device object, which describes the device's hardware and software.
