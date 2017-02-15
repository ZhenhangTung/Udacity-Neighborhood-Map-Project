var initialRecommendedPlaces = [
	{
		"name": "People's Square",
		"keyWord": "People's Square, Shanghai",
		"latlng": "31.232849,121.474101",
	},
	{
		"name": "Nanjing Road Pedestrian Street",
		"keyWord": "Nanjing Road Pedestrian Street, Shanghai",
		"latlng": "31.234718,121.474902"
	},
	{
		"name": "The Bund",
		"keyWord": "The Bund, Zhongshan East 1st Road, Huangpu, Shanghai",
		"latlng": "31.240260,121.490580"
	},
	{
		"name": "Oriental Pearl TV Tower",
		"keyWord": "Oriental Pearl TV Tower, Century Avenue, Pudong, Shanghai",
		"latlng": "31.239735,121.499777"
	},
	{
		"name": "Shanghai Disneyland",
		"keyWord": "Shanghai Disneyland",
		"latlng": "31.145279, 121.657289"
	},
	{
		"name": "XinTianDi",
		"keyWord": "XinTianDi, Shanghai",
		"latlng": "31.219109,121.474661"
	},
	{
		"name": "Yu Garden",
		"keyWord": "Yu Garden, Anren Street, Huangpu, Shanghai",
		"latlng": "31.227226, 121.492083"
	},
];

var radius = ko.observableArray([

]);

var metroStations = ko.observableArray([]);

var ViewModel = function() {
	var self = this;
	self.recommendedPlaces = ko.observableArray(initialRecommendedPlaces);
	self.searchHistroies = ko.observableArray([]);
	self.place = ko.observable("");
	self.stationName = ko.observable("");
	self.metroStations = ko.computed(function() {
		if (! self.stationName()) {
			return metroStations();
		} else {
			mapService.filterStationMarkerLively(self.stationName());
			return ko.utils.arrayFilter(metroStations(), function(station){
				return station.name.toLowerCase().indexOf(self.stationName().toLowerCase()) !== -1;
			});
		}
	});
	self.FullAddress = ko.observable('');
    self.Street = ko.observable('s');
    self.Suburb = ko.observable('c');
    self.State = ko.observable('r');
    self.Lat = ko.observable('lat');
    self.Lon = ko.observable('lon');
	self.searchRecommendedPlacesAndNearbyMetroStations = function(place) {
		mapService.hideMarkers(placeMarkers);
		mapService.hideMarkers(metroStationMarkers);
		mapService.textSearchPlaces(place.name);
	};
	self.searchPlacesAndNearbyMetroStations = function() {
		var place = self.FullAddress();
		if (! place) {
			window.alert('Please input the place you want to go.')
		}

		mapService.hideMarkers(placeMarkers);
		mapService.hideMarkers(metroStationMarkers);
		mapService.textSearchPlaces(place);
	};
	self.hideMetroStations = function() {
		mapService.hideMarkers(metroStationMarkers);
	};
	self.showMetroStations = function() {
		mapService.showMarkers(metroStationMarkers);
	};
	self.filterStationMarker = function() {
		mapService.filterStationMarker(self.stationName());
	};
	self.showRelatedMarkerInfo = function(data) {
		mapService.highlightMarker(data.name);
	};
};

mapService = new MapService();



// Inistialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 31.230437, lng: 121.473719},
		zoom: 13
	});

	mapService.textSearchPlaces(initialRecommendedPlaces[0].name);
	mapService.setUpIcon();

	// Add custom binding handler
	ko.bindingHandlers.addressAutocomplete = {
	    init: function (element, valueAccessor, allBindingsAccessor) {
	        var value = valueAccessor(), allBindings = allBindingsAccessor();

	        var options = { types: ['geocode'] };
	        ko.utils.extend(options, allBindings.autocompleteOptions)

	        var autocomplete = new google.maps.places.Autocomplete(element, options);

	        google.maps.event.addListener(autocomplete, 'place_changed', function () {
	            result = autocomplete.getPlace();

	            value(result.formatted_address);
	        });
	    },
	    update: function (element, valueAccessor, allBindingsAccessor) {
	        ko.bindingHandlers.value.update(element, valueAccessor);
	    }
	};
	ko.applyBindings(new ViewModel());
};

/**
 * Error callback for Google Map API request
 */
function mapError() {
	window.alert('There is something wrong when loading Google Map Service');
};

