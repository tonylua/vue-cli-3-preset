const webpack = require('webpack');

module.exports = (config) => {
  // global vars & so on...
  config.plugin('provide')
    .use(webpack.ProvidePlugin, [{
      //'$': 'jquery',
    }]);
    
  if (process.env.NODE_ENV === 'production') {
    // config.externals({
    // });
  
    // https://webpack.js.org/plugins/split-chunks-plugin/
    config.optimization.splitChunks({
      chunks: 'async',
      maxAsyncRequests: 5,
      maxSize: 1500000,
      minSize: 1000000,
    });
  }
  return config; 
};
