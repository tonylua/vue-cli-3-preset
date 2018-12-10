module.exports = (api, options, rootOptions) => {
  // const utils = require('./utils')(api)
  // api.render('../template')
  
  api.extendPackage({
    dependencies: {
      'whatwg-fetch': '^3.0.0',
      'normalize.css': '^8.0.1'
    }
  })

  if (options['ui-framework'] === 'element-ui') {
    api.extendPackage({
      dependencies: {
        'element-ui': '^2.4.11'
      }
    })
    api.render('../ui/element')
    api.injectImports('src/main.js', `import './plugins/element'`)
  }

  api.onCreateComplete(() => {
    // utils.updatePattern()
    // utils.deleteFile('./src/store.js')
    // utils.deleteDir('./src/views')
  })
}
