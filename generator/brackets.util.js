module.exports = (cont, beginIndex = 0, openBracket = '{') => {
	const MAP = {
		'{': '}',
		'(': ')',
		'[': ']'
	};
	const closeBracket = MAP[openBracket];
	if (!closeBracket) {
		throw new Error(`non-supported bracket: ${openBracket}`);
	}
	const start = beginIndex + cont.substr(beginIndex).indexOf(openBracket); // 花括号开始的位置
	let end = 0;
	let curr = start + 1;
	let flag = 1;
	while (flag > 0) {
		if (cont.charAt(curr) === openBracket) {
			flag++;
		} else if (cont.charAt(curr) === closeBracket) {
			flag--;
		}
		curr++;
		if (flag === 0) {
			end = curr; // 匹配的花括号结束的位置
		} else if (curr >= cont.length) { // 找不到的极端情况
			break;
		}
	}
	return { start, end };
};
