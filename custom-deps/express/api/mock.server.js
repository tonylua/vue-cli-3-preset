const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const walk = require('klaw-sync');
const config = require('../config/config');

const { mock, proxy } = config;

const originProxyURL = `${config.proxy.filter(p => p.forMock)[0].target}`;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0; // eslint-disable-line

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

let _existRoutes = [];
app.use((req, res, next) => { 
	if (!~_existRoutes.indexOf(req.path)) {		
		const rURL = originProxyURL.replace(/\/$/, '') + req.url;
    req.pipe(request(rURL)).pipe(res);
    console.log(`本地 mock 未定义的请求，跳转到 ${rURL}`, originProxyURL);
    return;
	}
	next();
});

walk(path.resolve('./'))
	.filter(p => /\.api\.js$/.test(p.path))
	.map(p => p.path)
	.forEach(part => require(part)(app));

_existRoutes = app._router.stack.filter(s=>s.route).map(s=>s.route.path);

app.listen(mock.port, mock.host, ()=>{
  console.log(`\n\n Local server running at: http://${mock.host}:${mock.port} \n\n`);
});
