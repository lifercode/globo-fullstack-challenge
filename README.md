<br />
<p align="center">
  <img src="https://github.com/lifercode/static/blob/main/globo/logo-globo.png" alt="Logo">

  <h3 align="center">Globo Challenge Fullstack</h3>
</p>


## Sobre o Projeto

Este projeto visa solucionar um desafio proposto durante o processo seletivo de uma vaga para dev fullstack na Globo.

## Desafio

"Um diretor de TV precisa exibir em um telão, os tweets que chegam contendo uma determinada hashtag que varia diariamente. Foi pedido que esses tweets fossem inseridos no telão por um controle (sistema web) que seria comandado pelo time de operações do estúdio, neste caso, o mesmo deveria aprovar os tweets que estão chegando para que seja exibido no telão em tempo real."

## Principais tecnologias

- React
- Node.js
- MongoDB
- Socket.IO

## Estrutura

Foi construido um servidor (Node.js) para consumir os dados na API do Twitter, armazenar no banco de dados (MongoDB) e servir para o client web (React) em tempo real (Socket.IO).

Escolhi utilizar uma estrutura de monorepo (Yarn Workspaces) com o objetivo de facilitar a apresentação e execução do projeto.

## Instalação

Antes de inciar é preciso configurar as váriaveis de ambiente necessárias para rodar o projeto.

### 1. Crie os arquivos .env com as seguintes chaves


**/server/.env**
```
PORT=

DB_CLUSTER=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=

CLIENT_URL=

TWITTER_API_URL=
TWITTER_API_TOKEN=
```

**/client/.env**
```
REACT_APP_API_URL=
```

### 2. Instale as dependencias e rode o projeto

Rode os seguintes comandos na raiz do projeto:

`yarn install` && `yarn start`

Em seguida abra o navegador e acesse [http://localhost:3000](http://localhost:3000)

## Como Usar?

O projeto consiste em três telas, sendo apenas duas (Tweets & Telão) essenciais para o funcionamento do fluxo completo.

`/tweets`
Onde você vai escolher uma hashtag, buscar os tweets mais recentes e definir quais você quer exibir no telão. Os novos tweets são carregados em tempo real, para atualizar a lista basta clicar no botão do Twitter.

`/telao`
Onde os tweets escolhidos são exibidos em tempo real.

`/preview`
Onde você consegue visualizar e testar todo o fluxo em apenas uma tela.

#### Home

![Create React Native Component](https://github.com/lifercode/static/blob/main/globo/home.png)

#### Tweets & Telão

![Create React Native Component](https://github.com/lifercode/static/blob/main/globo/tweets-telao-screen.gif)

#### Preview

![Create React Native Component](https://github.com/lifercode/static/blob/main/globo/preview-screen.gif)


## Contato

lifercode - [Github](https://github.com/lifercode) - **lifercode@gmail.com**