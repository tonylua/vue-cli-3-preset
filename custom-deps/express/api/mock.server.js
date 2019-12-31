const express = require('express');
const qs = require('qs');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const walk = require('klaw-sync');
const config = require('../config/config');

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
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, hci-secret-key, x-api-key');
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
      headers: req.headers
    };
    console.log('[redirect]', req.method, target, url, req.body, req.headers['content-length']);

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

walk(path.resolve('./'))
  .filter(p => /\.api\.js$/.test(p.path))
  .map(p => p.path)
  .forEach(part => require(part)(app));

_existRoutes = app._router.stack.filter(s => s.route).map(s => s.route.path);
console.log(_existRoutes.sort());

app.listen(mock.port, mock.host, () => {
  console.log(`\n\n Local server running at: http://${mock.host}:${mock.port} \n\n`);
});
