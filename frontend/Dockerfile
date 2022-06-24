FROM node:16 AS base
WORKDIR /usr/src/app
COPY --chown=node:node . .
RUN npm ci --only=production
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=base /usr/src/app/build /usr/share/nginx/html
