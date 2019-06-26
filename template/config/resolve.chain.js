const path = require('path');

const resolve = (dir) => path.join(__dirname, '..', dir);

module.exports = (config) => {
  config.resolve
    .set('extensions', ['.js', '.vue', '.json', '.css', '.scss']);
  config.resolve.alias
    .set('~', resolve('node_modules'))
    .set('@', resolve('src'));
  return config;
};
