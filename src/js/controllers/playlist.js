/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Controller for the playlists elements
  *
  * This class extends from KeyValueStorage_Abstract_Tool
  * We will use localStorage to save all the information of the tracks too in orer to
  * avoid problem with the max number of queries per second and do the load faster
  * 
  * @see KeyValueStorage_Abstract_Tool -> js/tools/key_value_storage.js
  *
  * @param inId <int>: The unique id of the playlist
  *
  */

var Playlist_Controller = (function(inId) {
	var playlistInfo = null; // The complete playlist info

	var my = {
		_objType: 'Playlist_Controller', // Type of the object, KeyValueStorage_Abstract_Tool need this
		_objId: inId, // The unique i of this object KeyValueStorage_Abstract_Tool need this
		_values: null, // The persistent values

		/**
		  * Add a track to the playlist with all the info, this method should be called when
		  * you have all the info to don't call to the API again
		  *
		  * @param inInfo <object>:
		  * {
		  * 	'href': <str>, // The unique ID of the track
		  *	'name': <str>, // The name of the track
		  * 	'length': <int>, // The length in seconds of the track
		  *	'minSec': <str> // The length in mm:ss format of the track
		  * }
		  */
		addTrackWithInfo: function(inInfo) {
			this._values.tracks.push(inInfo);

			this._saveObject();
		},

		/**
		  * Retruns the complete list of all the track using an array
		  *
		  * @return <array>: An array of objects with the next values:
		  * {
		  * 	'href': <str>, // The unique ID of the track
		  *	'name': <str>, // The name of the track
		  * 	'length': <int>, // The length in seconds of the track
		  *	'minSec': <str> // The length in mm:ss format of the track
		  * }
		  */
		getTracks: function() {
			return this._values.tracks;
		},

		/**
		  * Add a track with only the unique ID of it. Do a query to the API
		  * in order to get all the information
		  *
		  * @param inTrackHref <str>: The unique id of the track to add
		  */
		addTrack: function(inTrackHref) {
			var playList = this;

			// Call to the API, add the track, and save the info using localStorage
			apiConnectorObj_Tool.getTrackInfo(inTrackHref, true, function(inTrackInfo) {
				playList._values.tracks.push({
					'href': inTrackHref,
					'name': inTrackInfo.name,
					'length': inTrackInfo.length,
					'minSec': inTrackInfo.minSec
				});

				playList._saveObject();
			});
		},

		/**
		  * Return the total number of track inside this playlist
		  *
		  * @return <int>: The total number of tracks
		  */
		getNumTracks: function() {
			return this._values.tracks.length;
		},

		/**
		  * Set the speaker icon to the track and to the current list
		  *
		  * @param inTrackId <int>: The unique id of the track 
		  */
		setTrackSpeackerIcon: function(inTrackId) {
			var playIcon = document.getElementById(this._objId + '_' + inTrackId + '_play_list_speaker_icon');
			if (playIcon !== null) {
				playIcon.classList.remove('hd');
				document.getElementById(this._objId + '_' + inTrackId + '_play_list_play_icon').classList.add('hd');
			}
		},

		/**
		  * Unset the speaker icon to the track and to the current list
		  *
		  * @param inTrackId <int>: The unique id of the track 
		  */
		unsetTrackSpeackerIcon: function(inTrackId) {
			var oldPlayIcon = document.getElementById(this._objId + '_' + inTrackId + '_play_list_play_icon');
			// Check if the previous played show is still shown
			if (oldPlayIcon !== null) {
				oldPlayIcon.classList.remove('hd');
				document.getElementById(this._objId + '_' + inTrackId + '_play_list_speaker_icon').classList.add('hd');
			}
		},

		/**
		  * Set the speake icon only to the playlist
		  */
		setSpeackerIcon: function() {
			document.getElementById(this._objId + '_play_list_speaker_icon').classList.remove('hd');
			document.getElementById(this._objId + '_play_list_play_icon').classList.add('hd');
		},

		/**
		  * Unset the speake icon only to the playlist
		  */
		unsetSpeackerIcon: function() {
			var oldSpeackerIcon = document.getElementById(this._objId + '_play_list_speaker_icon');
			if (oldSpeackerIcon !== null) {
				oldSpeackerIcon.classList.add('hd');
				document.getElementById(this._objId + '_play_list_play_icon').classList.remove('hd');
			}
		},

		/**
		  * Remove a given track from the playlist
		  *
		  * @param inId <int>: The track unique id into the playlist
		  */
		removeTrack: function(inId) {
			// Remove the track fron the list and store it into localStorage
			this._values.tracks.splice(inId, 1);
			this._saveObject();

			// Infor to the playlist about the action
			PlaylistManager_Controller.removedTrackFromList(this._objId);
		},

		/**
		  * Return the the information for a given track
		  *
		  * @return <object>: An object with the track info using the next structure
		  * {
		  * 	'href': <str>, // The unique ID of the track
		  *	'name': <str>, // The name of the track
		  * 	'length': <int>, // The length in seconds of the track
		  *	'minSec': <str> // The length in mm:ss format of the track
		  * }
		  */
		getTracksInfo: function(inId) {
			if (this._values.tracks[inId] !== undefined) {
				return this._values.tracks[inId];
			}

			return null;
		},

		/**
		  * Return the name of the playlist
		  *
		  * @return <string>: The name of the playlist
		  */
		getName: function() {
			return this._values.name;
		},

		/**
		  * Replace the name of the playlist
		  *
		  * @param inName <string>: The new name
		  */
		setName: function(inName) {
			this._values.name = inName;
			this._saveObject();
		},

		/**
		  * Method used by the Factory SpotifyPlayerObj_Controller.showDetails
		  * method, get all the info of the playlist, and render the view to show
		  * the info.
		  * @see SpotifyPlayerObj_Controller.showDetails();
		  *
		  * @return <string>: The HTML code to be rendered
		  */
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

		/**
		  * Method used by the Factory SpotifyPlayerObj_Controller.showDetails
		  * and called after render the main view, this method adds the speaker icon
		  * if one of the tracks are playing.
		  *
		  * @see SpotifyPlayerObj_Controller.showDetails();
		  */
		getDetailViewPostProcessor: function () {
			var currentPlayTrack = Player_Controller.getCurrentTrackList();
			if (currentPlayTrack.playlist == this._objId) {
				var playList = new Playlist_Controller(currentPlayTrack.playlist);

				playList.setTrackSpeackerIcon(currentPlayTrack.track);
			}

		},

		/**
		  * Get the informaiton from the local sotrage
		  */
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

		/**
		  * Remove this playlist from localStorage, and inform to PlaylistManager_Controller
		  * using the methd removePlayListFromIndex
		  * 
		  * @see PlaylistManager_Controller.removePlayListFromIndex
		  */
		del: function() {
			PlaylistManager_Controller.removePlayListFromIndex(this._objId);

			this._removeObject();
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	return my.constructor(inId);
});
