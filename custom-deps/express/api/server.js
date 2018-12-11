const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
const walk = require('klaw-sync');

const epConfig = require('./config');
const origin_proxy_url = `${epConfig.proxy}`;
const local_proxy_url = `${epConfig.host}:${epConfig.localServerPort}`;

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

let _existRoutes = [];
app.use( (req, res, next)=>{ 
	const {url, body, method} = req;
	if (!~_existRoutes.indexOf(req.path)) {		
		const rurl = origin_proxy_url.replace(/\/$/, '') + url;
		let r = method === 'POST'
			? request.post({url: rurl, form: body})
			: request(rurl);
		console.log(`undefine req, jump to ${method} ${rurl}`);
		req.pipe(r).pipe(res);
		return;
	}
	next();
} );

walk(path.resolve('./'))
    .filter(p=>/\.api\.js$/.test(p.path))
    .map(p=>p.path)
    .forEach(part=>require(part)(app));

_existRoutes = app._router.stack.filter(s=>s.route).map(s=>s.route.path);

app.listen(epConfig.localServerPort, epConfig.host, ()=>{
  console.log(`\n\n Local server running at: http://${local_proxy_url} \n\n`);
});