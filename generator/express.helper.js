const fs = require('fs');
const findBracketsRange = require('./brackets.util');

module.exports = (api) => {
	api.extendPackage({
	  scripts: {
	    "express": "nodemon api/mock.server.js",
	    "servelocal": "shell-exec --colored-output \"npm run serve --local\" \"npm run express\""
	  },
    dependencies: {
	    'request': '^2.88.0',
	    'express': '^4.16.4',
	    'body-parser': '^1.18.3'
    },
	  devDependencies: {
	    'nodemon': '^1.18.7',
	    'klaw-sync': '^6.0.0',
	    'shell-executor': '^6.0.1'
	  }
	})
	api.render('../custom-deps/express');
	api.onCreateComplete(() => {
	  const vueConfig = api.resolve('./vue.config.js');
	  
		let newCont = fs.readFileSync(vueConfig, {encoding: 'utf-8'})
	    .replace(
	      /module\.exports\s*\=\s*\{/,
				`const devServer = require('./config/dev.server');\r\nmodule.exports = {`
	    );
		
		const re = /devServer/g;
		re.exec(newCont); // 排除 import 语句
		const idx = re.exec(newCont).index; // 第二个 devServer 出现的位置
		const { start, end } = findBracketsRange(newCont, idx);
		if (end) {
			newCont = newCont.substr(0, idx)
				+ 'devServer'
				+ newCont.substr(end);
		}
			
	  fs.writeFileSync(vueConfig, newCont);
	});
};
