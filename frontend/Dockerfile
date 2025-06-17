# Dockerfile para o serviço de frontend (React/TypeScript com Nginx)

# --- Estágio de Build ---
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala as dependências do Node.js.
RUN npm ci --only=production

# Copia todo o código-fonte do frontend para o contêiner.
COPY . .

# Constrói a aplicação React para produção.
RUN npm run build

# Verifica se a pasta dist foi criada
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# --- Estágio de Produção ---
FROM nginx:alpine

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos da aplicação construída
COPY --from=builder /app/dist /usr/share/nginx/html

# Verifica se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html/

# Expõe a porta padrão do Nginx
EXPOSE 80

# Define o comando padrão
CMD ["nginx", "-g", "daemon off;"] 