var Album_Controller = (function(inId) {
	var albumInfo = null;

	var my = {
		getDetailView: function() {
			var view = new TemplatesManager_Tool('album.tpl');

			return view.process(albumInfo);
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
