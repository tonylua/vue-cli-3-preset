const config = require('./config');

const { useLocal } = config;

const { mock } = config;

const proxy = config.proxy.reduce((rst, p) => {
  const { target, prefix, rewrite } = p;
  
	const cfg = {
		target: useLocal
			? `http://${mock.host}:${mock.port}`
			: target,
		changeOrigin: true
	};
	if (rewrite && rewrite.need) {
		// 加入了prefix，区分支持 /api 和 /xapi2 等不同的前缀
    // 对应要求 mock 接口中也应写明前缀
		const path = `${mock.port}/${prefix}`.replace(/\/+/g, '/');
		const rewritePath = useLocal
		  ? `http://${mock.host}:${path}`
		  : target + (rewrite.to || '');
		cfg.pathRewrite = {
			[`^${prefix}`]: rewritePath
		}
	}
  
  rst[prefix] = cfg;

  return rst;
}, {});

module.exports = {
  open: true,
  progress: false,
  port: config.app.port,
  host: config.app.host,
  proxy
};
