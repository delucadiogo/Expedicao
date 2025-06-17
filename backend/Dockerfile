# Dockerfile para o serviço de backend (Node.js/TypeScript)

# --- Estágio de Build ---
# Usa uma imagem base do Node.js (versão 18, otimizada para ser pequena) para o estágio de build.
# Este estágio é responsável por instalar dependências e compilar o código TypeScript.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de configuração de pacotes (package.json e package-lock.json/yarn.lock).
# Isso permite que o Docker utilize o cache de camadas se as dependências não mudarem.
COPY package*.json ./

# Instala as dependências do Node.js.
RUN npm ci

# Copia todo o código-fonte do backend para o contêiner.
COPY . .

# Compila o código TypeScript para JavaScript.
# Certifique-se de que este comando corresponda ao seu script de build no package.json do backend.
# Geralmente é 'npm run build' ou 'npx tsc'.
RUN npm run build

# Verifica se a pasta dist foi criada
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# --- Estágio de Produção ---
# Inicia um novo estágio com uma imagem base limpa e menor para a execução da aplicação em produção.
# Isso reduz o tamanho final da imagem Docker, removendo ferramentas de desenvolvimento e arquivos desnecessários.
FROM node:18-alpine

# Define o diretório de trabalho dentro do contêiner de produção.
WORKDIR /app

# Copia apenas os artefatos essenciais do estágio de build para o estágio de produção.
# Isso inclui as dependências instaladas e o código JavaScript compilado.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist # Ajuste 'dist' se sua pasta de saída compilada for diferente
COPY --from=builder /app/package*.json ./

# Verifica se os arquivos foram copiados corretamente
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# Define a variável de ambiente NODE_ENV para 'production'.
# Isso pode otimizar o comportamento de algumas bibliotecas Node.js.
ENV NODE_ENV=production

# Expõe a porta que sua aplicação Node.js escuta.
# Certifique-se de que esta porta corresponde à porta configurada no seu código backend (ex: 3001).
EXPOSE 3001

# Define o comando padrão para iniciar a aplicação quando o contêiner for executado.
# Ajuste 'dist/app.js' para o caminho real do seu arquivo JavaScript compilado principal.
CMD ["node", "dist/app.js"] 