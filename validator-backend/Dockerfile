# Use uma imagem Node.js como base
FROM node:20.16.0-alpine

# Define o diretório de trabalho na imagem
WORKDIR /app

COPY package*.json ./

RUN npm install

# Copie o restante do código
COPY . .

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta que o NestJS usará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:dev"]