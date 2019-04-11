const config = require('./config');

const { original } = JSON.parse(process.env.npm_config_argv);
const useLocal = ~original.indexOf('--local');

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
		const rewritePath = useLocal && rewrite.local
			? `http://${mock.host}:${mock.port}`
			: target;
		cfg.pathRewrite = {
			[`^${prefix}`]: rewritePath
		}
	}
  
  rst[prefix] = cfg;

  return rst;
}, {});

module.exports = {
  open: true,
  port: config.app.port,
  host: config.app.host,
  proxy
};
