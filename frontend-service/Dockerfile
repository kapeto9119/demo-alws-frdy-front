# Usa una imagen base de Node.js
FROM node:16-alpine

# Establecer directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos package.json y package-lock.json
COPY package*.json ./

# Instalar las dependencias
RUN npm install

# Copiar el resto del código de la aplicación
COPY . .

# Construir la aplicación para producción
RUN npm run build

# Exponer el puerto en el que la app se ejecutará
EXPOSE 3000

# Comando para iniciar la app
CMD ["npm", "start"]