/**
  * Abstract class to be extended by the controllers who needs
  * persistance storage.
  * All the information will be stored in localStorage as a JSON string
  * all the object who implements this class will need tree private vars:
  *	- _objType: A unique string with the object type (you can use the class name)
  *	- _objId: The unique id of the children
  *	- _values: The values to be stored, and the var where the content will be loaded
  *
  * Use
  * 	KeyValueStorage_Abstract_Tool.extend(<class_to_be_extended>);
  * to extend this
  */
var KeyValueStorage_Abstract_Tool = (function() {
	return {
		// The next vars will be used as key on localStorage, the key is: this._objType + '_' + this._objId
		_objType: '', // All the child classes need to specify a unique class type
		_objId: '', // The unique id of the children objects

		/**
		  * Using this method, all the content inside this._values on the children objects
		  * will be stored on localStorage
		  */
		_saveObject: function() {
			try {
				// We will need the both vars in order to create the key
				if ((this._objType != '') && (this._objId != '')) {
					this._removeObject();
					localStorage.setItem(this._objType + '_' + this._objId, JSON.stringify(this._values));
				}
			} catch (error) {
				if (error == QUOTA_EXCEEDED_ERR) {
					new Alert_Tool('Quota exceeded, remove some elements');
				}
			}
		},

		/**
		  * Load all the information from localStorage into this._values
		  */
		_loadObject: function() {
			if ((this._objType != '') && (this._objId != '')) {
				this._values = JSON.parse(localStorage.getItem(this._objType + '_' + this._objId));
			} else {
				console.error('Key error: Trying to load a object without _objType or _objId');
			}
		},

		/**
		  * Remove all the information from localStorage
		  */
		_removeObject: function() {
			localStorage.removeItem(this._objType + '_' + this._objId);
		},

		/**
		  * This metod will be called from the children in order to extend this class
		  */
		extend: function(inChild) {
			for (var attr in this) {
				if (inChild[attr] === undefined) {
					inChild[attr] = this[attr];
				}
			}

			return inChild;
		}
	};
})();
