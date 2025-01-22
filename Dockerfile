# Folosește o imagine Node.js
FROM node:16

# Setează directorul de lucru
WORKDIR /app

# Copiază fișierele de configurare și codul în container
COPY package*.json ./

# Instalează dependențele
RUN npm install

# Copiază tot codul în container
COPY . .

# Expune portul utilizat de aplicație
EXPOSE 3000

# Rulează aplicația
CMD ["npm", "start"]
