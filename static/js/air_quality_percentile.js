// URLs for GeoJSON and data
var geojsonUrl = 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/los_angeles.geojson';
var dataUrl = 'https://your-repository.com/pm25-data.json';
var localGeojsonUrl = '../data/los_angeles.geojson';
var localDataUrl = '/local/path/to/pm25-data.json';

var map = L.map('map').setView([34.0522, -118.2437], 10);

// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
//     maxZoom: 18,
//     attribution: '© OpenStreetMap contributors'
// }).addTo(map);


L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://maps.google.com/">Google</a>'
    }).addTo(mymap);

// Function to load data with a fallback
async function loadData(primaryUrl, fallbackUrl) {
    try {
        const response = await fetch(primaryUrl);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Failed to load primary URL, trying fallback: ", error);
        const response = await fetch(fallbackUrl);
        if (!response.ok) throw new Error('Network response was not ok from fallback');
        return await response.json();
    }
}

// Style function for geojson layer
function style(feature) {
    return {
        fillColor: getColor(feature.properties.pm25['2021']), // Initial year
        weight: 2,
        opacity: 1,
        color: 'white',
        fillOpacity: 0.7
    };
}

// Get color depending on PM2.5 percentile value
function getColor(value) {
    return value > 77 ? '#800026' :
           value > 57 ? '#BD0026' :
           value > 39 ? '#E31A1C' :
           value > 20 ? '#FC4E2A' :
                        '#FD8D3C';
}

// OnEachFeature function
function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    });
}

function highlightFeature(e) {
    var layer = e.target;

    layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }

    // Update custom legend
    updateLegend(layer.feature.properties.pm25['2021']);
}

function resetHighlight(e) {
    geojson.resetStyle(e.target);
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
}

function updateLegend(pm25Value) {
    // Use D3 to update SVG elements for legend
    d3.select('#legendValue').text(pm25Value);
}

// Initialize map and add geojson layer
loadData(geojsonUrl, localGeojsonUrl)
    .then(geojsonData => {
        loadData(dataUrl, localDataUrl)
            .then(data => {
                geojsonData.features.forEach(feature => {
                    feature.properties.pm25 = data.find(d => d.name === feature.properties.name)?.pm25;
                });
                L.geoJson(geojsonData, {
                    style: style,
                    onEachFeature: onEachFeature
                }).addTo(map);
            });
    });

// Create a SVG element for the legend using D3.js
var svg = d3.select(map.getPanes().overlayPane).append("svg"),
    g = svg.append("g").attr("class", "leaflet-zoom-hide");

// Add more elements to 'g' for your legend here
