const express = require('express');
const qs = require('qs');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const walk = require('klaw-sync');
const _ = require('lodash');
const config = require('../config/config');

const argRe = /^\-{1,2}([a-z]+?)=(.*)$/;
const argsMap = process.argv.splice(2).reduce(
  (map, argStr) => {
    if (argRe.test(argStr)) {
      const [_, key, value] = argStr.match(argRe);
      map[key] = value;
    }
    return map;
  },
  Object.create(null)
);

const {
  mock,
  proxy
} = config;

// console.log(proxy);

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line

const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', argsMap.mockorigin || '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, hci-secret-key, x-api-key');
  res.header('Access-Control-Allow-Methods', 'POST, OPTIONS, GET');
  res.header('Access-Control-Allow-Credentials', true);
  next();
});

let _existRoutes = [];
const isSavedURLMatch = (p) => {
  if (~_existRoutes.indexOf(p)) return true;
  return _existRoutes.some(r => { // look up for route like "/foo/:id"
    if (!~r.indexOf(':')) return false;
    const str = r.replace(/:.+?($|\/)/g, '.*?$1')
      .replace(/(\/{1})/g, '\\$1');
    const re = new RegExp(`^${str}$`);
    return re.test(p);
  });
};
app.use((req, res, next) => {
  if (!isSavedURLMatch(req.path)) {
    let url = req.originalUrl;
    let target = '';
    for (let i = 0; i < proxy.length; i++) {
      const p = proxy[i];
      if (url.substr(0, p.prefix.length) === p.prefix
        && p.target.length > target.length) { // '/api/v1' rather than '/api'
          target = p.target;
        }
    }
    target = target.replace(/\/+$/, '');
    url = url.replace(/^\/+/, '');
    const rUrl = `${target}/${url}`;
    const rOptions = {
      url: rUrl,
      method: req.method,
			headers: _.omit(req.headers, [
				'host'
			]),
			jar: true
    };
    console.log('[redirect]', req.method, target, url, req.body);

    if (/GET|HEAD|DELETE/i.test(req.method)) {
      req.pipe(request(rOptions)).pipe(res);
      next();
      return;
    }

    const bodyKey = ~req.headers['content-type'].indexOf('application/json')
      ? 'json'
      : 'form';
    if (req.body && req.headers['content-length'] > 0) {
      rOptions[bodyKey] = req.body;
    } else {
      const fakeBody = { '__timestamp1' : Date.now() };
      rOptions[bodyKey] = fakeBody;
      rOptions.headers['content-length'] = qs.stringify(fakeBody).length;
    }
    req.pipe(request(rOptions), { end: false }).pipe(res);
  }
  next();
});

walk(__dirname)
  .filter(p => /\.api\.js$/.test(p.path))
  .map(p => p.path)
  .forEach(part => require(part)(app));

_existRoutes = app._router.stack.filter(s => s.route).map(s => s.route.path);
console.log(_existRoutes.sort());

const { mockport, mockhost } = argsMap;
const p1 = mockport || mock.port;
const h1 = mockhost || mock.host;
app.listen(p1, h1, () => {
  console.log(`\n\n Local server running at: http://${h1}:${p1} \n\n`);
});
