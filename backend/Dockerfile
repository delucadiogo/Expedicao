# Dockerfile para o serviço de backend (Node.js/TypeScript)

# --- Estágio de Build ---
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de configuração de pacotes
COPY package*.json ./

# Instala as dependências do Node.js.
RUN npm ci

# Copia todo o código-fonte do backend para o contêiner.
COPY . .

# Compila o código TypeScript para JavaScript.
RUN npm run build

# Verifica se a pasta dist foi criada
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# --- Estágio de Produção ---
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner de produção.
WORKDIR /app

# Copia apenas os artefatos essenciais do estágio de build
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./

# Verifica se os arquivos foram copiados corretamente
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# Define a variável de ambiente NODE_ENV para 'production'.
ENV NODE_ENV=production

# Expõe a porta que sua aplicação Node.js escuta.
EXPOSE 3001

# Define o comando padrão para iniciar a aplicação
CMD ["node", "dist/app.js"] 