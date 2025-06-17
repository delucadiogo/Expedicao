# Dockerfile para o serviço de frontend (React/TypeScript com Nginx)

# --- Estágio de Build ---
# Usa uma imagem base do Node.js (versão 18, otimizada para ser pequena) para o estágio de build.
# Este estágio é responsável por instalar dependências e construir a aplicação React.
FROM node:18-alpine AS builder

# Define o diretório de trabalho dentro do contêiner.
WORKDIR /app

# Copia os arquivos de configuração de pacotes (package.json e package-lock.json/yarn.lock).
COPY package*.json ./

# Instala as dependências do Node.js.
RUN npm ci --only=production

# Copia todo o código-fonte do frontend para o contêiner.
COPY . .

# Constrói a aplicação React para produção.
# Este comando deve gerar os arquivos estáticos na pasta 'dist' (ou 'build', 'out').
RUN npm run build

# Verifica se a pasta dist foi criada
RUN ls -la && echo "Conteúdo da pasta dist:" && ls -la dist/

# --- Estágio de Produção ---
# Inicia um novo estágio usando uma imagem leve do Nginx para servir os arquivos estáticos.
FROM nginx:alpine

# Remove a configuração padrão do Nginx para evitar conflitos.
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração personalizada do Nginx para o local padrão.
# Você precisará criar o arquivo 'nginx.conf' na raiz do seu diretório frontend.
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos da aplicação construída do estágio de build para o diretório de serviço do Nginx.
# Ajuste '/app/dist' para a pasta real onde seu frontend é compilado (ex: /app/build, /app/out).
COPY --from=builder /app/dist /usr/share/nginx/html

# Verifica se os arquivos foram copiados corretamente
RUN ls -la /usr/share/nginx/html/

# Expõe a porta padrão do Nginx (80) para acesso externo.
EXPOSE 80

# Define o comando padrão para iniciar o Nginx quando o contêiner for executado.
CMD ["nginx", "-g", "daemon off;"] 