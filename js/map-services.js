var map;

var metroStationMarkers = [];

var placeMarkers = [];



var MapService = function () {
	
};

MapService.prototype.setUpIcon = function() {
	this.highlightedIcon = this.makeMarkerIcon('0091ff');
};

// Searching places with input text using Google's PlacesService
MapService.prototype.textSearchPlaces = function (place) {
	var bounds = map.getBounds();
	var placesService = new google.maps.places.PlacesService(map);
	placesService.textSearch({
		query: place,
		bounds: bounds,
		componentRestrictions: {locality: 'Shanghai'}
	}, function(results, status) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			map.setCenter(results[0].geometry.location);
			map.setZoom(15);
			// console.log(results);
			mapService.createMarkersForSearchResults(results);
			results.forEach(function(result) {
				var latlng = result.geometry.location.lat() + "," + result.geometry.location.lng();
				// console.log(this);
				mapService.searchMetroStationInRadius(latlng, 3000);
			});
		}
	});
};

// // Searching places with lat and lng using Google's Geocoding Service
MapService.prototype.searchPlacesByGeocoding = function(latlng) {
	var geocoder = new google.maps.Geocoder;
	var infowindow = new google.maps.InfoWindow;
	var latlngStr = latlng.split(',', 2);
	latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	// console.log(latlng);
	geocoder.geocode(
	{
		'location': latlng
	}, function(results, status) {
		if (status === google.maps.GeocoderStatus.OK) {
			// console.log(results);
			if (results[0]) {
					map.setCenter(results[0].geometry.location);
				map.setZoom(15);
				var icon = this.makeMarkerIcon('f7584c');
				var placeMarker = new google.maps.Marker({
					position: latlng,
					map: map,
					icon: icon
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
};

// Searching nearby metro stations
MapService.prototype.searchMetroStationInRadius = function(latlng, radius = 1000) {
	service = new google.maps.places.PlacesService(map);
	var latlngStr = latlng.split(',', 2);
	latlng = {lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1])};
	var request = {
		location: latlng,
		radius: radius,
		types: ['subway_station']
	};
	service.nearbySearch(request, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			for (var i = 0; i < results.length; i++) {
				var metroStationMarker = mapService.createMarker(results[i], 'FFFF24');
				if ($.inArray(metroStationMarker, metroStationMarkers)) {
					metroStationMarkers.push(metroStationMarker);
				}
			}
		}
	});
};

// Hide markers from map
MapService.prototype.hideMarkers = function(markers) {
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(null);
	}
};

MapService.prototype.showMarkers = function(markers) {
	var bounds = new google.maps.LatLngBounds();
	// Extend the boundaries of the map for each marker and display the marker
	for (var i = 0; i < markers.length; i++) {
		markers[i].setMap(map);
		bounds.extend(markers[i].position);
	}
	map.fitBounds(bounds);
};

// Create marker
MapService.prototype.createMarker = function(place, markerIconColor = 'f7584c') {
	var placeLoc = place.geometry.location;
	var infowindow = new google.maps.InfoWindow;
	var marker = new google.maps.Marker({
		map: map,
		position: place.geometry.location
	});
	var metroStationIcon = this.makeMarkerIcon(markerIconColor);
	marker.setIcon(metroStationIcon);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(place.name);
		infowindow.open(map, this);
	});
	marker.addListener('mouseover', function() {
		this.setIcon(this.highlightedIcon);
	});
	marker.addListener('mouseout', function() {
		this.setIcon(metroStationIcon);
	});
	return marker;
};

// This function takes in a COLOR, and then creates a new marker
// icon of that color. The icon will be 21 px wide by 34 high, have an origin
// of 0, 0 and be anchored at 10, 34).
MapService.prototype.makeMarkerIcon = function(markerColor) {
	var markerImage = new google.maps.MarkerImage(
		'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
	'|40|_|%E2%80%A2',
	new google.maps.Size(21, 34),
	new google.maps.Point(0, 0),
	new google.maps.Point(10, 34),
	new google.maps.Size(21,34));
	return markerImage;
};

// This function creates markers for each place found in either places search.
MapService.prototype.createMarkersForSearchResults = function(places) {
	for (var i = 0; i < places.length; i++) {
		var place = places[i];
		var icon = this.makeMarkerIcon('f7584c');
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
				mapService.getPlacesDetailsFromWiki(place.name, this, placeInfoWindow);
			}
		});
		marker.addListener('mouseover', function() {
			this.setIcon(this.highlightedIcon);
		});
		marker.addListener('mouseout', function() {
			this.setIcon(icon);
		});
		placeMarkers.push(marker);
	}
};

// Get info from wiki and generate a place info window
MapService.prototype.getPlacesDetailsFromWiki = function(place, marker, infowindow) {
	var wikiUrl = "https://en.wikipedia.org/w/api.php";
    wikiUrl += '?' + $.param({
        'action': 'opensearch',
        'search': place,
        'format': 'json'
    });
    var wikiHtml = '';

    $.ajax({
        'url' : wikiUrl,
        'dataType': 'jsonp',
        'success': function(data) {
            var articleList = data[1];

            for(var i = 0; i < articleList.length; i++) {
                articleStr = articleList[i];
                var url = "https://en.wikipedia.org/wiki/"+ articleStr;
                wikiHtml += '<li><a href="' + url +'">' + articleStr + '</a></li>';
            }
            wikiHtml = '<ul>' + wikiHtml + '</ul>';
            wikiHtml = '<h4>Wiki Info</h4><hr/>' + wikiHtml;
            infowindow.setContent(wikiHtml);
			infowindow.open(map, marker);
        },
        'timeout': 5000
    }).fail(function() {
    	window.alert('Failed to get info from wiki. Connection timeout.');
    });
    
};