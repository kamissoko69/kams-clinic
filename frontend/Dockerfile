# Étape 1 : Build de l'application React
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
# Correction des permissions d'exécution sur le dossier .bin
RUN chmod -R +x node_modules/.bin
RUN npm run build

# Étape 2 : Serveur Nginx pour distribuer le build de prod
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 5173
CMD ["nginx", "-g", "daemon off;"]