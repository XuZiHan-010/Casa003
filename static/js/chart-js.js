(function() {
    //based on the sample from https://www.chartjs.org/docs/latest/samples/line/line.html
    document.addEventListener('DOMContentLoaded', function() {
        var ctx1 = document.getElementById('populationChangeChart1').getContext('2d');
                var populationChangeChart1 = new Chart(ctx1, {
                    type: 'bar',
                    data: {
                        labels: ['Los Angeles', 'California', 'USA'],
                        datasets: [{
                            label: '1990-2000',
                            data: [7.4, 13.8, 13.2],
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1
                        },
                        {
                            label: '2000-2010',
                            data: [3.1, 10.0, 9.7],
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1
                        },
                        {
                            label: '2010-2020',
                            data: [2.0, 6.1, 7.4],
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                title: {
                                    display: true,
                                    text: 'Percentage Change',
                                    font: {
                                        size: 12
                                    }
                                },
                                ticks: {
                                    callback: function(value) {
                                        return value + '%'; // Append '%' to y-axis values
                                    }
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                  
                                    font: {
                                        size: 12
                                    }
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                text: 'Population Percent Change 1990-2020',
                                padding: {
                                    top: 5,
                                    bottom: 40
                                },
                                font: {
                                    size: 20
                                }
                            },
                            legend: {
                                display: true
                            }
                        }
                    }
                });
        var ctx2 = document.getElementById('populationChangeChart2').getContext('2d');
        var populationChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: ['1990', '2000', '2010', '2020'],
                datasets: [{
                    label: 'Los Angeles County Population',
                    data: [8.863052, 9.519315, 9.818605,10.014009], 
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    fill: false,
                    tension: 0.4
                }]
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: false,
                        min: 0,  // Adjusting for million scale
                        max: 10.1, // Adjusting for million scale
                        title: {
                            display: true,
                            text: 'Population (millions)'
                        },
                        ticks: {
                            stepSize: 0.1,  // Adjust step size for better granularity in millions
                            callback: function(value, index, values) {
                                return value.toFixed(1) + ' million';  // Format to show one decimal place and append 'million'
                            }
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Year'
                        }
                    }
                },
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Los Angeles County Population Change 1990-2020',
                        padding: {
                            top: 5,
                            bottom: 40
                        },
                        font: {
                            size: 20
                        }
                    },
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
        
    });
    
    })();