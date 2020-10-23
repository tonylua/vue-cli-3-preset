module.exports = (api, ANSWERS) => {
  api.extendPackage({
    scripts: {
      storybook: "start-storybook -p 6006",
      "build-storybook": "build-storybook",
    },
    devDependencies: {
      "awesome-typescript-loader": "^5.2.1",
      "babel-core": "7.0.0-bridge.0",
      "babel-preset-vue": "^2.0.2",
      "node-sass": "^4.14.1",
      "sass-loader": "^8.0.0",
      "vue-loader": "^15.7.0",
      "vue-style-loader": "^4.1.2",
      "vue-template-compiler": "^2.6.10",
      "storybook-addon-vue-info": "^1.4.2",
      "vue-docgen-api": "^4.33.2",
      "vue-docgen-loader": "^1.5.0",

      "@storybook/addon-actions": "^6.0.26",
      "@storybook/addon-backgrounds": "^6.0.26",
      "@storybook/addon-essentials": "^6.0.26",
      "@storybook/addon-links": "^6.0.26",
      "@storybook/addon-storysource": "^6.0.26",
      "@storybook/addon-viewport": "^6.0.26",
      "@storybook/addons": "^6.0.26",
      "@storybook/preset-scss": "^1.0.3",
      "@storybook/source-loader": "^6.0.26",
      "@storybook/vue": "^6.0.26",
    },
  });
  api.render("../../custom-deps/storybook", {
    elementUI: ANSWERS["element-ui"],
    compositionAPI: ANSWERS["composition-api"],
  });
};
