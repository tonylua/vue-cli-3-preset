const { original } = JSON.parse(process.env.npm_config_argv);
const useLocal = ~original.indexOf('--local');

module.exports = {
	app: {
		host: 'localhost', // or 'local.xxx.com' for 127.0.0.1 in your hosts,
		port: 8080,
	},
	mock: {
		host: 'localhost',
		port: 8090,
	},
  proxy: [
    {
			forMock: true,
      target: 'https://www.mocky.io/v2/5185415ba171ea3a00704eed',
      prefix: '/ajax-api',
			rewrite: {
				need: false,  // rewrite `prefix` to `target`; maybe due to `useLocal`
				local: true // use local express to replace `target`
			}
    },
    // ... other proxies (forMock = false)
  ],
  useLocal
};
