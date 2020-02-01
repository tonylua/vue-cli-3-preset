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
