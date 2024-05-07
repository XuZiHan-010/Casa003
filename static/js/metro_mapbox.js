(function() {
mapboxgl.accessToken = 'pk.eyJ1IjoibGFiYml0OXUiLCJhIjoiY2xyaHBidGY3MDFpeDJqcDh5c3htcW9tbyJ9.MIEvLBcTmBQOKa0acImNcQ'; // Mapbox access token
				
								var map = new mapboxgl.Map({
									container: 'map1',
									style: 'mapbox://styles/labbit9u/clvmzxzix01k501qp8asw857y', // better to change the style to fit los angeles
									center: [-118.2437, 34.0522], // latitude and longitude of los angeles
									zoom: 9
								});
                            })();