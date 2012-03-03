/**
  * Abstract class to be extended by the models
  *
  */
var KeyValueStorage_Abstract_Tool = (function() {
	return {
		_objType: '',
		_objId: '',

		saveObject: function() {
			try {
				if ((this._objType != '') && (this._objId != '')) {
					localStorage.setItem(this._objType + '_' + this._objId, JSON.stringify(this.values));
				}
			} catch (error) {
				if (error == QUOTA_EXCEEDED_ERR) {
					new Alert_Tool('Quota exceeded, remove some elements');
				}
			}
		},

		loadObject: function() {
			if ((this._objType != '') && (this._objId != '')) {
				this.values = JSON.parse(localStorage.getItem(this._objType + '_' + this._objId));
			} else {
				console.error('Key error: Trying to load a object without _objType or _objId');
			}
		},

		removeObject: function() {
			localStorage.removeItem(this._objType + '_' + this._objId);
		},

		extend: function(inChild) {
			for (var attr in this) {
				inChild[attr] = this[attr];
			}
		}
	};
});
