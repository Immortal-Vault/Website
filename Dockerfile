FROM node:18 AS build

WORKDIR /app

COPY package.json yarn.lock ./

RUN yarn install

COPY . .

RUN node generate-sitemap.js

RUN yarn build

FROM node:18-alpine

RUN yarn global add serve

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY env.sh /docker-entrypoint.d/env.sh

RUN chmod +x /docker-entrypoint.d/env.sh

EXPOSE 3000

CMD ["/bin/sh", "-c", "/docker-entrypoint.d/env.sh && serve -s dist"]