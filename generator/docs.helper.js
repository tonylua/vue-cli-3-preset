const fs = require('fs');
const path = require('path');

module.exports = (api, projectName, mock = false) => {
	// copy CHANGELOG
	fs.copyFileSync(
	  path.resolve(__dirname, '../template/CHANGELOG.md'),
	  api.resolve('./CHANGELOG.md')
	);
	// rewrite README
	setTimeout(()=>{
	  fs.writeFileSync(
	    api.resolve('./README.md'),
	    `# ${projectName} \n\n---\n`
	      + fs.readFileSync(
	        path.resolve(__dirname, '../template/README.md'),
	        {encoding: 'utf-8'}
	      ).replace(
	        '<!--LOCAL_EXPRESS?-->',
	        mock
	          ? '### Compiles and local mock server for development\n```\nnpm run servelocal\n```'
	          : ''
	      )
	  )
	}, 2000);
};
