var TemplatesManager_Tool = (function (inTemplateFile) {
	var templateContent = '';

	var my = {
		constructor: function(inTemplateFile) {
			templateContent = 
			var xhr = new XMLHttpRequest();
			xhr.open('GET', config.templatesDir + inTemplateFile, false);
			xhr.onload = function(e) {
				if (this.status != 200) {
					console.error('TemplatesManager_Tool: Problem trying to load template from: ' + config.templatesDir + inTemplateFile);

					return false;
				}

				templateContent = this.response;
			};

			return this;
		},

		process: function(inParams) {
			for (var param in inParams) {
				if (typeof(inParams[param]) == 'object') {
					
				}
			}
		}
	}

	return my.constructor(inTemplateFile);
});
