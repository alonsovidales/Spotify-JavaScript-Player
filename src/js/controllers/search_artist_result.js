/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Controller for the result of the search by artist
  *
  */

var SearchArtistResult_Controller = (function(inSearchStr) {
	var searchedStr = '';

	var my = {
		/**
		  * Method used by the Factory SpotifyPlayerObj_Controller.showDetails
		  * method, get all the info of the album, and render the view to show
		  * the info.
		  * @see SpotifyPlayerObj_Controller.showDetails();
		  *
		  * @return <string>: The HTML code to be rendered
		  */
		getDetailView: function(inPage) {
			var view = new TemplatesManager_Tool('search_artist_result.tpl');
			var htmlResult = '';
			var currentPage = 1;

			if (currentPage !== undefined) {
				currentPage = parseInt(inPage, 10);;
			}

			// Load the information from the API
			apiConnectorObj_Tool.searchArtists(searchedStr, currentPage, false, function (inValues) {
				// Combine the param and the view
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

		/**
		  * Get the info from the API and returns a SearchArtistResult_Controller object
		  *
		  * @return <Album_Controller object>
		  */
		constructor: function(inSearchStr) {
			searchedStr = inSearchStr;

			return this;
		}
	};

	return my.constructor(inSearchStr);
});
