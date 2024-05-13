(function() {
let chartDataSets = [];
const map = L.map('map').setView([34.0522, -118.2437], 9);
L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: 'Map tiles by Carto, under CC BY 3.0. Data by OpenStreetMap, under ODbL.'
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
let bounds = [[90, -180], [-90, 180]]; // A rectangle large enough to cover the whole map


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

    // Update the background based on whether there are any datasets
    updateChartBackground(dataSets.length > 0);
}


function updateChartBackground(hasData) {
    const chartContainer = document.getElementById('chartContainer');
    if (hasData) {
        chartContainer.classList.add('chart-background');
    } else {
        chartContainer.classList.remove('chart-background');
    }
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
        return pm25 > 77 ?  '#BD0026':
               pm25 > 57 ? '#FC4E2A':
               pm25 > 39 ?  '#FD8D3C' :
               pm25 > 20 ?   '#FFFF00':
                            '#babfbc';
    } else {
        return pm25 > 12.31 ? '#BD0026' :
               pm25 > 11.56 ? '#FC4E2A' :
               pm25 > 10.49 ? '#FD8D3C' :
               pm25 > 8.49  ?  '#FFFF00' :
               '#babfbc';
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

    // Destroy any existing chart instance before switching data type
    if (window.myLineChart) {
        window.myLineChart.destroy();
    }

    // Initialize the chart with no data sets, which should also handle the background
    initializeChart(chartDataSets);

    // Update the map and legend according to the new data type
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
        style: function (feature) {
            // Check if there is data for the current year and feature
            const areaData = data.find(d => d.name === feature.properties.name);
            if (areaData && areaData.pm25 && areaData.pm25[currentYear] !== undefined) {
                return {
                    fillColor: getColor(areaData.pm25[currentYear]),
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.7
                };
            } else {
                // Style for areas without data
                return {
                    fillColor: '#ccc', // Grey color for areas without data
                    weight: 2,
                    opacity: 1,
                    color: 'white',
                    fillOpacity: 0.5 // Slightly transparent
                };
            }
        },
        onEachFeature: function (feature, layer) {
            layer.on('click', function () {
                // Assuming the data exists, update the chart
                if (data.find(d => d.name === feature.properties.name)) {
                    updateChartData(feature.properties.name);
                }
            });
        }
    }).addTo(map);
}
async function updateChartData(areaName) {
    const data = await fetchData();
    const areaData = data.find(d => d.name === areaName);

    if (!areaData) {
        updateChartBackground(false); // No data, ensure background is hidden
        return;
    }

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
        dataset.data = pm25Values; // Update data if area is already plotted
    }

    initializeChart(chartDataSets); // Initialize or update chart
}

document.getElementById('clearChartBtn').addEventListener('click', function() {
    chartDataSets = []; // Clear the data sets array
    updateChartBackground(false); // No data, ensure background is hidden
    if (window.myLineChart) {
        window.myLineChart.data.datasets = chartDataSets; // Assign the empty array to the chart's datasets
        window.myLineChart.update(); // Update the chart to reflect the changes
    }
});






function updateLegend() {
    const legendTitle = document.getElementById('legendTitle');
    const legendContent = document.getElementById('legendContent');

    let legendHtml = "";

    if (dataType === 'percentile') {
        legendTitle.innerHTML = "PM2.5 Percentile " + currentYear;
        legendHtml = `
            <div><i style="background:#BD0026"></i>Above 77</div>
            <div><i style="background: #FC4E2A"></i>57 - 77</div>
            <div><i style="background: #FD8D3C"></i>39 - 57</div>
            <div><i style="background:  #FFFF00"></i>20 - 39</div>
            <div><i style="background: #babfbc"></i>Below 20</div>
        `;
    } else {
        legendTitle.innerHTML = "PM2.5 Concentration " + currentYear;
        legendHtml = `
            <div><i style="background:#BD0026"></i>Above 12.31</div>
            <div><i style="background:  #FC4E2A"></i>11.56 - 12.31</div>
            <div><i style="background: #FD8D3C"></i>10.49 - 11.56</div>
            <div><i style="background: #FFFF00"></i>8.49 - 10.49</div>
            <div><i style="background: #babfbc"></i>Below 8.49</div>
        `;
    }

    legendContent.innerHTML = legendHtml;
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
