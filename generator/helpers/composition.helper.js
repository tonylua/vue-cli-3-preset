module.exports = (api) => {
  api.extendPackage({
    devDependencies: {
      "@vue/composition-api": "^1.0.0-beta.1",
    },
  });

  api.render("../../custom-deps/composition");
  const EntryFile = api.resolve("src/main.ts"); // 直接用 api.entryFile 有 bug
  api.injectImports(EntryFile, `import './plugins/composition'`);
};
