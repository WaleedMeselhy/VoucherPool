FROM node:17-slim AS development

RUN apt-get update
RUN apt-get install -y openssl
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn 
COPY . .
RUN yarn prisma:generate
RUN yarn build

FROM node:17-slim as production
RUN apt-get update
RUN apt-get install -y openssl
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package.json yarn.lock ./
RUN yarn
COPY . .
COPY --from=development /usr/src/app/dist ./dist
RUN yarn prisma:generate

CMD ["yarn", "start:prod"]
