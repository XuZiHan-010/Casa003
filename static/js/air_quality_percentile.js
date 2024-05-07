(function() {
    // URLs for GeoJSON and data
    const geojsonUrl = 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/los_angeles.geojson';
    const dataUrl = 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/Airquality_Percentile.json';
    const localGeojsonUrl = '../data/los_angeles.geojson';
    const localDataUrl = '../data/Airquality_Percentile.json';

    var map = L.map('map').setView([34.0522, -118.2437], 10);
    var geojsonLayer;


    //set up tile layer
    L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://maps.google.com/">Google</a>'
    }).addTo(map);

    // Function to load data with a fallback fucntion load from github first if fails try local url
    async function loadData(url, fallbackUrl) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error("Failed to load primary URL, trying fallback: ", error);
            const response = await fetch(fallbackUrl);
            if (!response.ok) throw new Error('Network response was not ok from fallback');
            return await response.json();
        }
    }

    // Update map based on selected year
    function updateMapForYear(geojsonData, data, year) {
        if (geojsonLayer) {
            map.removeLayer(geojsonLayer);
        }
        geojsonData.features.forEach(feature => {
            var areaData = data.find(d => d.name === feature.properties.name);
            feature.properties.pm25 = areaData ? areaData.pm25[year] : null;
        });

        geojsonLayer = L.geoJson(geojsonData, {
            style: feature => {
                return {
                    fillColor: getColor(feature.properties.pm25),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                };
            }
        }).addTo(map);
    }

    // Attach event listeners to buttons for year changes
    document.getElementById('yearControls').querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            const selectedYear = this.textContent;
            initMap(selectedYear);
        });
    });

    // Initialize the map with data
    async function initMap(selectedYear = "2021") {
        const geoJsonData = await loadData(geojsonUrl, localGeojsonUrl);
        const pm25Data = await loadData(dataUrl, localDataUrl);
        updateMapForYear(geoJsonData, pm25Data, selectedYear);
    }

    initMap(); // Initial map load with default year 2021

 // Define color based on PM2.5 value
 function getColor(pm25) {
    return pm25 > 77 ? '#800026' :// dark maroon for above 77
           pm25 > 57 ? '#BD0026' :// maroon for above 57
           pm25 > 39 ? '#E31A1C' :// red for above 39
           pm25 > 20 ? '#FC4E2A' :// orange for above 20
                        '#FD8D3C';// yellow for below 20 
}
})();
