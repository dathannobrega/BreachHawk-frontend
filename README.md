# Deep Protexion

Aplicação de monitoramento de vazamentos de dados desenvolvida com React, Vite e TailwindCSS.

## Tecnologias

- React
- Vite
- TailwindCSS
- React Router DOM
- Chart.js
- Radix UI

## Requisitos

- Node.js 16+
- npm ou yarn

## Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/deep-protexion.git

# Entre na pasta do projeto
cd deep-protexion

# Instale as dependências
npm install
# ou
yarn

# Inicie o servidor de desenvolvimento
npm run dev
# ou
yarn dev
```

## Scripts

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Compila o projeto para produção
- `npm run preview` - Visualiza a versão de produção localmente
- `npm run lint` - Executa o linter

## Estrutura do Projeto

```
deep-protexion/
├── public/                  # Arquivos estáticos
├── src/                     # Código fonte
│   ├── components/          # Componentes reutilizáveis
│   │   ├── ui/              # Componentes de UI básicos
│   │   └── landing/         # Componentes da landing page
│   ├── context/             # Contextos React (AuthContext, etc.)
│   ├── hooks/               # Custom hooks
│   ├── layouts/             # Layouts da aplicação
│   ├── pages/               # Páginas da aplicação
│   │   └── user/            # Páginas específicas de usuário
│   ├── styles/              # Estilos CSS
│   ├── utils/               # Funções utilitárias
│   ├── App.jsx              # Componente principal com rotas
│   └── main.jsx             # Ponto de entrada
├── index.html               # HTML principal
├── vite.config.js           # Configuração do Vite
├── tailwind.config.js       # Configuração do TailwindCSS
├── postcss.config.js        # Configuração do PostCSS
└── package.json             # Dependências e scripts
```

## Licença

MIT
