# Étape 1 : Build de l'application React
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN chmod -R +x node_modules/.bin
RUN npm run build

# Étape 2 : Service des fichiers statiques via Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]