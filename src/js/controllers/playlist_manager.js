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

	/**
	  * This method render a list of playlists into the ul DOM element
	  * This method calls to the SpotifyPlayerObj_Controller.createLinks method
	  * to create the linkis
	  *
	  * @param inPlayLists <object>: An array of objects with the next structure:
	  * {
	  * 	'id': <int>, // The unique id of the playlist
	  *	'totalTracks': <int> // The total number of tracks
	  * }
	  */
	var renderList = function(inPlayLists) {
		for (playList in inPlayLists) {
			var playListCont = new Playlist_Controller(inPlayLists[playList].id);
			inPlayLists[playList].name = playListCont.getName();

			// Create the view
			var view = new TemplatesManager_Tool('playlists_list.tpl');
			var htmlResult = view.process({playLists: [inPlayLists[playList]]});

			// Create all the necessary links and events for interaction
			var newDiv = SpotifyPlayerObj_Controller.createLinks(htmlResult);
			play_lists_ul.appendChild(newDiv.getElementsByTagName('li')[0]);
		}
	};

	/**
	  * Show a pop-up with an input field to inser the list name on it
	  * After the user click on the submit button, create the new playlis
	  * and add it to the playlists list
	  */
	var addNewList = function() {
		// Show the alert
		new Alert_Tool('List Name: <input type="text" id="new_edit_list_name" />', 'Save', 'Cancel', function() {
			var name = document.getElementById('new_edit_list_name').value;
			if (name === '') {
				return false;
			}

			// Get the next aviable id as a unique id
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
		  * Add all the tracks from an album to a playlist
		  *
		  * @param inAlbumHref <str>: The unique id of the album
		  * @param inPlaylistId <int>: The target playlist
		  */
		addAlbumToPlaylist: function(inAlbumHref, inPlaylistId) {
			var playList = new Playlist_Controller(inPlaylistId);
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');

			// Get all the tracks of the album from the API
			apiConnectorObj_Tool.getAlbumInfo(inAlbumHref, true, function(inParams) {
				// Iterate over each track and add it to the list
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

				// Update the counter element
				counter.innerHTML = my._values.playLists[inPlaylistId].totalTracks;

				my._saveObject();
			});
		},

		/**
		  * Add a track to a playlist
		  *
		  * @param inTrackHref <str>: The unique id of the track to add
		  * @param inPlaylistId <int>: The target playlist
		  */
		addTrackToPlaylist: function(inTrackHref, inPlaylistId) {
			var playList = new Playlist_Controller(inPlaylistId);
			playList.addTrack(inTrackHref);

			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');
			// Increase the number of tracks on the playlist
			this._values.playLists[inPlaylistId].totalTracks++;
			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			this._saveObject();
		},

		/**
		  * Remove a playlist
		  *
		  * @param inPlaylistId <int>: The id of the playlist to remove
		  */
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

		/**
		  * Method to be called after a track is removed from a playlist, decrease the counter
		  *
		  * @param inPlaylistId <int>: The id of the playlist to remove
		  */
		removedTrackFromList: function(inPlaylistId) {
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');
			this._values.playLists[inPlaylistId].totalTracks--;
			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			this._saveObject();

			// Redraw the view with the track removed
			SpotifyPlayerObj_Controller.showDetails('playlist', inPlaylistId, false, 1);
		},

		/**
		  * This method show a pop-up with an input to modify the playlist name
		  * and save the modified name after the user click on the submit button
		  *
		  * @param inPlaylistId <int>: The id of the playlist to remove
		  */
		editPlayList: function(inPlayListId) {
			var playList = Playlist_Controller(inPlayListId);

			// Show the alert using Alert_Tool
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
		},

		/**
		  * Method to be called after the document loads as a bootstrap
		  */
		bootstrap: function() {
			var addPlaylistLink = document.getElementById('add_playlist_link');
			play_lists_ul = document.getElementById('play_lists_ul');

			// Add click event for the add playlist button
			addPlaylistLink.addEventListener('click', addNewList, false);

			// Load the object from localStorage
			this._loadObject();

			// Initialize the values if was not stored previously on localStorage
			if (this._values === null) {
				this._values = {
					'lastId': 0,
					'playLists': {}};
			}

			// Render the complete list
			renderList(this._values.playLists);

			this._saveObject();
			
			return this;
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	return my;
})();
