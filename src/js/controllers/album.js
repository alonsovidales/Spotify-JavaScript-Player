/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Controller for the album elements
  *
  */

var Album_Controller = (function(inId) {
	var albumInfo = null;
	var id = null;

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
			var view = new TemplatesManager_Tool('album.tpl');

			// Combine the param and the view
			albumInfo.href = id;
			var htmlResult = view.process(albumInfo);

			return htmlResult;
		},

		/**
		  * Get the info from the API and returns a Album_Controller object
		  *
		  * @return <Album_Controller object>
		  */
		constructor: function(inId) {
			// Load the information from the API
			apiConnectorObj_Tool.getAlbumInfo(inId, false, function (inValues) {
				albumInfo = inValues;
			});

			id = inId;

			return this;
		}
	};

	return my.constructor(inId);
});
