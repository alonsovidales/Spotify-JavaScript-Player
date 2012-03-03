var Album_Controller = (function(inId) {
	var albumInfo = null;

	var my = {
		getDetailView: function() {
			var view = new TemplatesManager_Tool('album.tpl');

			var htmlResult = view.process(albumInfo);
			console.log(htmlResult);

			document.getElementById('details_div').innerHTML = htmlResult;
		},

		getRowView: function() {
		},

		getSearchView: function() {
		},

		constructor: function(inId) {
			// Load the information from the API
			apiConnectorObj_Tool.getAlbumInfo(inId, false, function (inValues) {
				albumInfo = inValues;
			});

			return this;
		}
	};

	return my.constructor(inId);
});
