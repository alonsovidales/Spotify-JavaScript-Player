/**
  * @author: Alonso Vidales <alonso.vidales@tras2.es>
  * @date: 2012-03-03
  *
  * Templates system to render the .tpl files
  *
  * @param inTemplateFile <string>: The file name of the template
  *	inside the config.templatesDir dir
  * 
  * @see config.templatesDir
  */

var TemplatesManager_Tool = (function (inTemplateFile) {
	var templateContent = ''; // The current content of the template

	/**
	  * Convert the characters &, <, >, " to the corresponding entities
	  * to avoid code inyection
	  *
	  * @param inStr <str>: The string to be escaped
	  *
	  * @return <str>: The string escaped
	  */
	var htmlEntities = function(inStr) {
		return String(inStr).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	/**
	  * Replace all the appearances of inFrom to inTo into inStr
	  *
	  * @param inStr <str>: The string to be escaped
	  * @param inFrom <str>: The string to be replaced
	  * @param inTo <str>: The replace string
	  *
	  * @return <str>: The result string
	  */
	var replaceAll = function(inStr, inFrom, inTo) {
		while (inStr.indexOf(inFrom) != -1) {
			inStr = inStr.replace(inFrom, inTo);
		}

		return inStr;
	};

	/**
	  * Replace the tags for the corresponding values, process the loops, and
	  * and if clausules, returns the processed html as a string
	  *
	  * @param inTemplate <str>: The content of the .tpl file
	  * @param inParams <object>: The values to be processed
	  * @param inPrefix <str>: The prefix for the recursion on the loops
	  *
	  * @return <str>: The result string with the values applied
	  */
	var processTemplate = function(inTemplate, inParams, inPrefix) {
		var result = inTemplate;
		var prefix = inPrefix;

		// Process all the objects that can be loops
		for (var param in inParams) {
			// If the param is a object, search a {for x in #y#} who matches and
			// process it using recursion
			if (typeof(inParams[param]) == 'object') {
				var loopPattern = new RegExp(
					'\\{for (\\w+) in #' + prefix + param + '#\\}.+?\\{\\/for #' + prefix + param + '#\\}',
					'g');
				var loops = loopPattern.exec(result);

				if (loops !== null) {
					for (var count = 0; count < loops.length; count += 2) {
						var loopContent = '';
						for (loopParam in inParams[param]) {
							if (inParams[param].hasOwnProperty(loopParam)) {
								loopContent += processTemplate(
									loops[count],
									inParams[param][loopParam],
									inPrefix + loops[count + 1] + '.');
							}
						}
	
						result = result.replace(loops[count], loopContent);
					}
				}
			}
		}

		// Process the simple vars using direct replacement
		for (param in inParams) {
			if (typeof(inParams[param]) != 'object') {
				// If the var is a boolean var, look for the {if #xx#} clausules,
				// and if the val is false, remove the content
				if (typeof(inParams[param]) == 'boolean') {
					var ifPattern = new RegExp(
						'\\{if #' + prefix + param + '#\\}(.+?)\\{\\/if #' + prefix + param + '#\\}',
						'g');

					if (!inParams[param]) {
						result = result.replace(ifPattern, '');
					}
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				} else {
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				}
			}
		}

		// Remove the unnecesary tags
		result = result.replace(/\{for [^\}]* in [^\}]*\}/g, '');
		result = result.replace(/\{\/for [^\}]*\}/g, '');
		result = result.replace(/\{if [^\}]*\}/g, '');
		result = result.replace(/\{\/if [^\}]*\}/g, '');

		return result;
	};

	var my = {
		/**
		  * Load the content of the .tpl file form the config.templatesDir dir
		  *
		  * @param inTemplateFile <string>: The file name
		  *
  		  * @see config.templatesDir
		  */
		constructor: function(inTemplateFile) {
			// Load the content of the .tpl file
			var xhr = new XMLHttpRequest();
			xhr.open('GET', config.templatesDir + inTemplateFile, false);
			xhr.addEventListener('load', function(e) {
				if (this.status != 200) {
					console.error('TemplatesManager_Tool: Problem trying to load template from: ' + config.templatesDir + inTemplateFile);

					return false;
				}

				templateContent = replaceAll(this.response, "\n", '');
			}, false);
			xhr.addEventListener('error', function(e) {
				console.error('TemplatesManager_Tool: Problem getting the ' + inTemplateFile + ' template file');
			}, false);
			xhr.send();

			return this;
		},

		/**
		  * Using the inParams object, replace all the tags on the .tpl
		  * and return the content result as a string
		  *
		  * @param inParams <object>: The object with the values
		  *
		  * @result <str>: The result string
		  */
		process: function(inParams) {
			return processTemplate(templateContent, inParams, '');
		}
	};

	return my.constructor(inTemplateFile);
});
