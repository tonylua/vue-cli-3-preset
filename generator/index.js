const fs = require('fs');
const path = require('path');
const eslintConfig = require('./eslint.config');
const mainHelper = require('./helpers/main.helper');
const vueI18nHelper = require('./helpers/vueI18n.helper');
const eleHelper = require('./helpers/ele.helper');
const expressHelper = require('./helpers/express.helper');
const docsHelper = require('./helpers/docs.helper');
const configHelper = require('./helpers/config.helper');
const stage1Helper = require('./helpers/stage1.helper');
const routerHelper = require('./helpers/router.helper');
const storybookHelper = require('./helpers/storybook.helper');
const compositionHelper = require('./helpers/composition.helper');

module.exports = (api, options, rootOptions) => {
  const ANSWERS = {
    "composition-api": options['composition-api'],
    "vue-i18n": options['i18n'] === 'vue-i18n',
    "element-ui": options['ui'] === 'element-ui',
    "mock-express": options['mock'] === 'express.js',
    "storybook": options['storybook']
  }

  api.render((files) => {
    Object.keys(files)
      .filter(path => path.startsWith('tests/'))
      .forEach(path => delete files[path]) // delete unexpect dirs
  });

  const tmplParams = {
    'projectName': rootOptions.projectName,
    'opt_compositionapi': ANSWERS['composition-api'],
    'opt_i18n': ANSWERS['vue-i18n'],
    'opt_express': ANSWERS['mock-express'],
    'opt_elementui': ANSWERS['element-ui']
  };
  api.render('../template', tmplParams);

  api.extendPackage({
    eslintConfig,
    scripts: {
      "test": "npm run test:unit",
      "lint-staged": "lint-staged",
      "build-prod": "vue-cli-service build --mode prod",
      "postinstall": "npm rebuild node-sass"
    },
    dependencies: {
      'qs': '^6.6.0'
    },
    devDependencies: {
      'whatwg-fetch': '^3.0.0',
      'lodash': '^4.17.11',
      "lint-staged": "^8.1.5",
      "pre-commit": "^1.2.2",
      'file-saver': '^2.0.0',
      'quickfetch': '^0.1.1',
      'normalize.css': '^8.0.1',
    },
    "lint-staged": {
      "*.js": [
        "eslint --fix",
        "git add"
      ],
      "*.vue": [
        "eslint --fix",
        "git add"
      ]
    },
    "pre-commit": [
      "lint-staged",
      "test"
    ],
    vue: {
      css: {
        sourceMap: true
      },
      devServer: {},
      chainWebpack: (config) => {}
    }
  });
  
  stage1Helper(api);

  if (ANSWERS['composition-api']) {
    compositionHelper(api);
  }
  if (ANSWERS['vue-i18n']) {
    vueI18nHelper(api);
  }
  if (ANSWERS['element-ui']) { // 要晚于 i18n
    eleHelper(api, ANSWERS);
  }
  if (ANSWERS['mock-express']) {
    expressHelper(api);
  }
  if (ANSWERS['storybook']) {
    storybookHelper(api, ANSWERS);
  }

  api.onCreateComplete(() => {
    routerHelper(api);
    configHelper(api);
    mainHelper(api);
    docsHelper(api,
      rootOptions.projectName,
      !!ANSWERS['mock-express'],
      ANSWERS['storybook']);
  })
}
