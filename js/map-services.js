var map;

var metroStationMarkers = [];

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
	bounds: bounds,
	componentRestrictions: {locality: 'Shanghai'}
	}, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			createMarkersForSearchResults(results);
			results.forEach(function(result) {
				var latlng = result.geometry.location.lat() + "," + result.geometry.location.lng();
				searchMetroStationInRadius(latlng, 3000);
			});
		}
	});
}

function searchPlacesByGeocoding(latlng) {
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	var latlngStr = latlng.split(',', 2);
	latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	// console.log(latlng);
	geocoder.geocode(
	{
		'location': latlng,
		'componentRestrictions': {locality: 'Shanghai'}
	}, function(results, status) {
	if (status === google.maps.GeocoderStatus.OK) {
		// console.log(results);
		if (results[0]) {
				map.setCenter(results[0].geometry.location);
			map.setZoom(15);
			var icon = makeMarkerIcon('f7584c');
			var placeMarker = new google.maps.Marker({
				position: latlng,
				map: map,
				icon: icon
			});
			placeMarkers.push(placeMarker);
			console.log(results);
			// infowindow.setContent(results[0].formatted_address);
			// infowindow.open(map, placeMarker);
			// getPlacesDetails(placeMarker, infowindow);
			
		} else {
			window.alert('No results found');
		}
	} else {
		window.alert('Geocoder failed due to: ' + status);
	}
});
}

function searchMetroStationInRadius(latlng, radius = 1000) {
	service = new google.maps.places.PlacesService(map);
	var latlngStr = latlng.split(',', 2);
	latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	var request = {
		location: latlng,
		radius: '1000',
		types: ['subway_station']
	};
	service.nearbySearch(request, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var place = results[i];
				var metroStationMarker = createMarker(results[i], 'FFFF24');
				if ($.inArray(metroStationMarker, metroStationMarkers)) {
					metroStationMarkers.push(metroStationMarker);
				}
			}
		}
	});
}


function hideMarkers(markers) {
	for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
	}
}

function createMarker(place, markerIconColor = 'f7584c') {
	var placeLoc = place.geometry.location;
	var infowindow = new google.maps.InfoWindow;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	var metroStationIcon = makeMarkerIcon(markerIconColor);
	marker.setIcon(metroStationIcon);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
	return marker;
}

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
function makeMarkerIcon(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	'|40|_|%E2%80%A2',
	new google.maps.Size(21, 34),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34),
	new google.maps.Size(21,34));
return markerImage;
}

// This function creates markers for each place found in either places search.
function createMarkersForSearchResults(places) {
	var bounds = new google.maps.LatLngBounds();
	for (var i = 0; i < places.length; i++) {
		var place = places[i];
		var icon = makeMarkerIcon('f7584c');
		// Create a marker for each place.
		var marker = new google.maps.Marker({
			map: map,
			icon: icon,
			title: place.name,
			position: place.geometry.location,
			id: place.place_id
		});
		// Create a single infowindow to be used with the place details information
		// so that only one is open at once.
		var placeInfoWindow = new google.maps.InfoWindow();
		// If a marker is clicked, do a place details search on it in the next function.
		marker.addListener('click', function() {
			if (placeInfoWindow.marker == this) {
				console.log("This infowindow already is on this marker!");
			} else {
				getPlacesDetails(this, placeInfoWindow);
			}
		});
		placeMarkers.push(marker);
		if (place.geometry.viewport) {
			// Only geocodes have viewport.
			bounds.union(place.geometry.viewport);
		} else {
			bounds.extend(place.geometry.location);
		}
	}
	map.fitBounds(bounds);
}

function getPlacesDetails(marker, infowindow) {
	var wikiUrl = "https://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
        'action': 'opensearch',
        'search': city,
        'format': 'json'
    });
}