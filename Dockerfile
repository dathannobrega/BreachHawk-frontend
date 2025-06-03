# =========================
# Etapa 1: Build com Node
# =========================
FROM node:18-alpine AS builder

# Define diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./

# Instala dependências
RUN npm ci

# Copia todo o código-fonte
COPY . .

# Gera o build de produção do Vite
# O diretório de saída padrão do Vite é "dist"
RUN npm run build


# ==============================
# Etapa 2: Servir com Nginx
# ==============================
FROM nginx:stable-alpine

# Copia o build gerado do frontend para a pasta padrão do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copia o arquivo nginx.conf customizado para sobrescrever o default
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
