module.exports = (api, ANSWERS) => {
	api.extendPackage({
    scripts: {
      "storybook": "start-storybook -p 6006",
      "build-storybook": "build-storybook"
    },
	  devDependencies: {
      "babel-core": "7.0.0-bridge.0",
      "babel-preset-vue": "^2.0.2",
      "node-sass": "^4.9.0",
      "sass-loader": "^8.0.0",
      "vue-loader": "^15.7.0",
      "vue-style-loader": "^4.1.2",
      "vue-template-compiler": "^2.6.10",
	    "@storybook/addon-backgrounds": "^5.3.14",
	    "@storybook/addon-storysource": "^5.3.14",
	    "@storybook/addon-viewport": "^5.3.14",
	    "@storybook/addons": "^5.3.14",
	    "@storybook/vue": "^5.3.14",
      "storybook-addon-vue-info": "^1.4.1"
	  }
	});
	api.render('../../custom-deps/storybook', {
	  elementUI: ANSWERS['element-ui'],
    compositionAPI: ANSWERS['composition-api']
	});
};
