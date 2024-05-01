//based on the sample from https://www.chartjs.org/docs/latest/samples/line/line.html
document.addEventListener('DOMContentLoaded', function() {
    var ctx1 = document.getElementById('populationChangeChart1').getContext('2d');
            var populationChangeChart1 = new Chart(ctx1, {
                type: 'bar',
                data: {
                    labels: ['Los Angeles', 'California', 'USA'],
                    datasets: [{
                        label: '1990-2000',
                        data: [6.0, 13.8, 13.2],
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        borderColor: 'rgba(255, 99, 132, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '2000-2010',
                        data: [2.6, 10.0, 9.7],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    },
                    {
                        label: '2010-2020',
                        data: [2.8, 6.1, 7.4],
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
                                text: 'Location',
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
                label: 'Los Angeles Population',
                data: [3485567, 3694820, 3792621, 3898747], 
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
                    min: 3400000,  // Set the minimum scale value 
                    max: 4000000,  // Set the maximum scale value 
                    title: {
                        display: true,
                        text: 'Population'
                    },
                    ticks: {
                        stepSize: 100000,  
                        callback: function(value, index, values) {
                            return value.toLocaleString();  
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
                    text: 'Los Angeles Population Change 1990-2020',
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


