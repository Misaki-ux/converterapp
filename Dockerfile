# Étape 1: Choisir l'image de base Nginx légère
FROM nginx:1.25-alpine-slim 

# Étape 2: Copier les fichiers de l'application web dans le répertoire par défaut de Nginx
# Le '.' signifie copier le contenu du répertoire courant (où se trouve le Dockerfile)
# dans le répertoire /usr/share/nginx/html du conteneur.
COPY . /usr/share/nginx/html

# Étape 3: Exposer le port sur lequel Nginx écoute par défaut
EXPOSE 80

# Étape 4: Commande pour démarrer Nginx (déjà définie dans l'image de base, pas besoin de la redéfinir ici)
# La commande par défaut est généralement: nginx -g 'daemon off;'
# CMD ["nginx", "-g", "daemon off;"]