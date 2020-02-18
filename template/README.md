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

- *STEP1(optional)* : Edit `listen` property in `/config/nginx.conf` if you want to change the `8081` port
- *STEP2* : Create a JSON format file containing the API endpoint, the content looks like this: `{"ENDPOINT": "http://api.app.com:5888"}`
- *STEP3* : `docker build -t <IMAGE_NAME> .`
- *STEP4* : `docker run -p 48081:8081 -v <STEP2_JSON_PATH>:/usr/share/nginx/html/endpoint.json:ro -d <IMAGE_NAME>`

#### Local test with docker container & mock

- *STEP1* : Config `/etc/hosts`, add `127.0.0.1 api.app.com`
- *STEP2* : Create a JSON format file containing the API endpoint, the content looks like this: `{"ENDPOINT": "http://api.app.com:5888"}`
- *STEP3* : `node api/mock.server.js --mockorigin=http://localhost:48081 --mockport=5678`
- *STEP4* : `docker build -t <IMAGE_NAME> .`
- *STEP5* : `docker run -p 48081:8081 -v <STEP2_JSON_PATH>:/usr/share/nginx/html/endpoint.json:ro -d <IMAGE_NAME>`
- *STEP6* : visit `http://localhost:48081/` in browser
