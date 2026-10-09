FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
ARG PUBLIC_API_TS_URL
ARG PUBLIC_API_NET_URL
ENV PUBLIC_API_TS_URL=$PUBLIC_API_TS_URL PUBLIC_API_NET_URL=$PUBLIC_API_NET_URL
RUN npm run build
FROM nginx:1.29-alpine
COPY --from=build /app/dist /usr/share/nginx/html
