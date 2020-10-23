module.exports = (api) => {
  api.extendPackage({
    devDependencies: {
      "@vue/composition-api": "^1.0.0-beta.18",
    },
  });

  api.render("../../custom-deps/composition");
};
