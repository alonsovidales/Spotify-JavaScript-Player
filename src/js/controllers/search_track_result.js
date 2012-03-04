var SearchTrackResult_Controller = (function(inSearchStr) {
	var searchedStr = '';

	var my = {
		getDetailView: function(inPage) {
			var view = new TemplatesManager_Tool('search_track_result.tpl');
			var htmlResult = '';
			var currentPage = 1;

			if (currentPage !== undefined) {
				currentPage = parseInt(inPage, 10);
			}

			// Load the information from the API
			apiConnectorObj_Tool.searchTracks(searchedStr, currentPage, false, function (inValues) {
				var totalPages = Math.floor((inValues.tracks / config.resultsByPage) - 1);

				htmlResult = view.process({
					"showHeader": currentPage == 1,
					"showMore": currentPage != totalPages,
					"searchedVal": searchedStr,
					"nextPage": (currentPage + 1),
					"numResults": inValues.numResults,
					"tracks": inValues.tracks
				});
			});

			return htmlResult;
		},

		constructor: function(inSearchStr) {
			searchedStr = inSearchStr;

			return this;
		}
	};

	return my.constructor(inSearchStr);
});
