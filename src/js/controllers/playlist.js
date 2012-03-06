var Playlist_Controller = (function(inId) {
	var playlistInfo = null;

	var my = {
		_objType: 'Playlist_Controller',
		_objId: inId,
		_values: null,

		addTrackWithInfo: function(inInfo) {
			this._values.tracks.push(inInfo);

			this._saveObject();
		},

		getTracks: function() {
			return this._values.tracks;
		},

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

		getNumTracks: function() {
			return this._values.tracks.length;
		},

		setTrackSpeackerIcon: function(inTrackId, inEl) {
			var playIcon = document.getElementById(this._objId + '_' + inTrackId + '_play_list_speaker_icon');
			if (playIcon !== null) {
				playIcon.classList.remove('hd');
				document.getElementById(this._objId + '_' + inTrackId + '_play_list_play_icon').classList.add('hd');
			}
		},

		unsetTrackSpeackerIcon: function(inTrackId) {
			var oldPlayIcon = document.getElementById(this._objId + '_' + inTrackId + '_play_list_play_icon');
			// Check if the previous played show is still shown
			if (oldPlayIcon !== null) {
				oldPlayIcon.classList.remove('hd');
				document.getElementById(this._objId + '_' + inTrackId + '_play_list_speaker_icon').classList.add('hd');
			}
		},

		setSpeackerIcon: function() {
			document.getElementById(this._objId + '_play_list_speaker_icon').classList.remove('hd');
			document.getElementById(this._objId + '_play_list_play_icon').classList.add('hd');
		},

		unsetSpeackerIcon: function() {
			document.getElementById(this._objId + '_play_list_speaker_icon').classList.add('hd');
			document.getElementById(this._objId + '_play_list_play_icon').classList.remove('hd');
		},

		removeTrack: function(inId) {
			this._values.tracks.splice(inId, 1);
			this._saveObject();

			PlaylistManager_Controller.removedTrackFromList(this._objId);
		},

		getTracksInfo: function(inId) {
			if (this._values.tracks[inId] !== undefined) {
				return this._values.tracks[inId];
			}

			return null;
		},

		getTracks: function() {
			return this._values.tracks;
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

			var params = this._values;
			params.playlistId = this._objId;

			// Add the ID to all the tracks, the id is the current possition
			// in the tracks array
			for (track in this._values.tracks) {
				if (this._values.tracks[track] !== null) {
					this._values.tracks[track].id = track;
				}
			}

			var htmlResult = view.process(this._values);

			return htmlResult;
		},

		getDetailViewPostProcessor: function () {
			var currentPlayTrack = Player_Controller.getCurrentTrackList();
			if (currentPlayTrack.playlist == this._objId) {
				var playList = new Playlist_Controller(currentPlayTrack.playlist);

				playList.setTrackSpeackerIcon(currentPlayTrack.track);
			}

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
		},

		del: function() {
			PlaylistManager_Controller.removePlayListFromIndex(this._objId);

			this._removeObject();
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	return my.constructor(inId);
});
