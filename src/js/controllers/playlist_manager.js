var PlaylistManager_Controller = (function() {
	// Public scope
	var my = {
		_objType: 'PlaylistManager_Controller',
		_objId: 'main',
		_values: null,

		bootstrap: function() {
			var addPlaylistLink = document.getElementById('add_playlist_link');
			addPlaylistLink.addEventListener('click', addNewList, false);

			this._loadObject();

			console.log(this._values);

			if (this._values === null) {
				this._values = {
					playLists: []};
			}

			this._saveObject();
			
			return this;
		}
	};

	// Extends the KeyValueStorage_Abstract_Tool abstract class
	KeyValueStorage_Abstract_Tool.extend(my);

	// Provate scope
	var addNewList = function() {
		
	};

	return my;
})();
