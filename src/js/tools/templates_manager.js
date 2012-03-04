/**
  *
  * @author: Alonso Vidales <alonso.vidales@tras2.es>
  * @date: 2012-03-03
  */


var TemplatesManager_Tool = (function (inTemplateFile) {
	var templateContent = '';

	var htmlEntities = function(inStr) {
		return String(inStr).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
	};

	var replaceAll = function(inStr, inFrom, inTo) {
		while (inStr.indexOf(inFrom) != -1) {
			inStr = inStr.replace(inFrom, inTo);
		}

		return inStr;
	};

	var processTemplate = function(inTemplate, inParams, inPrefix) {
		var result = inTemplate;
		var prefix = inPrefix;

		// Process all the objects that can be loops
		for (var param in inParams) {
			if (typeof(inParams[param]) == 'object') {
				var loopPattern = new RegExp('\\{for (\\w+) in #' + prefix + param + '#\\}.+?\\{\\/for #' + prefix + param + '#\\}', 'g');
				var loops = loopPattern.exec(result);

				if (loops !== null) {
					for (var count = 0; count < loops.length; count += 2) {
						var loopContent = '';
						for (loopParam in inParams[param]) {
							loopContent += processTemplate(loops[count], inParams[param][loopParam], inPrefix + loops[count + 1] + '.');
						}
	
						result = result.replace(loops[count], loopContent);
					}
				}
			}
		}

		// Process the simple vars
		for (var param in inParams) {
			if (typeof(inParams[param]) != 'object') {
				if (typeof(inParams[param]) == 'boolean') {
					var ifPattern = new RegExp('\\{if #' + prefix + param + '#\\}(.+?)\\{\\/if #' + prefix + param + '#\\}', 'g');
					if (!inParams[param]) {
						result = result.replace(ifPattern, '');
					}
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				} else {
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				}
			}
		}

		result = result.replace(/\{for [^\}]* in [^\}]*\}/g, '');
		result = result.replace(/\{\/for [^\}]*\}/g, '');
		result = result.replace(/\{if [^\}]*\}/g, '');
		result = result.replace(/\{\/if [^\}]*\}/g, '');

		return result;
	};

	var my = {
		constructor: function(inTemplateFile) {
			var xhr = new XMLHttpRequest();
			console.log(config.templatesDir + inTemplateFile);
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

		process: function(inParams) {
			return processTemplate(templateContent, inParams, '');
		}
	}

	return my.constructor(inTemplateFile);
});
