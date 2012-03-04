var SearchBox_Controller = (function () {
	var defaultValue = '';
	var currentAutocompleteReq = null;
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

				htmlResult = PanelsObj_Controller.createLinks(htmlResult);

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
		inLiElement.classList.add('selected');
		searchBox.value = link.innerHTML;
		lastSearchBoxValue = link.innerHTML;

		// Create a new threat to don't damage the user experience
		setTimeout(PanelsObj_Controller.showDetails(
			link.getAttribute('type'),
			link.getAttribute('href')), false, 1);

		return inLiElement;
	};

	var autocompleteChangeSelect = function(inAction) {
		var selectedElem = autocompleteDivElem.getElementsByClassName('selected');
		var elements = autocompleteDivElem.getElementsByClassName('autocomplete_result');

		if (selectedElem.length > 0) {
			selectedElem = selectedElem[0];
		} else {
			selectedElem = null;
		}

		if (inAction == 'prev') {
			if (selectedElem === null) {
				elements[elements.length - 1] = autocompleteSelectElement(elements[elements.length - 1]);
			} else {
				var prev = null;

				for (var pos = 0; pos < elements.length; pos++) {
					if (selectedElem == elements[pos]) {
						if (prev !== null) {
							prev = autocompleteSelectElement(prev);
						}
						break;
					}

					prev = elements[pos];
				}
	
				selectedElem.classList.remove('selected');
			}
		} else {
			if (selectedElem === null) {
				elements[0] = autocompleteSelectElement(elements[0]);
			} else {
				for (element in elements) {
					if (selectedElem == elements[element]) {
						if (elements[parseInt(element, 10) + 1] !== undefined) {
							elements[parseInt(element, 10) + 1] = autocompleteSelectElement(elements[parseInt(element, 10) + 1]);
						}
						break;
					}
	
					prev = elements[element];
				}

				selectedElem.classList.remove('selected');
			}
		}
	};

	var search = function(inType, inValue) {
		// If the value cames from the autocomplete (the info is yet loaded),
		// or is an empy string, don't do anyting...
		if ((inValue !== '') && (!valueFromAutocomplete) && (inValue !== defaultValue)) {
			PanelsObj_Controller.showDetails(
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
			searchBox.onkeydown = function(inEvent) {
				switch(inEvent.keyCode) {
					// Return key, submit
					case 13:
						search(searchTypeSel.value, searchBox.value);
						break;

					// Down
					case 40:
						autocompleteChangeSelect('next');
						break;

					// Up
					case 38:
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
				if (currentAutocompleteReq !== null) {
					currentAutocompleteReq.abort();
				}

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
