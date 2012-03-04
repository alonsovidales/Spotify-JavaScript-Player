var SearchArtistResult_Controller = (function(inSearchStr) {
	var searchedStr = '';

	var my = {
		getDetailView: function(inPage) {
			var view = new TemplatesManager_Tool('search_artist_result.tpl');
			var htmlResult = '';
			var currentPage = 1;

			if (currentPage !== undefined) {
				currentPage = parseInt(inPage, 10);;
			}

			// Load the information from the API
			apiConnectorObj_Tool.searchArtists(searchedStr, currentPage, false, function (inValues) {
				var totalPages = Math.floor(inValues.numResults / config.resultsByPage) + 1;

				htmlResult = view.process({
					"showHeader": currentPage == 1,
					"showMore": currentPage != totalPages,
					"searchedVal": searchedStr,
					"nextPage": (currentPage + 1),
					"numResults": inValues.numResults,
					"artists": inValues.artists
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
