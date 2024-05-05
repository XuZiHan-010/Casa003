(function() {
    var myChart = echarts.init(document.getElementById('lamap'));
    myChart.showLoading();

    function loadData(url, fallbackUrl) {
        return fetch(url).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        }).catch(error => {
            console.error('Failed to load data from:', url, ' Trying fallback URL...', error);
            return fetch(fallbackUrl).then(response => response.json());
        });
    }

    function initializeChart() {
        Promise.all([
            loadData("https://raw.githubusercontent.com/XuZiHan-010/Casa003/main/data/los_angeles.geojson", "../data/los_angeles.geojson"),
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
                var value = popData ? popData[document.getElementById('year-selector').value] : -1;  // Use -1 for missing data
                return { name: name, value: value };
            });

            echarts.registerMap('Los Angeles', laJson);

            var option = {
                title: {
                    text: 'Los Angeles Population Density (1990 - 2020)',
                    // subtext: 'Data from www.census.gov',
                    // sublink: 'https://www.census.gov/data/tables/time-series/dec/popchange-data-text.html',
                    left: 'right'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: function(params) {
                        return params.name + ': ' + (params.value > 0 ? params.value : 'No data');
                    }
                },
                visualMap: {
                    left: 'right',
                    min: 100,
                    max: 500000,
                    inRange: {
                        color: ['#ffffff', '#313695', '#4575b4', '#74add1', '#abd9e9', '#e0f3f8', '#ffffbf', '#fee090', '#fdae61', '#f46d43', '#d73027', '#a50026']
                    },
                    text: ['High', 'No Data', 'Low'],
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

            document.getElementById('year-selector').addEventListener('change', function() {
                var selectedYear = this.value;
                myChart.setOption({
                    series: [{
                        data: seriesData.map(item => ({
                            name: item.name,
                            value: dataLookup[item.name.toLowerCase().trim()] ? dataLookup[item.name.toLowerCase().trim()][selectedYear] : -1
                        }))
                    }]
                });
            });
        }).catch(function(error) {
            console.error('Error loading or processing data:', error);
            myChart.hideLoading();
        });
    }

    initializeChart();
})();
