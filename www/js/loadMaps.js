const LoadMaps = (function () {
    let latLng = { lat: 1000, lng: 1000 };

    const init = function () {
        const latitude = 51.5;
        const longitude = 2.5;
        let marker = undefined;
        let newDeadlineMap = L.map("newDeadlineMap").setView(
            [latitude, longitude],
            7
        );
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
        newDeadlineMap.on("click", function (e) {
            if (marker !== undefined) {
                newDeadlineMap.removeLayer(marker);
            }
            marker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(
                newDeadlineMap
            );
            latLng.lat = e.latlng.lat;
            latLng.lng = e.latlng.lng;
        });
    };

    const showDeadlineMap = function (deadlineExtraSection) {
        const lat = deadlineExtraSection.data("lat");
        const lng = deadlineExtraSection.data("lng");
        let deadlineMap = L.map("currentDeadlineMap").setView([lat, lng], 7);
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
        L.marker([lat, lng]).addTo(deadlineMap);
    };

    return {
        init: init,
        latLng: latLng,
        showDeadlineMap: showDeadlineMap,
    };
})();
