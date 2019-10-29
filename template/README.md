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

- `npm run build --silent && docker build -t <DOCKER_USERNAME>/myproject .`
- `docker run -p 48081:8081 -d <DOCKER_USERNAME>/myproject`
