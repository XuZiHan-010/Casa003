(function() {
let chartDataSets = [];
const map = L.map('map').setView([34.0522, -118.2437], 9);
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
let chart;
let chartElement = document.getElementById('areaChart');
let ctx = chartElement.getContext('2d');
window.myLineChart = null;  // Initialize chart instance holder



function initializeChart(dataSets) {
    if (window.myLineChart) {
        window.myLineChart.destroy(); // Destroy any existing chart instance
    }
    window.myLineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2014', '2017', '2021'],
            datasets: dataSets
        },
        options: {
            responsive: true,
            title: {
                display: true,
                fontSize: 22,  
                fontColor: '#000', 
                padding: 0  
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

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
        return pm25 > 77 ? '#800026' :
               pm25 > 57 ? '#BD0026' :
               pm25 > 39 ? '#FC4E2A' :
               pm25 > 20 ? '#FD8D3C' :
                           '#FFFF00';
    } else {
        return pm25 > 12.31 ? '#800026' :
               pm25 > 11.56 ? '#BD0026' :
               pm25 > 10.49 ? '#FC4E2A' :
               pm25 > 8.49  ? '#FD8D3C' :
                              '#FFFF00';
    }
}



function updateYear(year) {
    currentYear = parseInt(year, 10);
    chartDataSets = [];  // Clear the datasets
    initializeChart(chartDataSets);  // Re-initialize the chart
    updateMap();
    updateLegend();
}

function updateDataType() {
    dataType = document.getElementById('dataTypeSelect').value;
    chartDataSets = [];  // Clear the datasets
    initializeChart(chartDataSets);  // Re-initialize the chart
    updateMap();
    updateLegend();
}

// Optional: Function to remove an area from the chart
function removeAreaFromChart(areaName) {
    chartDataSets = chartDataSets.filter(dataset => dataset.label !== `${areaName} PM2.5 Levels`);
    if (window.myLineChart) {
        window.myLineChart.data.datasets = chartDataSets;
        window.myLineChart.update();
    }
}


document.addEventListener("DOMContentLoaded", function() {
    document.querySelectorAll('[data-year-button]').forEach(button => {
        button.addEventListener('click', function() {
            updateYear(this.getAttribute("data-year"));
        });
    });

    document.getElementById('dataTypeSelect').addEventListener('change', function() {
        dataType = this.value;
        chartDataSets = []; // Clear the datasets
        if (window.myLineChart) window.myLineChart.destroy(); // Destroy the chart to clear it
        updateMap();
        updateLegend();
    });
});

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
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                updateChartData(feature.properties.name);
            });
        }
    }).addTo(map);
}

async function updateChartData(areaName) {
    const data = await fetchData();
    const areaData = data.find(d => d.name === areaName);

    // if (!areaData || !areaData.pm25) {
    //     console.error("No data found for area or PM2.5 data missing:", areaName);
    //     return;
    // }

    const pm25Values = ['2014', '2017', '2021'].map(year => areaData.pm25[year]);

    let dataset = chartDataSets.find(dataset => dataset.label === `${areaName} PM2.5 Levels`);
    if (!dataset) {
        dataset = {
            label: `${areaName} PM2.5 Levels`,
            data: pm25Values,
            backgroundColor: `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 0.2)`,
            borderColor: `rgba(${Math.random()*255}, ${Math.random()*255}, ${Math.random()*255}, 1)`,
            borderWidth: 1
        };
        chartDataSets.push(dataset);
    } else {
        dataset.data = pm25Values;  // Update data if area is already plotted
    }

    initializeChart(chartDataSets);  // Initialize or update chart
}






function updateLegend() {
    const legendTitle = document.getElementById('legendTitle');
    const legendContent = document.getElementById('legendContent');
    if (dataType === 'percentile') {
        legendTitle.innerHTML = "PM2.5 Percentile " + currentYear;
        legendContent.innerHTML = `
            <div><i style="background: #800026"></i>Above 77</div>
            <div><i style="background: #BD0026"></i>57 - 77</div>
            <div><i style="background: #FC4E2A"></i>39 - 57</div>
            <div><i style="background: #FD8D3C"></i>20 - 39</div>
            <div><i style="background: #FFFF00"></i>Below 20</div>
        `;
    } else {
        legendTitle.innerHTML = "PM2.5 Concentration " + currentYear;
        legendContent.innerHTML = `
            <div><i style="background: #800026"></i>Above 12.31</div>
            <div><i style="background: #BD0026"></i>11.56 - 12.31</div>
            <div><i style="background: #FC4E2A"></i>10.49 - 11.56</div>
            <div><i style="background: #FD8D3C"></i>8.49 - 10.49</div>
            <div><i style="background: #FFFF00"></i>Below 8.49</div>
        `;
    }
}


//function to clear the chart
document.getElementById('clearChartBtn').addEventListener('click', clearChartData);

function clearChartData() {
    chartDataSets = []; // Clear the data sets array
    if (window.myLineChart) {
        window.myLineChart.data.datasets = chartDataSets; // Assign the empty array to the chart's datasets
        window.myLineChart.update(); // Update the chart to reflect the changes
    }
}


updateMap();
updateLegend();
})();
