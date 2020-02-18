const webpack = require('webpack');

const { BUILD_ENV } = process.env;

module.exports = (config) => {
  // global vars & so on...
  config.plugin('define-globals')
    .use(webpack.DefinePlugin, [{
      RUNTIME_ENV: `'${BUILD_ENV}'`
    }]);
  if (process.env.NODE_ENV === 'production') {
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
