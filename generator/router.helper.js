const fs = require('fs');

module.exports = (api) => {
	api.onCreateComplete(() => {
	  const oldFile = api.resolve('src/router.js');
	  fs.unlinkSync(oldFile);
	});
};
