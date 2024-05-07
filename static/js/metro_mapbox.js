(function() {
mapboxgl.accessToken = 'pk.eyJ1IjoibGFiYml0OXUiLCJhIjoiY2xyaHBidGY3MDFpeDJqcDh5c3htcW9tbyJ9.MIEvLBcTmBQOKa0acImNcQ'; // Replace with your Mapbox access token
				
								var map = new mapboxgl.Map({
									container: 'map1',
									style: 'mapbox://styles/labbit9u/clvmzxzix01k501qp8asw857y', // 这里换成适合洛杉矶地铁线的地图样式
									center: [-118.2437, 34.0522], // 洛杉矶的经纬度坐标
									zoom: 9
								});
                            })();