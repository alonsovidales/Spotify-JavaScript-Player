var SearchAlbumResult_Controller = (function(inSearchStr) {
	var searchedStr = '';

	var my = {
		getDetailView: function(inPage) {
			console.log(inPage);
			var view = new TemplatesManager_Tool('search_album_result.tpl');
			var htmlResult = '';
			var currentPage = inPage;

			if (currentPage === undefined) {
				currentPage = 1;
			}

			// Load the information from the API
			apiConnectorObj_Tool.searchAlbums(searchedStr, currentPage, false, function (inValues) {
				console.log(inValues);
				console.log(view);
				htmlResult = view.process({
					showHeader: currentPage == 1,
					showMore: currentPage == 1,
					searchedVal: searchedStr,
					nextPage: (currentPage + 1),
					numResults: inValues.numResults,
					albums: inValues.albums
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
