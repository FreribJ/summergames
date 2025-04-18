FROM node:latest as build
WORKDIR /app
COPY ./ /app/
RUN npm install
RUN npm run build

FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/nginx.conf

COPY --from=build /app/dist/frontend /usr/share/nginx/html
EXPOSE 80
