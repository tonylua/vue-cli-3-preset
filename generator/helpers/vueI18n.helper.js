module.exports = (api) => {
	api.extendPackage({
	  dependencies: {
	    'vue-i18n': '^8.4.0',
			'vue-cookie': '^1.1.4'
	  }
	});
	api.render('../../custom-deps/vue-i18n');
	api.injectImports(api.entryFile, 
	  `import i18n from './plugins/i18n'`);
};
