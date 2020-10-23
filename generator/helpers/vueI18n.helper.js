module.exports = (api) => {
  api.extendPackage({
    dependencies: {
      "vue-i18n": "^8.22.1",
      "vue-cookie": "^1.1.4",
    },
  });
  api.render("../../custom-deps/vue-i18n");
};
