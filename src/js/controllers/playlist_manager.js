var PlaylistManager_Controller = (function() {
	var ulElemList = null;
	var lastUsedId = 0;

	// Public scope
	var my = {
		_objType: 'PlaylistManager_Controller',
		_objId: 'main',
		_values: null,

		addPlayListToPlayList: function(inOriginId, inPlaylistId) {
			var playListOrig = new Playlist_Controller(inOriginId);
			var origTracks = playListOrig.getTracks();
			var playListTarget = new Playlist_Controller(inPlaylistId);
			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');

			for (track in origTracks) {
				if (origTracks.hasOwnProperty(track)) {
					playListTarget.addTrackWithInfo(origTracks[track]);

					this._values.playLists[inPlaylistId].totalTracks++;
				}
			}

			counter.innerHTML = this._values.playLists[inPlaylistId].totalTracks;

			this._saveObject();
		},

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
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	var renderList = function(inPlayLists) {
		for (playList in inPlayLists) {
			var playListCont = new Playlist_Controller(inPlayLists[playList].id);
			console.log(inPlayLists[playList].id);
			inPlayLists[playList].name = playListCont.getName();

			var view = new TemplatesManager_Tool('playlists_list.tpl');
			var htmlResult = view.process({playLists: [inPlayLists[playList]]});
			var newDiv = PanelsObj_Controller.createLinks(htmlResult);
			play_lists_ul.appendChild(newDiv.getElementsByTagName('li')[0]);
		}
	};

	// Provate scope
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
