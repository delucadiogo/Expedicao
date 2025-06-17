# Dockerfile para o serviço de frontend (React/TypeScript com Nginx)

# --- Estágio de Build ---
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies para build)
RUN npm ci

# Copia todo o código-fonte do frontend para o contêiner.
COPY . .

# *** NOVO: Define a variável de ambiente VITE_API_URL para o build ***
# Isso garante que todas as chamadas de API no build final usem o caminho relativo /api
ENV VITE_API_URL=/api

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