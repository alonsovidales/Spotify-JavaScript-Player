/**
  * Author: Alonso Vidales <alonso.vidales@tras2.es>
  * Date: 2012-03-04
  *
  * Global singleton object used to controll the features of the searchbox
  *
  */

var SearchBox_Controller = (function () {
	var defaultValue = ''; // The initial value of the searchbox
	var currentAutocompleteReq = null; // The XMLHttpRequest request  object for the autocomplete list
	var selectedElem = null; // the current autocomplete selected item
	var autocompleteDivElem = null; // The div DOM element to render the autoloader results
	var searchBox = null; // The search box DOM element
	var lastSearchBoxValue = ''; // The last value that the search box had after the last modification
	var valueFromAutocomplete = false; // If is true, te current value cames from the autocomplete list

	/**
	  * This method hie the autocomplete list if it is deployed
	  */
	var hideAutocomplete = function() {
		autocompleteDivElem.innerHTML = '';
		// Set the display to none of the autocomplet list
		autocompleteDivElem.classList.add('hd');
	};

	/**
	  * Create and show the autocomplete list for the type and value given, and
	  * using the SpotifyPlayerObj_Controller.createLinks methos, create the links
	  * to the results
	  *
	  * @param inType <string>: The type of the element to search, the allowed types are:
	  *	- album
	  *	- artist
	  *	- track
	  * @param inValue <string>: The search string from the user
	  *
	  * @see SpotifyPlayerObj_Controller.createLinks
	  */
	var autocomplete = function(inType, inValue) {
		if (currentAutocompleteReq !== null) {
			currentAutocompleteReq.abort();
		}

		valueFromAutocomplete = null;

		currentAutocompleteReq = apiConnectorObj_Tool.autocompleteSearch(inType, inValue, function(inParams) {
			if (inParams.length > 0) {
				// Create the list view with all the result params
				var view = new TemplatesManager_Tool('autocomplete_list.tpl');

				var htmlResult = view.process({
					'results': inParams
				});

				// Create the links to the elements
				htmlResult = SpotifyPlayerObj_Controller.createLinks(htmlResult);

				selectedElem = null;
				autocompleteDivElem.innerHTML = '';
				autocompleteDivElem.appendChild(htmlResult);
				// Set the display to none of the autocomplet list
				autocompleteDivElem.classList.remove('hd');
			}
		});
	};

	/**
	  * Mark as selected one of the elements into the autocomplete list
	  *
	  * @param inLiElement <li DOM element>: The element to be selected
	  */
	var autocompleteSelectElement = function(inLiElement) {
		var link = inLiElement.getElementsByClassName('info_link')[0];

		// Te value on the searchbox cames from the autocomplete list
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

	/**
	  * This methd is called when the users changes from a autocomplete list element
	  * to another one
	  *
	  * @param inAction <str>: The movement action could be:
	  *	- prev: The previous element, if the current element is the first theprev
	  *		will be the last one
	  *	- next: The next element, if the current element is the last, the next will be
	  *		the first one
	  */
	var autocompleteChangeSelect = function(inAction) {
		var elements = autocompleteDivElem.getElementsByClassName('autocomplete_result');

		if (inAction == 'prev') {
			// If we don't have any element previously selected, choose the first one
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
			// If we don't have any element previously selected, choose the last one
			if (selectedElem === null) {
				elements[0] = autocompleteSelectElement(elements[0]);
			} else {
				for (element in elements) {
					if (elements.hasOwnProperty(element)) {
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
		}
	};

	/**
	  * This method is called when the search form is submitted, and creates the view using
	  * the SpotifyPlayerObj_Controller.showDetails method, the search controller do the rest
	  * @see SpotifyPlayerObj_Controller.showDetails
	  *
	  * @param inType <string>: The type of the search could be:
	  *	- artist
	  *	- album
	  *	- track
	  * @param inValue <string>: The search string
	  */
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

	// Public
	return {
		/**
		  * Add the corresponding listeners, this methos should be called after the document is loaded 
		  */
		bootstrap: function() {
			var searchIcon = document.getElementById('search_link');
			var searchTypeSel = document.getElementById('searchbox_type');
			searchBox = document.getElementById('searchbox_input');
			autocompleteDivElem = document.getElementById('searchbox_autocomplete');
			lastSearchBoxValue = searchBox.value;
			defaultValue = searchBox.value;

			// keyevents
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
						// Check if something is changed, after to anything
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

				// Wait 0.1s after close the autocomplete to leave the user click in the elements
				setTimeout(hideAutocomplete, 100);
			}, false);

			searchIcon.addEventListener('click', function() {
				search(searchTypeSel.value, searchBox.value);
			}, false);
		}
	};
})();
