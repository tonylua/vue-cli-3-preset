const fs = require('fs');
const path = require('path');

module.exports = (api) => {
	api.onCreateComplete(() => {
	  const oldFile = api.resolve('src/router/index.js');
    const myFile = path.resolve(__dirname, '../template/src/router/index.js');
    if (fs.existsSync(oldFile)) {
      fs.unlinkSync(oldFile);
      fs.copyFileSync(myFile, oldFile);
    }
	});
};
