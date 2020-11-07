const fs = require("fs");
const path = require("path");
const eslintConfig = require("./eslint.config");
const mainHelper = require("./helpers/main.helper");
const vueI18nHelper = require("./helpers/vueI18n.helper");
const eleHelper = require("./helpers/ele.helper");
const expressHelper = require("./helpers/express.helper");
const docsHelper = require("./helpers/docs.helper");
const configHelper = require("./helpers/config.helper");
const stage1Helper = require("./helpers/stage1.helper");
const routerHelper = require("./helpers/router.helper");
const storybookHelper = require("./helpers/storybook.helper");
const compositionHelper = require("./helpers/composition.helper");

module.exports = (api, options, rootOptions) => {
  const ANSWERS = {
    "composition-api": options["composition-api"],
    "vue-i18n": options["i18n"] === "vue-i18n",
    "element-ui": options["ui"] === "element-ui",
    "mock-express": options["mock"] === "express.js",
    storybook: options["storybook"],
  };

  api.render((files) => {
    Object.keys(files)
      .filter((path) => path.startsWith("tests/"))
      .forEach((path) => delete files[path]); // delete unexpect dirs
  });

  const tmplParams = {
    projectName: rootOptions.projectName,
    opt_compositionapi: ANSWERS["composition-api"],
    opt_i18n: ANSWERS["vue-i18n"],
    opt_express: ANSWERS["mock-express"],
    opt_elementui: ANSWERS["element-ui"],
  };
  api.render("../template", tmplParams);

  api.extendPackage({
    eslintConfig,
    scripts: {
      "lint-staged": "lint-staged",
      "build-prod": "vue-cli-service build --mode prod",
      postinstall:
        'shell-exec --colored-output "node fix-vue-babel.js" "npm rebuild node-sass"',
      test:
        'shell-exec --colored-output "node fix-vue-babel.js" "npm run test:unit"',
    },
    dependencies: {
      qs: "^6.9.4",
    },
    devDependencies: {
      "whatwg-fetch": "^3.4.1",
      lodash: "^4.17.20",
      "lint-staged": "^10.4.2",
      "pre-commit": "^1.2.2",
      "file-saver": "^2.0.2",
      quickfetch: "^1.0.0-alpha.5",
      "normalize.css": "^8.0.1",
      "@types/lodash": "^4.14.157",
      "@types/jest": "^26.0.15",
      "@types/lodash": "^4.14.162",
      "@types/file-saver": "^2.0.1",
      "@typescript-eslint/eslint-plugin": "^4.5.0",
      "@typescript-eslint/parser": "^4.5.0",
      "@vue/cli-plugin-typescript": "^4.4.8",
      "@vue/eslint-config-typescript": "^7.0.0",
      "ts-jest": "^26.4.1",
      "tsconfig-paths-webpack-plugin": "^3.3.0",
      "react-is": "^17.0.0",
      typescript: "~3.9.3",
    },
    "lint-staged": {
      "*.js": ["eslint --fix", "git add"],
      "*.vue": ["eslint --fix", "git add"],
    },
    "pre-commit": ["lint-staged", "test"],
    vue: {
      css: {
        sourceMap: true,
      },
      devServer: {},
      chainWebpack: (config) => {},
    },
  });

  stage1Helper(api);

  if (ANSWERS["composition-api"]) {
    compositionHelper(api);
  }
  if (ANSWERS["vue-i18n"]) {
    vueI18nHelper(api);
  }
  if (ANSWERS["element-ui"]) {
    // 要晚于 i18n
    eleHelper(api, ANSWERS);
  }
  if (ANSWERS["mock-express"]) {
    expressHelper(api);
  }
  if (ANSWERS["storybook"]) {
    storybookHelper(api, ANSWERS);
  }

  api.onCreateComplete(() => {
    routerHelper(api);
    configHelper(api);
    mainHelper(api);
    docsHelper(
      api,
      rootOptions.projectName,
      !!ANSWERS["mock-express"],
      ANSWERS["storybook"]
    );
  });
};
