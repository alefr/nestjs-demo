FROM node:12.13-alpine As build

RUN apk add --update --no-cache \
    python \
    make \
    g++

COPY ./package* /src/
WORKDIR /src

RUN npm ci

COPY . .

RUN npm run build
RUN npm prune --production

FROM node:12.13-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

EXPOSE 3000
WORKDIR /usr/src/service

COPY --from=build /src/node_modules node_modules
COPY --from=build /src/dist dist

USER node
ENTRYPOINT ["node", "./dist/main"]
