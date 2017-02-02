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


var ViewModel = function() {
	var self = this;
	self.recommendedPlaces = ko.observableArray(initialRecommendedPlaces);
	self.searchHistroies = ko.observableArray([]);
	self.searchRecommendedPlaces = function(place) {
		// hideMarkers(marker);
		// console.log(placeMarker);
		// if (typeof placeMarkers !== 'undefined') {
		// 	console.log(222);
		// 	hideMarkers(placeMarkers);
		// }
		hideMarkers(placeMarkers);
		searchPlacesByGeocoding(place.latlng);
		// console.log(placeMarker);
	}
};


ko.applyBindings(new ViewModel());

