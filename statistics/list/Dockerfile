FROM node:19.9.0-bullseye

WORKDIR /usr/src/app

#Copiamos los archivos de la carpeta actual hacia docker
COPY . .

#Instalamos las dependencias
RUN npm install -g npm
RUN npm install

# Expone el puerto en el que se ejecutará la aplicación
EXPOSE 3002

#Ejecutamos nuestra app en docker
ENTRYPOINT [ "npm", "start" ]