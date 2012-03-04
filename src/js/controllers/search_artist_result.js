var SearchArtistResult_Controller = (function(inSearchStr) {
	var searchedStr = '';

	var my = {
		getDetailView: function(inPage) {
			console.log(inPage);
			var view = new TemplatesManager_Tool('search_artist_result.tpl');
			var htmlResult = '';
			var currentPage = inPage;

			if (currentPage === undefined) {
				currentPage = 1;
			}

			// Load the information from the API
			apiConnectorObj_Tool.searchArtists(searchedStr, currentPage, false, function (inValues) {
				console.log(inValues);
				htmlResult = view.process({
					"showHeader": currentPage == 1,
					"showMore": currentPage == 1,
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
