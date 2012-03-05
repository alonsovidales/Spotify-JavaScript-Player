var Playlist_Controller = (function(inId) {
	var playlistInfo = null;

	var my = {
		_objType: 'Playlist_Controller',
		_objId: inId,
		_values: null,

		addTrack: function(inTrackHref) {
			var playList = this;

			apiConnectorObj_Tool.getTrackInfo(inTrackHref, true, function(inTrackInfo) {
				// All the track information that we can need to render track info
				// will be stored on localStorage to avoid problem with the max num
				// of queries that a origin can do to the API
				playList._values.tracks.push({
					'href': inTrackHref,
					'name': inTrackInfo.name,
					'length': inTrackInfo.length,
					'minSec': inTrackInfo.minSec
				});

				playList._saveObject();
			});
		},

		getName: function() {
			return this._values.name;
		},

		setName: function(inName) {
			this._values.name = inName;
			this._saveObject();
		},

		getDetailView: function() {
			var view = new TemplatesManager_Tool('playlist.tpl');

			console.log(this._values);
			var htmlResult = view.process(this._values);

			return htmlResult;
		},

		constructor: function(inId) {
			// Load the information from the API
			this._loadObject();

			if (this._values === null) {
				this._values = {
					'name': '',
					'tracks': []};
			}

			return this;
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	return my.constructor(inId);
});
