/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Controller for the artist elements
  *
  */

var Artist_Controller = (function(inId) {
	var artistInfo = null;

	var my = {
		/**
		  * Method used by the Factory SpotifyPlayerObj_Controller.showDetails
		  * method, get all the info of the album, and render the view to show
		  * the info.
		  * @see SpotifyPlayerObj_Controller.showDetails();
		  *
		  * @return <string>: The HTML code to be rendered
		  */
		getDetailView: function() {
			var view = new TemplatesManager_Tool('artist.tpl');

			// Combine the param and the view
			var htmlResult = view.process(artistInfo);

			return htmlResult;
		},

		/**
		  * Get the info from the API and returns a Artist_Controller object
		  *
		  * @return <Artist_Controller object>
		  */
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
