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

		console.log('------ Processing for: ' + inPrefix);
		console.log({
			'template': inTemplate,
			'params': inParams});

		// Process all the objects that can be loops
		for (var param in inParams) {
			if (typeof(inParams[param]) == 'object') {
				console.log("PARAM: " + param);
				var loopPattern = new RegExp('\\{for (\\w+) in ' + prefix + param + '\\}.*\\{\\/for\\}', 'g');
				var loops = loopPattern.exec(result);
				console.log(loops);

				for (var count = 0; count < loops.length; count += 2) {
					var loopContent = '';
					for (loopParam in inParams[param]) {
						loopContent += processTemplate(loops[count], inParams[param][loopParam], inPrefix + loops[count + 1] + '.');
					}

					/*console.log("REPLACE: ");
					console.log({
						from: loops[count],
						to: loopContent});*/
					loopContent = loopContent.replace(/\{for \w+ in \w+\}/g, '');
					loopContent = loopContent.replace(/\{\/for\}/g, '');
					result = result.replace(loops[count], loopContent);
				}
			}
		}

		// Process the simple vars
		for (var param in inParams) {
			if (typeof(inParams[param]) != 'object') {
				if (typeof(inParams[param]) == 'boolean') {
					if (inParams[param]) {
						
					}
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				} else {
					result = replaceAll(result, '#' + prefix + param + '#', htmlEntities(inParams[param]));
				}
			}
		}

		return result;
	};

	var my = {
		constructor: function(inTemplateFile) {
			var xhr = new XMLHttpRequest();
			xhr.open('GET', config.templatesDir + inTemplateFile, false);
			xhr.onload = function(e) {
				if (this.status != 200) {
					console.error('TemplatesManager_Tool: Problem trying to load template from: ' + config.templatesDir + inTemplateFile);

					return false;
				}

				console.log('Loaded');

				templateContent = replaceAll(this.response, "\n", '');
			};
			xhr.send();

			return this;
		},

		process: function(inParams) {
			console.log(inParams);
			return processTemplate(templateContent, inParams, '');
		}
	}

	return my.constructor(inTemplateFile);
});
