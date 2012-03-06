/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Controller for the tracks elements
  *
  */

var Track_Controller = (function(inId) {
	var trackInfo = null;

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
			var view = new TemplatesManager_Tool('track.tpl');


			trackInfo.href = inId;
			var htmlResult = view.process(trackInfo);

			return htmlResult;
		},

		/**
		  * Get the info from the API and returns a Track_Controller object
		  *
		  * @return <Track_Controller object>
		  */
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
