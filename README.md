Guia de Instalação: Sistema de Controle de Investimentos

Este guia ajudará você a configurar e rodar o frontend React do projeto na sua máquina local.

1. Pré-requisitos

Certifique-se de ter o Node.js instalado (versão 18 ou superior).

2. Criar o Projeto

Abra o seu terminal e execute os seguintes comandos:

# Criar um novo projeto com Vite e React

npm create vite@latest InvestingFrontend -- --template react

# Entrar na pasta do projeto

cd InvestingFrontend

# Instalar as dependências base

npm install

3. Instalar Dependências do Projeto

Instale as bibliotecas de gráficos e a versão 3 do Tailwind CSS (para garantir compatibilidade com o ficheiro de configuração):

npm install recharts lucide-react
npm install -D tailwindcss@3 postcss autoprefixer

4. Configurar Tailwind (Criação Manual)

Como o comando npx tailwindcss init pode falhar em algumas máquinas, crie os dois arquivos abaixo na raiz do seu projeto (mesma pasta onde está o package.json):

Arquivo 1: tailwind.config.js

Crie este arquivo e cole:

/** @type {import('tailwindcss').Config} \*/
export default {
content: [
"./index.html",
"./src/**/\*.{js,ts,jsx,tsx}",
],
darkMode: 'class',
theme: {
extend: {
fontFamily: {
inter: ['Inter', 'sans-serif'],
},
},
},
plugins: [],
}

Arquivo 2: postcss.config.js

Crie este arquivo e cole:

export default {
plugins: {
tailwindcss: {},
autoprefixer: {},
},
}

5. Ajustar arquivos do Vite e CSS

src/index.css

Substitua todo o conteúdo por:

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
font-family: 'Inter', system-ui, Avenir, Helvetica, Arial, sans-serif;
}

src/App.jsx

Apague tudo no arquivo src/App.jsx e cole o código completo do dashboard (InvestmentDashboard.jsx) que geramos aqui no chat.

6. Configurar a API do Gemini (Opcional)

No arquivo src/App.jsx, localize a variável:
const apiKey = "";
Coloque sua chave gerada no Google AI Studio.

7. Rodar o Projeto

No terminal:

npm run dev

Abra o link exibido (ex: http://localhost:5173).

Solução de problemas (Erro de Executável)

Se o erro de "could not determine executable" persistir mesmo criando os arquivos manuais, limpe o cache do npm e tente instalar novamente:
npm cache clean --force
npm install
