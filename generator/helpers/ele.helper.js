module.exports = (api, ANSWERS) => {
  api.extendPackage({
    devDependencies: {
      "element-ui": "^2.13.2",
    },
  });
  api.render("../../custom-deps/element", {
    vuei18n: ANSWERS["vue-i18n"],
  });
};
