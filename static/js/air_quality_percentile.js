const map = L.map('map').setView([34.0522, -118.2437], 10);
L.tileLayer('https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}', {
    maxZoom: 18,
    attribution: 'Map data &copy; <a href="https://maps.google.com/">Google</a>'
}).addTo(map);

const urls = {
    percentile: 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/Airquality_Percentile.json',
    concentration: 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/Airquality_Concentration.json',
    geojson: 'https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/los_angeles.geojson'
};

const localUrls = {
    percentile: '../data/Airquality_Percentile.json',
    concentration: '../data/Airquality_Concentration.json',
    geojson: '../data/los_angeles.geojson'
};

let geojsonLayer;
let currentYear = 2021;
let dataType = 'percentile';

async function loadData(url, fallbackUrl) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        return await response.json();
    } catch (error) {
        console.error("Failed to load primary URL, trying fallback: ", error.message);
        const fallbackResponse = await fetch(fallbackUrl);
        if (!fallbackResponse.ok) throw new Error('Network response was not ok from fallback');
        return await fallbackResponse.json();
    }
}

async function fetchData() {
    const dataUrl = urls[dataType];
    const fallbackUrl = localUrls[dataType];
    return await loadData(dataUrl, fallbackUrl);
}

function getColor(pm25) {
    if (dataType === 'percentile') {
        return pm25 > 77 ? '#800026' :// dark maroon for above 77
               pm25 > 57 ? '#BD0026' :// maroon for above 57
               pm25 > 39 ? '#E31A1C' ://red for above 39
               pm25 > 20 ? '#FC4E2A' :// orange for above 20
                           '#FD8D3C'; // yellow for below 20
                        }
    else {
            return pm25 > 12.31 ? '#800026' :  // dark maroon 
                   pm25 > 11.56 ? '#BD0026' :  
                   pm25 > 10.49 ? '#E31A1C' :  
                   pm25 > 8.49  ? '#FC4E2A' :  
                                  '#FD8D3C';   
                        }
}

async function updateMap() {
    const data = await fetchData();
    const geoJsonData = await loadData(urls.geojson, localUrls.geojson);

    if (geojsonLayer) map.removeLayer(geojsonLayer);

    geojsonLayer = L.geoJson(geoJsonData, {
        style: feature => {
            const areaData = data.find(d => d.name === feature.properties.name);
            return {
                fillColor: areaData && areaData.pm25 && areaData.pm25[currentYear] !== undefined ? getColor(areaData.pm25[currentYear]) : '#ccc',
                weight: 2,
                opacity: 1,
                color: 'white',
                fillOpacity: 0.7
            };
        }
    }).addTo(map);
}

function updateLegend() {
    const legendTitle = document.getElementById('legendTitle');
    const legendContent = document.getElementById('legendContent');
    if (dataType === 'percentile') {
        legendTitle.innerHTML = "PM2.5 Air Quality Index";
        legendContent.innerHTML = `
            <div><i style="background: #800026"></i>Above 77</div>
            <div><i style="background: #BD0026"></i>57 - 77</div>
            <div><i style="background: #E31A1C"></i>39 - 57</div>
            <div><i style="background: #FC4E2A"></i>20 - 39</div>
            <div><i style="background: #FD8D3C"></i>Below 20</div>
        `;
    } else {
        legendTitle.innerHTML = "PM2.5 Concentration";
        legendContent.innerHTML = `
            <div><i style="background: #800026"></i>Above 12.31</div>
            <div><i style="background: #BD0026"></i>11.56 - 12.31</div>
            <div><i style="background: #E31A1C"></i>10.49 - 11.56</div>
            <div><i style="background: #FC4E2A"></i>8.49 - 10.49</div>
            <div><i style="background: #FD8D3C"></i>Below 8.49</div>
        `;
    }
}

function updateYear(year) {
    currentYear = parseInt(year, 10);
    updateMap();
}

function updateDataType() {
    dataType = document.getElementById('dataTypeSelect').value;
    updateMap();
    updateLegend();
}

updateMap(); // Initial map load
updateLegend(); // Initial legend setup
