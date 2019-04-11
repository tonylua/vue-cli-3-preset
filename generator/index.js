const fs = require('fs');
const path = require('path');
const eslintConfig = require('./eslint.config');
const expressHelper = require('./express.helper');
const docsHelper = require('./docs.helper');
const configHelper = require('./config.helper');

const epConfig = require('../template/config/config');

module.exports = (api, options, rootOptions) => {

  const promptAnswers = {
    "vue-i18n": options['I18n'] === 'vue-i18n',
    "element-ui": options['ui-framework'] === 'element-ui',
    "local-mock-express": options['local-mock'] === 'express.js'
  }

	const expectFiles = files => {
		Object.keys(files)
      .filter(path => path.startsWith('tests/')) // delete unexpect dirs
      .forEach(path => delete files[path])	
	}
	api.render(expectFiles);
	
  api.render('../template', {
    'projectName': rootOptions.projectName,
    'opt_i18n': promptAnswers['vue-i18n'],
    'opt_express': promptAnswers['local-mock-express'],
		'opt_elementui': promptAnswers['element-ui']
  })
  
  api.extendPackage({
		eslintConfig,
    scripts: {
      "test": "npm run test:unit"
    },
    dependencies: {
      'whatwg-fetch': '^3.0.0',
      'lodash': '^4.17.11',
      'qs': '^6.6.0',
      'file-saver': '^2.0.0',
      'quickfetch': '^0.0.16',
      'normalize.css': '^8.0.1',
    },
    vue: {
			css: {
				sourceMap: true
			},
      devServer: {},
			chainWebpack: (config) => {}
    }
  })

  if (promptAnswers['vue-i18n']) {
    api.extendPackage({
      dependencies: {
        'vue-i18n': '^8.4.0',
				'vue-cookie': '^1.1.4'
      }
    })
    api.render('../custom-deps/vue-i18n')
    api.injectImports('src/main.js', 
      `import i18n from './plugins/i18n'`)
  }

	if (promptAnswers['element-ui']) { // 要晚于 i18n
    api.extendPackage({
      dependencies: {
        'element-ui': '^2.4.11'
      }
    })
    api.render('../custom-deps/element', {
      'vuei18n': promptAnswers['vue-i18n']
    })
    api.injectImports('src/main.js', 
      `import './plugins/element'`)
  }

  if (promptAnswers['local-mock-express']) {
		expressHelper(api);
  }

  api.onCreateComplete(() => {
		configHelper(api);
		docsHelper(api, 
			rootOptions.projectName,
			!!promptAnswers['local-mock-express']);
  })
}
