/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Global singleton object used to controll the list of playlists
  *
  * This class extends from KeyValueStorage_Abstract_Tool
  * 
  * @see KeyValueStorage_Abstract_Tool -> js/tools/key_value_storage.js
  *
  */

var PlaylistManager_Controller = (function() {
	var ulElemList = null; // The DOM element of the list
	var lastUsedId = 0; // The las used id to give a unique id to the new lists

	// Public scope
	var my = {
		_objType: 'PlaylistManager_Controller', // Type of the object, KeyValueStorage_Abstract_Tool need this
		_objId: 'main', // The unique id of this object KeyValueStorage_Abstract_Tool need this
		_values: null, // The persistent values

		/**
		  * Used to add a playlist to another one (copy all
		  * the tracks from the first one to the other one)
		  *
		  * @param inOriginId <int>: The unique id of the list to copy
		  * @param inPlaylistId <int>: The unique id of the target list
		  */
		addPlayListToPlayList: function(inOriginId, inPlaylistId) {
			var playListOrig = new Playlist_Controller(inOriginId);
			var playListTarget = new Playlist_Controller(inPlaylistId);
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');

			// Get all the tracks from the origin list, and iterate over all of them
			// adding each one to the target list
			var origTracks = playListOrig.getTracks();
			for (track in origTracks) {
				if (origTracks.hasOwnProperty(track)) {
					playListTarget.addTrackWithInfo(origTracks[track]);

					this._values.playLists[inPlaylistId].totalTracks++;
				}
			}

			// Update the total number of tracks for this playlist
			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			// Save the onfo into localStorage
			this._saveObject();

			// If the user have this list opened, refresh the view to include the new tracks
			var currentMainContentView = SpotifyPlayerObj_Controller.getCurrentView();
			if ((currentMainContentView.type == 'playlist') && (currentMainContentView.id == inPlaylistId)) {
				SpotifyPlayerObj_Controller.showDetails('playlist', inPlaylistId);
			}
		},

		/**
		  * 
		  */
		addAlbumToPlaylist: function(inAlbumHref, inPlaylistId) {
			var playList = new Playlist_Controller(inPlaylistId);
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');

			apiConnectorObj_Tool.getAlbumInfo(inAlbumHref, true, function(inParams) {
				for (track in inParams.tracks) {
					if (inParams.tracks.hasOwnProperty(track)) {
						playList.addTrackWithInfo({
							'href': inParams.tracks[track].href,
							'name': inParams.tracks[track].name,
							'length': inParams.tracks[track].length, 
							'minSec': inParams.tracks[track].minSec});
	
						my._values.playLists[inPlaylistId].totalTracks++;
					}
				}

				counter.innerHTML = my._values.playLists[inPlaylistId].totalTracks;

				my._saveObject();
			});
		},

		addTrackToPlaylist: function(inTrackHref, inPlaylistId) {
			var playList = new Playlist_Controller(inPlaylistId);
			playList.addTrack(inTrackHref);

			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');
			this._values.playLists[inPlaylistId].totalTracks++;
			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			this._saveObject();
		},

		removePlayListFromIndex: function(inPlaylistId) {
			var containerEl = document.getElementById(inPlaylistId + '_playlist_container_li');
			var currentView = SpotifyPlayerObj_Controller.getCurrentView();

			if ((currentView !== null) && (currentView.type == 'playlist') && (currentView.id == inPlaylistId)) {
				SpotifyPlayerObj_Controller.cleanCurrentView();
			}

			document.getElementById('play_lists_ul').removeChild(containerEl);

			delete this._values.playLists[inPlaylistId];

			this._saveObject();
		},

		removedTrackFromList: function(inPlaylistId) {
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');
			this._values.playLists[inPlaylistId].totalTracks--;
			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			this._saveObject();

			// Redraw the view with the track removed
			SpotifyPlayerObj_Controller.showDetails('playlist', inPlaylistId, false, 1);
		},

		bootstrap: function() {
			var addPlaylistLink = document.getElementById('add_playlist_link');
			play_lists_ul = document.getElementById('play_lists_ul');

			addPlaylistLink.addEventListener('click', addNewList, false);

			this._loadObject();

			if (this._values === null) {
				this._values = {
					'lastId': 0,
					'playLists': {}};
			}

			renderList(this._values.playLists);

			this._saveObject();
			
			return this;
		},

		editPlayList: function(inPlayListId) {
			var playList = Playlist_Controller(inPlayListId);

			new Alert_Tool('List Name: <input type="text" id="new_edit_list_name" />', 'Save', 'Cancel', function() {
				var newName = document.getElementById('new_edit_list_name').value;
				if (newName !== '') {
					playList.setName(newName);

					document.getElementById(inPlayListId + '_play_list_name_span').innerHTML = newName;

					return true;
				}

				return false;
			});

			document.getElementById('new_edit_list_name').value = playList.getName();
			document.getElementById('new_edit_list_name').focus();
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	var renderList = function(inPlayLists) {
		for (playList in inPlayLists) {
			var playListCont = new Playlist_Controller(inPlayLists[playList].id);
			inPlayLists[playList].name = playListCont.getName();

			var view = new TemplatesManager_Tool('playlists_list.tpl');
			var htmlResult = view.process({playLists: [inPlayLists[playList]]});
			var newDiv = SpotifyPlayerObj_Controller.createLinks(htmlResult);
			play_lists_ul.appendChild(newDiv.getElementsByTagName('li')[0]);
		}
	};

	var addNewList = function() {
		new Alert_Tool('List Name: <input type="text" id="new_edit_list_name" />', 'Save', 'Cancel', function() {
			var name = document.getElementById('new_edit_list_name').value;
			if (name === '') {
				return false;
			}

			var listId = ++my._values.lastId;

			var playList = Playlist_Controller(listId);
			playList.setName(document.getElementById('new_edit_list_name').value);

			var newPlayList = {
				'id': listId,
				'totalTracks': 0
			};

			my._values.playLists[listId] = newPlayList;
			my._saveObject();

			renderList([newPlayList]);

			return true;
		});

		document.getElementById('new_edit_list_name').focus();
	};

	return my;
})();
