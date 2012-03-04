var SearchBox_Controller = (function () {
	var defaultValue = '';
	var currentAutocompleteReq = null;

	var hideAutocomplete = function() {
		console.log('HideAutocomplete');
	};

	var autocomplete = function(inType, inValue) {
		if (currentAutocompleteReq !== null) {
			currentAutocompleteReq.abort();
		}

		currentAutocompleteReq = apiConnectorObj_Tool.autocompleteSearch(inType, inValue, function(inParams) {
			console.log(inParams);
		});
	};

	var search = function(inType, inValue) {
		console.log('Search ' + inType + ' - ' + inValue);
	};

	return {
		bootstrap: function() {
			var searchIcon = document.getElementById('search_link');
			var searchTypeSel = document.getElementById('searchbox_type');
			var searchBox = document.getElementById('searchbox_input');
			var lastValue = searchBox.value;
			defaultValue = searchBox.value;

			// Add the events
			searchBox.onkeydown = function(inEvent) {
				// If is a return, do the search
				if (inEvent.keyCode == 13) {
					search(searchTypeSel.value, searchBox.value);
				} else {
					if (lastValue != searchBox.value) {
						lastValue = searchBox.value;
						autocomplete(searchTypeSel.value, searchBox.value);
					}
				}
			};

			searchBox.onfocus = function() {
				hideAutocomplete();
			};

			searchBox.onfocus = function() {
				if (searchBox.value == defaultValue) {
					searchBox.value = '';
				}
			};

			searchBox.onblur = function() {
				hideAutocomplete();
				if (searchBox.value === '') {
					searchBox.value = defaultValue;
				}
			};

			searchIcon.onclick = function() {
				search(searchTypeSel.value, searchBox.value);
			};
		}
	};
})();
