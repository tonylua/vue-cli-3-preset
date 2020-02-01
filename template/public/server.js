const fs = require('fs');
const qs = require('qs');
const path = require('path');
const request = require('request');
const express = require('express');
const bodyParser = require('body-parser');
const config = require('../config/config');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line

// 映射命令行参数
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

const SERVER_PORT = argsMap.ip || '8081';
const SERVER_HOST = argsMap.host || '0.0.0.0';
const HOME_PAGE = 'index.html';

const app = new express;
app.set('view engine', 'html');
app.set('views', __dirname + '/');
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static('/', { index: HOME_PAGE }));

const { proxy } = config;
const proxiesNames = proxy.map(p => p.prefix);
const proxiesReStr = proxiesNames.join('|').replace(/\//g, '\\/');

// 重定向非ajax资源
const staticRe = new RegExp(`^(?!(${proxiesReStr}))`);
app.use(staticRe, (req, res) => {
  let filePath = path.resolve(__dirname, req.url.replace(/^\/+/, ''));
  if (req.url.length < 2 || !fs.existsSync(filePath)) {
    filePath = path.join(__dirname, HOME_PAGE);
  }
  console.log('[static]', req.url, filePath);
  res.sendFile(filePath);
});

// 转发ajax资源
const ajaxRe = new RegExp(`^(${proxiesReStr})`);
app.use(ajaxRe, (req, res) => {
  let url = req.originalUrl;
  let target = '';
  for (let i = 0; i < proxy.length; i++) {
    const p = proxy[i];
    if (url.substr(0, p.prefix.length) === p.prefix
      && p.target.length > target.length) { // '/api/v1' 优于 '/api'
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
});

app.listen(SERVER_PORT, SERVER_HOST, () => {
  console.log(`\n\n server running at: http://${SERVER_HOST}:${SERVER_PORT} \n\n`);
});
