var Track_Controller = (function(inId) {
	var trackInfo = null;

	var my = {
		getDetailView: function() {
			var view = new TemplatesManager_Tool('track.tpl');

			trackInfo.minSec = Math.floor(trackInfo.length / 60) + ':' + Math.round(trackInfo.length % 60);
			trackInfo.popularityUpToFive = Math.round(trackInfo.popularity * 5);
			var htmlResult = view.process(trackInfo);

			return htmlResult;
		},

		constructor: function(inId) {
			// Load the information from the API
			apiConnectorObj_Tool.getTrackInfo(inId, false, function (inValues) {
				trackInfo = inValues;
			});

			return this;
		}
	};

	return my.constructor(inId);
});
