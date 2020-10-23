module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      "vue-i18n": "^8.22.1",
      "vue-cookie": "^1.1.4",
    },
  });
  api.render("../../custom-deps/vue-i18n");
  const EntryFile = api.resolve("src/main.ts"); // 直接用 api.entryFile 有 bug
  api.injectImports(EntryFile, `import i18n from './plugins/i18n'`);
};
