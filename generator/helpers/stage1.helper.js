const fs = require('fs');
const path = require('path');

module.exports = (api) => {
  api.extendPackage({
    devDependencies: {
      "@babel/plugin-proposal-nullish-coalescing-operator": "^7.8.3",
      "@babel/plugin-proposal-optional-chaining": "^7.8.3",
      "@babel/plugin-proposal-pipeline-operator": "^7.8.3"
    }
  });
	api.onCreateComplete(() => {
	  const oldFile = api.resolve('babel.config.js');
    const myFile = path.resolve(__dirname, '../../template/babel.config.js');
    if (fs.existsSync(oldFile)) {
      fs.unlinkSync(oldFile);
      fs.copyFileSync(myFile, oldFile);
    }
	});
};
