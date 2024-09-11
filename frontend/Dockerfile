FROM node:latest as build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

FROM nginx:latest
COPY nginx-local.conf /etc/nginx/conf.d/local.conf
COPY nginx-ssl.conf /etc/nginx/conf.d/ssl.conf

COPY fullchain.pem /sslkeys/fullchain.pem
COPY privkey.pem /sslkeys/privkey.pem
COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 443
