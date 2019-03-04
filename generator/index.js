const fs = require('fs');
const path = require('path');

const epConfig = require('../custom-deps/express/api/config');

module.exports = (api, options, rootOptions) => {

  const promptAnswers = {
    "vue-i18n": options['I18n'] === 'vue-i18n',
    "element-ui": options['ui-framework'] === 'element-ui',
    "local-mock-express": options['local-mock'] === 'express.js'
  }

  api.render('../template', {
    'projectName': rootOptions.projectName,
    'vuei18n': promptAnswers['vue-i18n'],
    'express': promptAnswers['local-mock-express']
  })
  
  api.extendPackage({
    scripts: {
      "test": "npm run test:unit"
    },
    dependencies: {
      'whatwg-fetch': '^3.0.0',
      'lodash': '^4.17.11',
      'qs': '^6.6.0',
      'file-saver': '^2.0.0',
      'quickfetch': '^0.0.15',
      'normalize.css': '^8.0.1',
    },
    vue: {
      devServer: {
        port: epConfig.port,
        host: epConfig.host,
        proxy: {
          [epConfig.ajaxPrefix]: {
            changeOrigin: true,
            target: epConfig.proxy
          }
        } 
      }
    },
    eslintConfig: {
      rules: {
        'space-before-function-paren': 'off',
        'no-underscore-dangle': 'off',
        'no-param-reassign': 'off',
        'func-names': 'off',
        'no-bitwise': 'off',
        'prefer-rest-params': 'off',
        'no-trailing-spaces': 'off',
        'comma-dangle': 'off',
        'quote-props': 'off',
        'consistent-return': 'off',
        'no-plusplus': 'off',
        'prefer-spread': 'warn',
        'semi': 'warn',
        'indent': 'warn',
        'no-tabs': 'warn',
        'no-unused-vars': 'warn',
        'quotes': 'warn',
        'no-void': 'off',
        'no-nested-ternary': 'off',
        'import/no-unresolved': 'off',
        'no-return-assign': 'warn'
      }
    }
  })

  if (promptAnswers['vue-i18n']) {
    api.extendPackage({
      dependencies: {
        'vue-i18n': '^8.4.0'
      }
    })
    api.render('../custom-deps/vue-i18n')
    api.injectImports('src/main.js', 
      `import i18n from './plugins/vue-i18n'`)
  }

  if (promptAnswers['element-ui']) {
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

    //TODO useLocal

    api.extendPackage({
      scripts: {
        "express": "nodemon api/server.js",
        "servelocal": "shell-exec --colored-output \"npm run serve --local\" \"npm run express\""
      },
      devDependencies: {
        'nodemon': '^1.18.7',
        'klaw-sync': '^6.0.0',
        'request': '^2.88.0',
        'express': '^4.16.4',
        'body-parser': '^1.18.3',
        'shell-executor': '^6.0.1'
      }
    })
    api.render('../custom-deps/express');
    api.onCreateComplete(() => {
      //inject to vue.config.js
      const vueConfig = api.resolve('./vue.config.js');
      const newCont = fs.readFileSync(vueConfig, {encoding: 'utf-8'})
        .replace(
          /module\.exports\s*\=\s*\{/,
          `const { original } = JSON.parse(process.env.npm_config_argv);
const use_local = ~original.indexOf('--local');
const proxy_url = use_local 
  ? 'http://${epConfig.host}:${epConfig.localServerPort}' 
  : '${epConfig.proxy}';          
module.exports = {`
        ).replace(
          /target\s*\:.*\n/,
          'target: proxy_url,\n'
        );
      fs.writeFileSync(vueConfig, newCont);
    });
  }

  api.onCreateComplete(() => {
    //copy CHANGELOG
    fs.copyFileSync(
      path.resolve(__dirname, '../template/CHANGELOG.md'),
      api.resolve('./CHANGELOG.md')
    );
    //rewrite README
    setTimeout(()=>{
      fs.writeFileSync(
        api.resolve('./README.md'),
        `# ${rootOptions.projectName} \n\n---\n`
          + fs.readFileSync(
            path.resolve(__dirname, '../template/README.md'),
            {encoding: 'utf-8'}
          ).replace(
            '<!--LOCAL_EXPRESS?-->',
            promptAnswers['local-mock-express']
              ? '### Compiles and local mock server for development\n```\nnpm run servelocal\n```'
              : ''
          )
      )
    }, 2000);
  })
}
