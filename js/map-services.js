var map;

var markers = [];

var placeMarkers = [];


// Inistialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 31.230437, lng: 121.473719},
		zoom: 13
	});
};

function textSearchPlaces(place) {
    var bounds = map.getBounds();
    hideMarkers(placeMarkers);
    var placesService = new google.maps.places.PlacesService(map);
    placesService.textSearch({
    	query: place,
    	bounds: bounds
	}, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			createMarkersForPlaces(results);
		}
	});
}

function searchPlacesByGeocoding(latlng) {
	// console.log(latlng);
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	var latlngStr = latlng.split(',', 2);
	latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	// console.log(latlng);
	geocoder.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
    	// console.log(results);
    	if (results[0]) {
      		map.setCenter(results[0].geometry.location);
        	map.setZoom(15);
        	var placeMarker = new google.maps.Marker({
        		position: latlng,
        		map: map
        	});
        	placeMarkers.push(placeMarker);
        	infowindow.setContent(results[0].formatted_address);
        	infowindow.open(map, placeMarker);
        	
      } else {
        	window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}


function hideMarkers(markers) {
    for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
    }
}