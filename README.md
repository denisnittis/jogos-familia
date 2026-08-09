# Jogos da Família

Site simples com login e alguns joguinhos: Forca, Jogo da Velha, Batalha
Naval e Stop.

O **Show do Milhão** existe (`milhao.html`) mas está **oculto do menu** —
não aparece em `home.html`, embora a página continue funcionando se alguém
acessar `milhao.html` diretamente pela URL. Isso é proposital: vai ser
tratado separadamente depois.

Forca, Jogo da Velha e Batalha Naval têm modo **Online (1 x 1)**: uma pessoa
convida outra (dentre os 9 nomes cadastrados) e jogam em tempo real, cada
um no seu aparelho. O Stop é diferente: é sempre em grupo (2 ou mais
jogadores) — alguém cria uma sala, os outros entram por uma lista de "salas
abertas", e joga-se com uma letra sorteada e um cronômetro de 2 minutos
compartilhado entre todos.

Tudo isso depende do Firebase estar configurado — veja
[`FIREBASE_SETUP.md`](FIREBASE_SETUP.md) para o passo a passo. Sem essa
configuração, o site funciona normalmente nos modos sem internet
compartilhada (Sozinho / 2 Jogadores / Contra o Computador); só o botão
"Online" de cada jogo e o Stop (que é 100% online) é que não vão funcionar.

## Como funciona o login

Este é um site **estático** (HTML/CSS/JS puro), sem servidor nem banco de dados.
Por isso o "login" é só uma portinha simples para a família — as senhas ficam
escritas no arquivo [`js/auth.js`](js/auth.js) e qualquer pessoa que abrir o
código-fonte do site consegue vê-las. Não use isso para guardar informação
sensível de verdade.

Usuários e senhas padrão (nome + 2026):

| Nome     | Senha        |
|----------|--------------|
| Daniel   | Daniel2026   |
| Debora   | Debora2026   |
| Denis    | Denis2026    |
| Diego    | Diego2026    |
| Danielle | Danielle2026 |
| Denise   | Denise2026   |
| Giovanna | Giovanna2026 |
| Murilo   | Murilo2026   |
| Fabiola  | Fabiola2026  |

Para trocar uma senha, edite o objeto `USERS` em `js/auth.js`.

## Como testar localmente

Basta abrir o arquivo `index.html` no navegador (duplo clique já funciona),
ou rodar um servidor local simples, por exemplo:

```bash
python3 -m http.server 8000
```

e acessar `http://localhost:8000`.

## Como publicar no GitHub Pages

1. Crie um repositório novo no GitHub (pode ser público ou privado — se for
   privado, o GitHub Pages exige plano pago para publicar; se a ideia é só a
   família acessar, um repositório público com essas senhas simples já é
   suficiente).
2. Dentro desta pasta (`site-familia`), rode:
   ```bash
   git init
   git add .
   git commit -m "Site inicial dos jogos da família"
   git branch -M main
   git remote add origin git@github.com:SEU_USUARIO/NOME_DO_REPO.git
   git push -u origin main
   ```
3. No GitHub, vá em **Settings → Pages**, escolha a branch `main` e a pasta
   `/ (root)`, e salve.
4. Em alguns minutos o site fica disponível em
   `https://SEU_USUARIO.github.io/NOME_DO_REPO/`.

## Estrutura

```
index.html            → tela de login
home.html              → menu principal (depois de logado)
forca.html              → jogo da forca (sozinho ou online 1x1)
velha.html              → jogo da velha (2 jogadores, vs computador ou online 1x1)
milhao.html             → show do milhão (perguntas e respostas)
batalha.html            → batalha naval (vs computador ou online 1x1)
stop.html               → stop / adedonha (sala em grupo, 2+ jogadores)
css/style.css           → estilos de todas as páginas
js/auth.js              → lógica de login/logout e lista de usuários
js/firebase-config.js   → chaves do SEU projeto Firebase (ver FIREBASE_SETUP.md)
js/firebase-init.js     → inicialização do Firebase e login anônimo
js/online.js            → funções genéricas de sala usadas por todos os jogos online
js/forca.js             → lógica do jogo da forca
js/velha.js             → lógica do jogo da velha
js/milhao.js            → perguntas e lógica do show do milhão
js/batalha.js           → lógica da batalha naval
js/stop.js              → lógica do stop (categorias, cronômetro, pontuação)
```

Para adicionar um novo joguinho depois, crie um novo `.html` seguindo o
mesmo padrão dos outros (com o bloco de verificação de login no `<head>`) e
adicione um card novo em `home.html`.
