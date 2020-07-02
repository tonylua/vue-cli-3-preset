module.exports = (api) => {
  api.extendPackage({
    devDependencies: {
      "@vue/composition-api": "^1.0.0-beta.1",
    },
  });
  api.render("../../custom-deps/composition-api");
  api.injectImports(
    api.entryFile,
    `import VueCompositionApi from '@vue/composition-api'`
  );
};
