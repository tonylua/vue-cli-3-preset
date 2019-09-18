FROM node:10-alpine

RUN mkdir /usr/src && \
  mkdir /usr/src/myproject && \
  mkdir /usr/src/myproject/config && \
  cd /usr/src/myproject

WORKDIR /usr/src/myproject

COPY ./package.json ./
COPY ./config/config.js ./config/ 
COPY ./dist/ ./

RUN npm install --only=prod --registry=https://registry.npm.taobao.org \
 --ignore-scripts --silent --no-audit --no-progress && \
 npm cache clear --force --silent

COPY . .

EXPOSE 8081
CMD [ "node", "/usr/src/myproject/dist/server.js" ]
