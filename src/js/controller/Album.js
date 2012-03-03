var Album_Controller = (function(inId) {
	var my = {
		getDetailView: function() {
		},

		getRowView: function() {
		},

		getSearchView: function() {
		},

		constructor: function(inId) {
			apiConnectorObj_Tool.getAlbumInfo(inId, function (inValues) {
				my.values = inValues;
			});
		}
	};

	return my.constructor();
});
