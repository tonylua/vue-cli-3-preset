const fs = require('fs');
const findBracketsRange = require('../brackets.util');

module.exports = (api) => {
	api.onCreateComplete(() => {
	  const vueConfig = api.resolve('./vue.config.js');
	  
		let newCont = fs.readFileSync(vueConfig, {encoding: 'utf-8'});
			
		newCont = [
			`const resolveChain = require('./config/resolve.chain');`,
			`const pluginsChain = require('./config/plugins.chain');`,
			newCont
		].join('\r\n');
		
		const re = /chainWebpack/g;
		const idx = re.exec(newCont).index;
		const { start, end } = findBracketsRange(newCont, idx);
		if (end) {
			newCont = newCont.substr(0, idx)
				+ `chainWebpack: (config) => {
						resolveChain(config);
						pluginsChain(config);
					}`
				+ newCont.substr(end);
		}
			
	  fs.writeFileSync(vueConfig, newCont);
	});
};
