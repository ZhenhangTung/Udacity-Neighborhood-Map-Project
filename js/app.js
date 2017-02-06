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
	self.metroStations = metroStations;
	self.place = ko.observable("");
	self.stationName = ko.observable("");
	self.searchRecommendedPlacesAndNearbyMetroStations = function(place) {
		mapService.hideMarkers(placeMarkers);
		mapService.hideMarkers(metroStationMarkers);
		mapService.textSearchPlaces(place.name);
	};
	self.searchPlacesAndNearbyMetroStations = function() {
		// var place = this.place();
		// this.place;
		console.log('jquery:' + $('#place-search-text').val());
		console.log('value binding:' + this.place());
		// if (! this.place) {
		// 	window.alert('Please input the place you want to go.')
		// }
		
		// mapService.hideMarkers(placeMarkers);
		// mapService.hideMarkers(metroStationMarkers);
		// mapService.textSearchPlaces(place);
	};
	self.hideMetroStations = function() {
		mapService.hideMarkers(metroStationMarkers);
	};
	self.showMetroStations = function() {
		mapService.showMarkers(metroStationMarkers);
	};
	self.filterStationMarker = function() {
		var stationName = $('#station-filter-box').val();
		mapService.filterStationMarker(stationName);
	};
	self.showRelatedMarkerInfo = function(data) {
		mapService.highlightMarker(data.name);
	};
};


ko.applyBindings(new ViewModel());

mapService = new MapService();

// Inistialize the map
function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {lat: 31.230437, lng: 121.473719},
		zoom: 13
	});

	// Create the autocomplete object and associate it with the UI input control.
	var input = document.getElementById('place-search-text');
	var autocomplete = new google.maps.places.Autocomplete(input);

	mapService.textSearchPlaces(initialRecommendedPlaces[0].name);
	mapService.setUpIcon();
};


