const webpack = require('webpack');

const { BUILD_ENV, npm_config_endpoint } = process.env;

module.exports = (config) => {
  // global vars & so on...
  config.plugin('define-globals')
    .use(webpack.DefinePlugin, [{
      BUILD_CHAIN_ENDPOINT: BUILD_ENV === 'prod' ? `'${npm_config_endpoint}'` : void(0),
    }]);
  // 别名
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
