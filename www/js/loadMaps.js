// loadMaps.js
// The initialization of the map shown in the deadlines extra section and the map in the newDeadline tab
// We use Leaflet.js together with the mapbox plugin and a token to create the map instance

const LoadMaps = (function () {
    // The latitude and the longitude selected on the map
    // If 1000: There is no lat and lng selected
    let latLng = { lat: 1000, lng: 1000 };

    // Initialization of the map in the newDeadline tab
    const init = function () {
        // Lat and lng for Antwerp
        const latitude = 51.5;
        const longitude = 2.5;
        let marker = undefined;

        // Create a new map instance with the centerlocation Antwerp and zoom level 7
        let newDeadlineMap = L.map("newDeadlineMap").setView(
            [latitude, longitude],
            7
        );

        // Add a title layer to the map to display the sources
        // The access token is provided from my mapbox account so the open map is provided
        L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVubmVydHNvZmZlcnMiLCJhIjoiY2t1d2ptNjVkMDR2MjJ1cXFieXRpazN5eCJ9.VCJzCHE5cyEqO8R2kYjgXQ",
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    "pk.eyJ1IjoibGVubmVydHNvZmZlcnMiLCJhIjoiY2t1d2ptNjVkMDR2MjJ1cXFieXRpazN5eCJ9.VCJzCHE5cyEqO8R2kYjgXQ",
            }
        ).addTo(newDeadlineMap);

        // When the map is clicked, there should be place a pinpoint on this location and the location is saved in latLng
        newDeadlineMap.on("click", function (e) {
            // Remove the marker if there is already one
            if (marker !== undefined) {
                newDeadlineMap.removeLayer(marker);
            }

            // Add the marker on the correct location to the map
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(
                newDeadlineMap
            );

            // Save the location of the marker to latLng
            latLng.lat = e.latlng.lat;
            latLng.lng = e.latlng.lng;
        });
    };

    // There is only one map for the whole deadline page, but it gets moved every time you select another deadline
    // The function takes an html object of the extra section in a deadline
    const showDeadlineMap = function (deadlineExtraSection) {
        // The location where the marker should be placed is retrieved from the data attributes
        const lat = deadlineExtraSection.data("lat");
        const lng = deadlineExtraSection.data("lng");

        // Creates a new map with this location centered and zoom 7
        let deadlineMap = L.map("currentDeadlineMap").setView([lat, lng], 7);

        // Adding of attribution
        L.tileLayer(
            "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibGVubmVydHNvZmZlcnMiLCJhIjoiY2t1d2ptNjVkMDR2MjJ1cXFieXRpazN5eCJ9.VCJzCHE5cyEqO8R2kYjgXQ",
            {
                attribution:
                    'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                maxZoom: 18,
                id: "mapbox/streets-v11",
                tileSize: 512,
                zoomOffset: -1,
                accessToken:
                    "pk.eyJ1IjoibGVubmVydHNvZmZlcnMiLCJhIjoiY2t1d2ptNjVkMDR2MjJ1cXFieXRpazN5eCJ9.VCJzCHE5cyEqO8R2kYjgXQ",
            }
        ).addTo(deadlineMap);

        // Placesa new marker on the map
        L.marker([lat, lng]).addTo(deadlineMap);
    };

    return {
        init: init,
        latLng: latLng,
        showDeadlineMap: showDeadlineMap,
    };
})();
