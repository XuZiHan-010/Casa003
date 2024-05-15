(function() {
    var myChart = echarts.init(document.getElementById('lamap'));
    var lineChart = echarts.init(document.getElementById('lineChart'));
    myChart.showLoading();

    function loadData(url, fallbackUrl) {
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).catch(error => {
            console.error('Failed to load data from:', url, 'Trying fallback local URL', error);
            return fetch(fallbackUrl).then(response => response.json());
        });
    }

    function initLineChart(cityName = 'Select a neighborhood') {
        var option = {
            title: { text: cityName + ' Population Density per square kilometer',
            textStyle: { fontWeight: 'bold' }
            },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['2010', '2015', '2020', '2022'],
                name: 'Year',
                nameLocation: 'middle',
                nameGap: 30
            },
            yAxis: {
                type: 'value',
                nameLocation: 'middle',
                nameGap: 50,
                nameRotate: 90,
                axisLabel: {
                    margin: 0
                }
            },
            series: [{
                name: 'Density',
                type: 'line',
                data: []
            }]
        };
        lineChart.setOption(option);
    }

    function updateLineChart(cityData, cityName) {
        var densityValues = ['2010', '2015', '2020', '2022'].map(year => cityData[year] || null);
        lineChart.setOption({
            title: {
                text: cityName + ' Population Trend'
            },
            series: [{
                name: 'Population',
                data: densityValues
            }]
        });
    }

    function initializeChart() {
        Promise.all([
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/los_angeles.geojson", "../data/los_angeles.geojson"),
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/la_population_density.json", "../data/la_population_density.json"),
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/la_population_data.json","../data/la_population_data.json")
        ]).then(function(values) {
            var laJson = values[0];
            var densityData = values[1];
            var populationData = values[2];
    
            const dataLookup = densityData.reduce((acc, item) => {
                acc[item.Name.toLowerCase().trim()] = item;
                return acc;
            }, {});
    
            const populationLookup = populationData.reduce((acc, item) => {
                acc[item.Name.toLowerCase().trim()] = item;
                return acc;
            }, {});
    
            var seriesData = [];

            function setMapData(year) {
                var seriesData = laJson.features.map(feature => {
                    var name = feature.properties.name;
                    var density = dataLookup[name.toLowerCase().trim()];
                    return { name: name, value: density ? density[year] : -1 };
                });
            
                myChart.setOption({
                    series: [{ data: seriesData }],
                    title: { text: 'Los Angeles County Population Density by Neighborhood (' + year + ')'
                   
                     } 
                });
            }
          
          
    
            echarts.registerMap('Los Angeles', laJson);
            var option = {
                title: { text: 'Los Angeles County Population Density by Neighborhood  ', 
                subtext: 'Population Density per kilometer (2010-2022)' ,
                left: 'center' },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return params.name + ': ' + (params.value > 0 ? params.value + ' per kilometer' : 'No data');
                    }
                },
                visualMap: {
                    left: 'left',
                    min: 0,
                    max: 10000, 
                    inRange: {
                        color: ['#00FF00', '#ADFF2F', '#FFFF00', '#FFD700', '#FFA500', '#FF4500', '#FF0000']
                    },
                    text: ['High', 'Low'],
                    calculable: true
                },
                toolbox: {
                    show: true,
                    left: 'right',
                    top: 'bottom',
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [{
                    name: 'Density by Decade',
                    type: 'map',
                    roam: true,
                    map: 'Los Angeles',
                    emphasis: { label: { show: true } },
                    data: seriesData // This is updated to show initial data immediately
                }]
            };
    
            myChart.setOption(option);
            myChart.hideLoading();
            setMapData('2010'); 
    
            // Set the first city data to be default value for line chart
            if (densityData.length > 0) {
                updateLineChart(densityData[0], densityData[0].Name);  // Initialize with the first city's data
            }
    
            // Event listeners for map interaction and dropdown change
            myChart.on('click', function(params) {
                if (populationLookup[params.name.toLowerCase().trim()]) {
                    updateLineChart(populationLookup[params.name.toLowerCase().trim()], params.name);
                }
            });
    
            var dropdownItems = document.querySelectorAll('.dropdown-item');
            dropdownItems.forEach(item => {
                item.addEventListener('click', function() {
                    var year = this.dataset.year;  // Get year from data-year attribute
                    setMapData(year);  // Update map with selected year data
                });
            });
    
        }).catch(function(error) {
            console.error('Error loading or processing data:', error);
            myChart.hideLoading();
        });
    }
    
    initializeChart();
    initLineChart();
    
})();
