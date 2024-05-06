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

    function initLineChart() {
        var option = {
             title: { text: cityName },
            tooltip: { trigger: 'axis' },
            xAxis: { type: 'category', data: ['1990', '2000', '2010', '2020'] },
            yAxis: { type: 'value' },
            series: [{ name: 'Population', type: 'line', data: [] }]
        };
        lineChart.setOption(option);
    }

    function updateLineChart(cityData) {
        var populationValues = ['1990', '2000', '2010', '2020'].map(year => cityData[year] || null);
        lineChart.setOption({
            series: [{ data: populationValues }]
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
                title: { text: 'Los Angeles County Population by Neighborhood (1990 - 2020)', left: 'right' },
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
                        color: ['#ffffff', '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
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

            // Set the first neighborhood data to be default value for line chart
            if (populationData.length > 0) {
                updateLineChart(populationData[0]);  // Update line chart with first neighborhood's data
            }

            myChart.on('click', function(params) {
                if (dataLookup[params.name.toLowerCase().trim()]) {
                    updateLineChart(dataLookup[params.name.toLowerCase().trim()]);
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
