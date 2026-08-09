# Configurando o Firebase (necessário para o modo Online)

Forca, Jogo da Velha e Batalha Naval agora têm um modo **Online**, onde uma
pessoa joga contra a outra em aparelhos diferentes e as jogadas aparecem na
hora para o adversário. Como o site é hospedado no GitHub Pages (só arquivos
estáticos, sem servidor), precisamos de um lugar externo para guardar o
estado das partidas em tempo real. Usamos o **Firebase Realtime Database**,
do Google, que tem plano gratuito sem precisar de cartão de crédito.

Essa parte só você consegue fazer, porque exige criar uma conta/projeto —
seguem os passos:

## 1. Criar o projeto

1. Acesse **https://console.firebase.google.com/** e faça login com uma
   conta Google.
2. Clique em **"Adicionar projeto"** (ou "Criar projeto").
3. Dê um nome, por exemplo `jogos-familia`. Pode desligar o Google Analytics
   (não precisamos dele) para simplificar.
4. Aguarde a criação do projeto.

## 2. Criar o Realtime Database

1. No menu à esquerda, vá em **Build → Realtime Database**.
2. Clique em **"Criar banco de dados"**.
3. Escolha a localização (qualquer uma serve, ex: `us-central1`).
4. Em "Regras de segurança", escolha **"Iniciar no modo de teste"** por
   enquanto (vamos trocar a regra em seguida).
5. Depois de criado, vá na aba **"Regras"** desse banco e substitua o
   conteúdo por isto:

   ```json
   {
     "rules": {
       "salas": {
         ".read": "auth != null",
         ".write": "auth != null"
       },
       "convites": {
         ".read": "auth != null",
         ".write": "auth != null"
       }
     }
   }
   ```

   Isso permite leitura/escrita só para quem estiver autenticado (mesmo que
   anonimamente — veja o próximo passo), o que já impede acesso aleatório de
   fora. Clique em **"Publicar"**.

## 3. Ativar autenticação anônima

O site usa autenticação anônima do Firebase só para satisfazer a regra
acima (não tem relação com o login por nome que já existe no site).

1. No menu à esquerda, vá em **Build → Authentication**.
2. Clique em **"Vamos começar"** (Get started).
3. Na aba **"Sign-in method"**, ative o provedor **"Anônimo"**.

## 4. Pegar as chaves de configuração

1. Clique no ícone de engrenagem (⚙️) ao lado de "Project Overview" →
   **"Configurações do projeto"**.
2. Role até **"Seus apps"** e clique no ícone **`</>`** (Web) para criar um
   app da Web.
3. Dê um apelido, ex: `site-familia`, e clique em **"Registrar app"**
   (não precisa do Firebase Hosting).
4. Ele vai mostrar um bloco `firebaseConfig` parecido com este:

   ```js
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "jogos-familia-xxxxx.firebaseapp.com",
     databaseURL: "https://jogos-familia-xxxxx-default-rtdb.firebaseio.com",
     projectId: "jogos-familia-xxxxx",
     storageBucket: "jogos-familia-xxxxx.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef123456"
   };
   ```

5. Copie esse bloco inteiro e cole no arquivo
   [`js/firebase-config.js`](js/firebase-config.js) deste projeto, no lugar
   do `firebaseConfig` de exemplo que já está lá.

## 5. Pronto

Depois de salvar `js/firebase-config.js` com as suas chaves reais, é só
publicar o site (ou testar localmente) — o modo Online já vai funcionar.

**Sobre segurança**: essas chaves (`apiKey` etc.) não são secretas — elas
identificam o projeto, não dão acesso livre a nada, o acesso real é
controlado pelas regras do passo 2. Mesmo assim, como não existe validação
de identidade real por trás dos nomes de usuário (é o mesmo esquema simples
do login), tecnicamente alguém que abrisse o console do navegador poderia
inspecionar dados de uma partida em andamento (ex: ver onde o adversário
colocou os navios na Batalha Naval). Para o uso entre família/amigos isso é
um risco aceitável, mas vale saber que não é uma segurança "à prova de
hackers".
