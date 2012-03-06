var SearchBox_Controller = (function () {
	var defaultValue = '';
	var currentAutocompleteReq = null;
	var selectedElem = null;
	var autocompleteDivElem = null;
	var searchBox = null;
	var lastSearchBoxValue = '';
	var valueFromAutocomplete = false;

	var hideAutocomplete = function() {
		autocompleteDivElem.innerHTML = '';
		// Set the display to none of the autocomplet list
		autocompleteDivElem.classList.add('hd');
	};

	var autocomplete = function(inType, inValue) {
		if (currentAutocompleteReq !== null) {
			currentAutocompleteReq.abort();
		}

		valueFromAutocomplete = null;

		currentAutocompleteReq = apiConnectorObj_Tool.autocompleteSearch(inType, inValue, function(inParams) {
			if (inParams.length > 0) {
				var view = new TemplatesManager_Tool('autocomplete_list.tpl');

				var htmlResult = view.process({
					'results': inParams
				});

				htmlResult = SpotifyPlayerObj_Controller.createLinks(htmlResult);

				selectedElem = null;
				autocompleteDivElem.innerHTML = '';
				autocompleteDivElem.appendChild(htmlResult);
				// Set the display to none of the autocomplet list
				autocompleteDivElem.classList.remove('hd');
			}
		});
	};

	var autocompleteSelectElement = function(inLiElement) {
		var link = inLiElement.getElementsByClassName('info_link')[0];

		valueFromAutocomplete = true;
		if (selectedElem !== null) {
			selectedElem.classList.remove('selected');
		}

		inLiElement.classList.add('selected');

		selectedElem = inLiElement;
		searchBox.value = link.innerHTML;
		lastSearchBoxValue = link.innerHTML;

		// Create a new threat to don't damage the user experience
		setTimeout(function() {
			SpotifyPlayerObj_Controller.showDetails(
				link.getAttribute('type'),
				link.getAttribute('href'));
		}, false, 1);

		return inLiElement;
	};

	var autocompleteChangeSelect = function(inAction) {
		var elements = autocompleteDivElem.getElementsByClassName('autocomplete_result');

		if (inAction == 'prev') {
			if (selectedElem === null) {
				elements[elements.length - 1] = autocompleteSelectElement(elements[elements.length - 1]);
			} else {
				var prev = null;

				for (var pos = 0; pos < elements.length; pos++) {
					if (selectedElem == elements[pos]) {
						if (prev !== null) {
							prev = autocompleteSelectElement(prev);
						} else {
							elements[elements.length - 1] = autocompleteSelectElement(elements[elements.length - 1]);
						}
						break;
					}

					prev = elements[pos];
				}
			}
		} else {
			if (selectedElem === null) {
				elements[0] = autocompleteSelectElement(elements[0]);
			} else {
				for (element in elements) {
					if (selectedElem == elements[element]) {
						if (elements[parseInt(element, 10) + 1] !== undefined) {
							elements[parseInt(element, 10) + 1] = autocompleteSelectElement(elements[parseInt(element, 10) + 1]);
						} else {
							elements[0] = autocompleteSelectElement(elements[0]);
						}
						break;
					}
	
					prev = elements[element];
				}
			}
		}
	};

	var search = function(inType, inValue) {
		// If the value cames from the autocomplete (the info is yet loaded),
		// or is an empy string, don't do anyting...
		if ((inValue !== '') && (!valueFromAutocomplete) && (inValue !== defaultValue)) {
			SpotifyPlayerObj_Controller.showDetails(
				'searchResult_' + inType,
				inValue, false, 1);
		}

		searchBox.blur();
		hideAutocomplete();
	};

	return {
		bootstrap: function() {
			var searchIcon = document.getElementById('search_link');
			var searchTypeSel = document.getElementById('searchbox_type');
			searchBox = document.getElementById('searchbox_input');
			autocompleteDivElem = document.getElementById('searchbox_autocomplete');
			lastSearchBoxValue = searchBox.value;
			defaultValue = searchBox.value;

			// Add the events
			searchBox.addEventListener('keyup', function(inEvent) {
				switch(inEvent.keyCode) {
					// Return key, submit
					case 13:
						inEvent.preventDefault();
						search(searchTypeSel.value, searchBox.value);
						break;

					// Down
					case 40:
						inEvent.preventDefault();
						autocompleteChangeSelect('next');
						break;

					// Up
					case 38:
						inEvent.preventDefault();
						autocompleteChangeSelect('prev');
						break;

					default:
						if (lastSearchBoxValue != searchBox.value) {
							valueFromAutocomplete = false;
							lastSearchBoxValue = searchBox.value;
							autocomplete(searchTypeSel.value, searchBox.value);
						}
						break;
				}
			}, false);

			searchBox.addEventListener('focus', function() {
				hideAutocomplete();
			}, false);

			searchBox.addEventListener('focus', function() {
				if (searchBox.value == defaultValue) {
					searchBox.value = '';
				}
			}, false);

			searchBox.addEventListener('blur', function() {
				if (currentAutocompleteReq !== null) {
					currentAutocompleteReq.abort();
				}

				if (searchBox.value === '') {
					searchBox.value = defaultValue;
				}

				setTimeout(hideAutocomplete, 100);
			}, false);

			searchIcon.addEventListener('click', function() {
				search(searchTypeSel.value, searchBox.value);
			}, false);
		}
	};
})();
