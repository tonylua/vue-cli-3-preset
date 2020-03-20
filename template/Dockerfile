# stage 0
FROM node:10-alpine as build-stage
WORKDIR /app
COPY package*.json ./
ENV SASS_BINARY_SITE https://npm.taobao.org/mirrors/node-sass/
RUN npm install --registry=https://registry.npm.taobao.org
COPY . .
ARG ENDPOINT='http://api.com:30590'
RUN npm run build-prod --silent --endpoint=$ENDPOINT

# stage 1 (nginx)
FROM nginx:1.17-alpine
COPY config/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 8081
# CMD ["nginx", "-g", "daemon off;"]
