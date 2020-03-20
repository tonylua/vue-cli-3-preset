## NPM Commands

```
### Project setup
npm install
### Compiles and minifies for production
npm run build
### Compiles and open bundle size report
npm run build --report
### Run your unit tests
npm run test
### Lints and fixes files
npm run lint
### Run your unit tests
npm run test
### Compiles and hot-reloads for development
npm run serve
### Compiles and hot-reloads for development, use local IP instead of localhost
npm run serve --ip=xxx.xxx.xxx.xxx
```

<!--LOCAL_EXPRESS?-->

<!--STORYBOOK?-->

## Docker 

build:

- (optional) Edit `listen` property in `/config/nginx.conf` if you want to change the `8081` port
- `docker build -t <IMAGE_NAME> .`

run:

- Modify '/config/nginx.conf' or use a custom file to configure nginx reverse proxy, gzip, etc
- `docker run -p 48081:8081 -v <NGINX_CONF_FILE>:/etc/nginx/conf.d/default.conf:ro -d <IMAGE_NAME>`

local debug with container & mock

- Config `/etc/hosts`, add `127.0.0.1 api.app.com`
- `node api/mock.server.js --mockorigin=http://localhost:48081 --mockport=5678`
- Look at the local IP corresponding to localhost, such as 192.168.1.106
- `node api/mock.server.js --mockorigin=http://localhost:48081 --mockport=5678 --mockhost=192.168.1.106`
- Modify the `location /api` part in `/config/nginx.conf` to `proxy_pass http://192.168.1.106:5678;`
- `docker run -p 48081:8081 -v <NGINX_CONF_FILE>:/etc/nginx/conf.d/default.conf:ro -d <IMAGE_NAME>`
- visit `http://localhost:48081/` in browser
