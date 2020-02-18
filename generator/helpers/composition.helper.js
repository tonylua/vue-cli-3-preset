module.exports = (api) => {
	api.extendPackage({
	  devDependencies: {
      "@vue/composition-api": "^0.3.4"
	  }
	});
  api.render('../../custom-deps/composition-api');
	api.injectImports(api.entryFile,
	  `import VueCompositionApi from '@vue/composition-api'`);
};
