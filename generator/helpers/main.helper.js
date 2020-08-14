const fs = require("fs");
const { EOL } = require("os");

module.exports = (api) => {
  api.onCreateComplete(() => {
    /*
		const EntryFile = api.resolve('src/main.ts'); // 直接用 api.entryFile 有 bug
	  const contentMain = fs.readFileSync(EntryFile, { encoding: 'utf-8' });
	  const lines = contentMain.split(/\r?\n/g);
	  
	  [
	    lines.findIndex(line => line.match(/import\srouter/)),
	    lines.findIndex(line => line.match(/import\sstore/)),
	    lines.findIndex(line => line.match(/router\,/)),
	    lines.findIndex(line => line.match(/store\,/))
	  ].forEach(lineIdx => {
      if (lineIdx > -1) {
        lines[lineIdx] = '';
      }
	  });
	  
	  fs.writeFileSync(EntryFile, lines.join(EOL), { encoding: 'utf-8' });
	  */
    fs.unlinkSync(api.resovle("src/main.js"));
  });
};
