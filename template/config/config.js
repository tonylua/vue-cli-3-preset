const { original } = JSON.parse(process.env.npm_config_argv);
const useLocal = ~original.indexOf('--local');
const appIp = (function() {
  const ipCmd = original.filter(item => /\-\-ip\=((\d{1,3}\.?){4})/.test(item));
  if (!ipCmd.length) return null;
  return RegExp.$1;
}());

module.exports = {
	app: {
		host: appIp || 'localhost', // or 'local.xxx.com' for 127.0.0.1 in your hosts,
		port: 8080,
	},
	mock: {
		host: appIp || 'localhost',
		port: 8090,
	},
  proxy: [
    {
			forMock: true,
      target: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
      prefix: '/ajax-api',
			rewrite: {
				need: useLocal,  // rewrite `prefix` to `target`; maybe due to `useLocal`
				local: true // use local express to replace `target`
			}
    },
    // {
    // 	forMock: true,
    //   target: 'https://another/path',
    //   prefix: '/ajax-api/special',
    // 	rewrite: {
    // 		need: useLocal,
    // 		local: true
    // 	}
    // },
    // {
    //   forMock: true,
    //   target: 'http://foo/bar',
    //   prefix: '/xapi2',
    //   rewrite: {
    //     need: useLocal,
    //     local: true
    //   }
    // },
    // ... other non-local proxies (forMock = false)
  ],
  useLocal
};
