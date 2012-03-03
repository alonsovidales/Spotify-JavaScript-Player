var Album_Model = (function(inId) {
	var public = {
		_objType: 'Album_Model',
		_objId: inId,

		constructor: function() {
			// Extends KeyValueStorage_Abstract_Tool
			KeyValueStorage_Abstract_Tool.extend(this);

			this.loadObject();

			if (this.values === null) {
				console.log('Loading...');
				this.values = $.getJSON('http://ws.spotify.com/lookup/1/?uri=spotify:album:' + inId);

				this.saveObject();
			}

			console.log(this.values);

			return this;
		}
	};

	return public.constructor();
});
