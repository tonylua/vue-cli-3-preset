module.exports = (api, ANSWERS) => {
	api.extendPackage({
	  dependencies: {
	    'element-ui': '^2.4.11'
	  }
	});
	api.render('../custom-deps/element', {
	  'vuei18n': ANSWERS['vue-i18n']
	});
	api.injectImports('src/main.js', 
	  `import './plugins/element'`);
};
