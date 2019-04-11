const webpack = require('webpack');

module.exports = (config) => {
  // global vars & so on...
  config.plugin('provide')
    .use(webpack.ProvidePlugin, [{
      //'$': 'jquery',
    }]);
  return config; 
};
