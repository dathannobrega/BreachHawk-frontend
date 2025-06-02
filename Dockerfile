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
FROM nginx:alpine

# Remove o conteúdo padrão do Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copia o build gerado na etapa anterior para a pasta de servidos do Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# (Opcional) Se você quiser personalizar configurações do Nginx,
# crie um arquivo nginx.conf e copie aqui. Exemplo mínimo já serve sem precisar:
#
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando padrão: inicia o Nginx no foreground
CMD ["nginx", "-g", "daemon off;"]
