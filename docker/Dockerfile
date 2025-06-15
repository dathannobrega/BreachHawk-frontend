# Dockerfile para aplicação Next.js
# Estágio de dependências: Instala apenas as dependências
FROM node:20-alpine AS deps
WORKDIR /app

# Copia arquivos de dependências
COPY package.json ./

# Instala pnpm e dependências
RUN npm install

# Estágio de build: Utiliza as dependências instaladas e copia o restante do código
FROM node:20-alpine AS builder
WORKDIR /app

# Copia node_modules e arquivos do projeto
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# As ARGs podem ser fornecidas no momento do build
ARG NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}

# Executa o build do Next.js diretamente
RUN npx next build

# Estágio de produção: utiliza apenas os artefatos necessários
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# As ENVs podem ser sobrescritas no momento da execução
ENV NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL:-https://dev.protexion.cloud}

# Copia apenas os arquivos necessários para produção
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

# Comando para iniciar o Next.js em produção
CMD ["npx", "next", "start"]
