var PlaylistManager_Controller = (function() {
	var ulElemList = null;
	var lastUsedId = 0;

	// Public scope
	var my = {
		_objType: 'PlaylistManager_Controller',
		_objId: 'main',
		_values: null,

		addTrackToPlaylist: function(inTrackHref, inTrackName, inPlaylistId) {
			console.log(arguments);

			this._values.playLists[inPlaylistId].totalTracks++;
			this._values.playLists[inPlaylistId].tracks.push({
				'href': inTrackHref,
				'name': inTrackName
			});

			var counter = document.getElementById('playlist_total_tracks_' + inPlaylistId + '_span');
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

			console.log(this._values);

			loadLists(this._values);

			this._saveObject();
			
			return this;
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	var loadLists = function(inLists) {
		var view = new TemplatesManager_Tool('playlists_list.tpl');
		var htmlResult = view.process(inLists);

		var newDiv = PanelsObj_Controller.createLinks(htmlResult);
		var liElems = newDiv.getElementsByTagName('li');

		console.log(liElems);

		for (li in liElems) {
			if (typeof liElems[li] == 'object') {
				play_lists_ul.appendChild(liElems[li]);
			}
		}
	}

	// Provate scope
	var addNewList = function() {
		new Alert_Tool('List Name: <input type="text" id="new_edit_list_name" />', 'Save', 'Cancel', function() {
			var name = document.getElementById('new_edit_list_name').value;
			if (name === '') {
				return false;
			}

			var listId = ++my._values.lastId;

			var newPlayList = {
				'id': listId,
				'totalTracks': 0,
				'tracks': [],
				'name': document.getElementById('new_edit_list_name').value
			};

			my._values.playLists[listId] = newPlayList;
			my._saveObject();

			view = new TemplatesManager_Tool('playlists_list.tpl');

			var htmlResult = view.process({playLists: [newPlayList]});

			var newDiv = PanelsObj_Controller.createLinks(htmlResult);

			play_lists_ul.appendChild(newDiv.getElementsByTagName('li')[0]);

			return true;
		});

		document.getElementById('new_edit_list_name').focus();
	};

	return my;
})();
