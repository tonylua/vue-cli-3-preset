# preset for vue cli 4

## NPM Commands

### Project setup
```
npm install
```

### Compiles and minifies for production
```
npm run build
```

### Compiles and open bundle size report
```
npm run build --report
```

### Run your unit tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Run your unit tests
```
npm run test
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and hot-reloads for development, use local IP instead of localhost
```
npm run serve --ip=xxx.xxx.xxx.xxx
```

<!--LOCAL_EXPRESS?-->

<!--STORYBOOK?-->

### Docker 

- Edit `listen` and `server_name` in `/config/nginx.conf`
- `docker build --build-arg ENDPOINT='API_PROTOCAL://API_HOST:API_PORT' -t IMAGE_NAME .`
- `docker run -p 48081:8081 -d IMAGE_NAME`

#### Local test with docker container & mock

```
# /etc/hosts
127.0.0.1 api.appcloud.com

# start mock server
node api/mock.server.js --mockorigin=http://localhost:48081 --mockport=3456

# build image with args
docker build --build-arg ENDPOINT='http://api.appcloud.com:3456' -t jds-webconsole-local .

# run container
docker run -p 48081:8081 -d jds-webconsole-local

# visit in browser
http://localhost:48081/
```
