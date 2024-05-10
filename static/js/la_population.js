(function() {
    var myChart = echarts.init(document.getElementById('lamap'));
    var lineChart = echarts.init(document.getElementById('lineChart'));
    myChart.showLoading();

    function loadData(url, fallbackUrl) {
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error('Problem of network response');
            }
            return response.json();
        }).catch(error => {
            console.error('Failed to load data from:', url, 'Trying fallback local URL', error);
            return fetch(fallbackUrl).then(response => response.json());
        });
    }

    function initLineChart(cityName = 'Select a neighborhood') {
        var option = {
            title: { text: cityName + ' Population Trend' },
            tooltip: { trigger: 'axis' },
            xAxis: {
                type: 'category',
                data: ['2010', '2015', '2020', '2022'],
                name: 'Year', // Adding legend Year for X-axis
                nameLocation: 'middle', // Positioning the X-axis label
                nameGap: 30  // Gap between the X-axis label and numbers
            },
            yAxis: {
                type: 'value'
               
            },
            series: [{
                name: 'Population',
                type: 'line',
                data: []
            }]
        };
        lineChart.setOption(option);
    }
    

    function updateLineChart(cityData, cityName) {
        var populationValues = ['2010', '2015', '2020', '2022'].map(year => cityData[year] || null);
        lineChart.setOption({
            title: {
                text: cityName + ' Population Trend'  // Update title dynamically
            },
            series: [{
                name: 'Population',
                data: populationValues
            }]
        });
    }

    function initializeChart() {
        Promise.all([
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/los_angeles.geojson", "../data/los_angeles.geojson"),
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003.github.io/main/data/la_population_data.json", "../data/la_population_data.json")
        ]).then(function(values) {
            var laJson = values[0];
            var populationData = values[1];
            const dataLookup = populationData.reduce((acc, item) => {
                acc[item.Name.toLowerCase().trim()] = item;
                return acc;
            }, {});

            var seriesData = laJson.features.map(feature => {
                var name = feature.properties.name;
                var popData = dataLookup[name.toLowerCase().trim()];
                var value = popData ? popData[document.getElementById('year-selector').value] : -1;
                return { name: name, value: value };
            });

            echarts.registerMap('Los Angeles', laJson);
            var option = {
                title: { text: 'Los Angeles County Population by Neighborhoods (2010 - 2022)', left: 'right' },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return params.name + ': ' + (params.value > 0 ? params.value : 'No data');
                    }
                },
                visualMap: {
                    left: 'left',
                    min: 100,
                    max: 500000,
                    inRange: {
                        color: ['#00FF00', '#ADFF2F', '#FFFF00', '#FFD700', '#FFA500', '#FF4500', '#FF0000']
                    },
                    text: ['High', 'Low'],
                    calculable: true
                },
                
                toolbox: {
                    show: true,
                    left: 'left',
                    top: 'top',
                    feature: {
                        dataView: { readOnly: false },
                        restore: {},
                        saveAsImage: {}
                    }
                },
                series: [{
                    name: 'Los Angeles Population by Decade',
                    type: 'map',
                    roam: true,
                    map: 'Los Angeles',
                    emphasis: { label: { show: true } },
                    data: seriesData
                }]
            };

            myChart.setOption(option);
            myChart.hideLoading();

            // Set the first city data to be default value for line chart
            if (populationData.length > 0) {
                updateLineChart(populationData[0], populationData[0].Name);  // Initialize with the first city's data
            }

            myChart.on('click', function(params) {
                if (dataLookup[params.name.toLowerCase().trim()]) {
                    updateLineChart(dataLookup[params.name.toLowerCase().trim()], params.name);
                }
            });

            document.getElementById('year-selector').addEventListener('change', function() {
                var selectedYear = this.value;
                seriesData = laJson.features.map(feature => {
                    var name = feature.properties.name;
                    var popData = dataLookup[name.toLowerCase().trim()];
                    return { name: name, value: popData ? popData[selectedYear] : -1 };
                });
                myChart.setOption({
                    series: [{ data: seriesData }]
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
