# Use uma imagem Node.js como base
FROM node:20.16.0-alpine

# Define o diretório de trabalho na imagem
WORKDIR /app

# Copia o package.json e o package-lock.json para a imagem
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o restante dos arquivos da aplicação para a imagem
COPY . .

# Compila o TypeScript para JavaScript
RUN npm run build

# Define a variável de ambiente para produção
ENV NODE_ENV=production

# Expõe a porta que o NestJS usará
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["npm", "run", "start:prod"]
