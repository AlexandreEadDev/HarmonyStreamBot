# Utilise la version légère d'Alpine comme dans ton exemple
FROM node:22-alpine

# Installation des dépendances système critiques :
# - ffmpeg : Obligatoire pour lire la musique
# - python3, make, g++ : Nécessaires pour compiler certains modules natifs (comme la gestion audio)
RUN apk add --no-cache ffmpeg python3 make g++

WORKDIR /app

# Copie uniquement les fichiers de dépendances d'abord (pour le cache Docker)
COPY package.json yarn.lock ./

# Installation des paquets (frozen-lockfile assure d'installer exactement les versions du yarn.lock)
RUN yarn install --frozen-lockfile --production
RUN sed -i 's/noCallHome: true,//g' node_modules/@distube/yt-dlp/dist/index.js
# Copie du reste du code du bot
COPY . .

# Commande de démarrage
CMD ["yarn", "start"]