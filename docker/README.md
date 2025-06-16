# Docker para BreachHawk-frontend

Esta pasta contém os arquivos necessários para criar e rodar a aplicação Next.js em containers Docker.

## Estrutura
- `Dockerfile`: Define o build e execução da aplicação.
- `.dockerignore`: Lista de arquivos e pastas ignorados durante o build da imagem (uma cópia também foi adicionada na raiz do projeto).

## Arquivos de configuração
- O arquivo `.dockerignore` foi colocado na raiz do projeto para garantir que o Docker ignore corretamente as pastas como `node_modules` durante o build.
- O `Dockerfile` está na pasta `docker` para melhor organização do projeto.

## Como usar

### Opção 1: Build a partir da pasta raiz (recomendado)
1. Acesse a raiz do projeto e execute o build apontando para o Dockerfile na pasta docker:
   \`\`\`sh
   docker build -f docker/Dockerfile -t breachhawk-frontend .
   \`\`\`

### Opção 2: Build a partir da pasta docker
1. Acesse a pasta docker:
   \`\`\`sh
   cd docker
   \`\`\`
2. Construa a imagem Docker (note o uso do contexto "../" para acessar os arquivos da raiz):
   \`\`\`sh
   docker build -f Dockerfile -t breachhawk-frontend ..
   \`\`\`

### Executando o container
\`\`\`sh
docker run -p 3000:3000 breachhawk-frontend
\`\`\`

A aplicação estará disponível em http://localhost:3000.

> Nota: Este setup pressupõe que o package.json e pnpm-lock.yaml estão na raiz do projeto, pois o Dockerfile acessa esses arquivos a partir do contexto de build.
