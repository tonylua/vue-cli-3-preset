FROM node:10-alpine

# Create app directory
RUN mkdir /usr/src && \
  mkdir /usr/src/myproject && \
  mkdir /usr/src/myproject/config && \
  cd /usr/src/myproject

WORKDIR /usr/src/myproject

RUN npm install --only=prod --registry=https://registry.npm.taobao.org \
 --ignore-scripts --silent --no-audit --no-progress && \
 npm cache clear --force --silent
 npm run build && \

COPY ./package.json ./
COPY ./config/config.js ./config/ 
COPY ./dist/ ./

COPY . .

EXPOSE 8081
CMD [ "node", "/usr/src/myproject/dist/server.js" ]
