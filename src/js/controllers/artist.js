var Artist_Controller = (function(inId) {
	var artistInfo = null;

	var my = {
		getDetailView: function() {
			var view = new TemplatesManager_Tool('artist.tpl');

			console.log(artistInfo);

			var htmlResult = view.process(artistInfo);

			return htmlResult;
		},

		getRowView: function() {
		},

		getSearchView: function() {
		},

		constructor: function(inId) {
			// Load the information from the API
			apiConnectorObj_Tool.getArtistInfo(inId, false, function (inValues) {
				artistInfo = inValues;
			});

			return this;
		}
	};

	return my.constructor(inId);
});
