var Album_Controller = (function(inId) {
	var albumInfo = null;
	var id = null;

	var my = {
		getDetailView: function() {
			var view = new TemplatesManager_Tool('album.tpl');

			albumInfo.href = id;
			var htmlResult = view.process(albumInfo);

			return htmlResult;
		},

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
