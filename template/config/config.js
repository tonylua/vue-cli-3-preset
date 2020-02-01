const original = process.env.npm_config_argv
  ? JSON.parse(process.env.npm_config_argv).original
  : '';
const useLocal = !!~original.indexOf('--local')
  || !!~process.argv.indexOf('--local');
const appIp = process.env.npm_config_ip;
const apiEndpoint = process.env.npm_config_endpoint;

const appConfig = {
  host: appIp || 'localhost',
  port: 8080,
};

const mockConfig = {
  host: appIp || 'localhost',
  port: 8090,
};

let proxyMap = [
  {
    // need manual sync in `/src/utils/fetchWrapper/middlewares/headers.js`
    prefixs: ['/ajax-api'],
    target: apiEndpoint || 'https://www.mocky.io/v2/5185415ba171ea3a00704eed'
  },
  // ...more proxies
];
if (useLocal) {
  proxyMap = proxyMap.map(p => ({
    prefixs: p.prefixs,
    target: `http://${mockConfig.host}:${mockConfig.port}`
  }));
}

module.exports = {
  app: appConfig,
  mock: mockConfig,
  proxy: proxyMap.reduce((result, map) => {
    const { target, prefixs } = map;
    for (let i = 0; i < prefixs.length; i++) {
      result.push({
        forMock: true,
        target,
        prefix: prefixs[i],
        rewrite: {
          need: useLocal,
          local: true
        }
      });
    }
    return result;
  }, []),
  useLocal,
  appIp,
  proxyMap
};
