module.exports = (api, ANSWERS) => {
  api.extendPackage({
    devDependencies: {
      "element-ui": "^2.4.11",
    },
  });
  api.render("../../custom-deps/element", {
    vuei18n: ANSWERS["vue-i18n"],
  });
  const EntryFile = api.resolve("src/main.ts"); // 直接用 api.entryFile 有 bug
  api.injectImports(EntryFile, `import './plugins/element'`);
};
