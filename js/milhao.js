/* ========================================================================
   TEMAS
   ======================================================================== */

const TEMAS = [
  { id: "geografia", nome: "Geografia", emoji: "🌍" },
  { id: "historia", nome: "História", emoji: "📜" },
  {
    id: "esportes",
    nome: "Esportes",
    emoji: "⚽",
    subcategorias: [
      { id: "futebol-nacional", nome: "Futebol Nacional" },
      { id: "futebol-internacional", nome: "Futebol Internacional" },
      { id: "nba", nome: "NBA" },
      { id: "nfl", nome: "NFL" },
    ],
  },
  { id: "cinema-tv", nome: "Cinema e TV", emoji: "🎬" },
  { id: "musica", nome: "Música", emoji: "🎵" },
  { id: "ciencias", nome: "Ciências e Natureza", emoji: "🔬" },
];

/* ========================================================================
   BANCO DE PERGUNTAS
   Cada pergunta: { pergunta, opcoes: [4], certa: índice, nivel: 1 (fácil),
   2 (média) ou 3 (difícil) }. Cada categoria tem mais perguntas do que uma
   partida usa, pra sortear um conjunto diferente a cada vez.
   ======================================================================== */

const BANCO_PERGUNTAS = {
  geografia: [
    { pergunta: "Qual é o maior país do mundo em área territorial?", opcoes: ["Rússia", "Canadá", "China", "Brasil"], certa: 0, nivel: 1 },
    { pergunta: "Qual é a capital da França?", opcoes: ["Paris", "Londres", "Roma", "Madri"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o maior oceano do mundo?", opcoes: ["Atlântico", "Índico", "Pacífico", "Ártico"], certa: 2, nivel: 1 },
    { pergunta: "Em que continente fica o Egito?", opcoes: ["África", "Ásia", "Europa", "América"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o maior deserto quente do mundo?", opcoes: ["Saara", "Gobi", "Atacama", "Kalahari"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o país mais populoso do mundo atualmente?", opcoes: ["Índia", "China", "Estados Unidos", "Indonésia"], certa: 0, nivel: 1 },
    { pergunta: "Qual é a capital da Austrália?", opcoes: ["Camberra", "Sydney", "Melbourne", "Perth"], certa: 0, nivel: 2 },
    { pergunta: "Qual é o menor país do mundo?", opcoes: ["Vaticano", "Mônaco", "San Marino", "Liechtenstein"], certa: 0, nivel: 2 },
    { pergunta: "Em que país fica o Monte Everest?", opcoes: ["Nepal", "Índia", "China", "Butão"], certa: 0, nivel: 2 },
    { pergunta: "Qual é a montanha mais alta da América do Sul?", opcoes: ["Aconcágua", "Chimborazo", "Pico Bolívar", "Huascarán"], certa: 0, nivel: 2 },
    { pergunta: "Quantos países fazem fronteira com o Brasil?", opcoes: ["10", "8", "9", "11"], certa: 0, nivel: 2 },
    { pergunta: "Qual é a capital do Canadá?", opcoes: ["Ottawa", "Toronto", "Vancouver", "Montreal"], certa: 0, nivel: 2 },
    { pergunta: "Qual país tem a maior quantidade de fusos horários, por causa de seus territórios?", opcoes: ["França", "Rússia", "Estados Unidos", "China"], certa: 0, nivel: 3 },
    { pergunta: "Qual é o lago mais profundo do mundo?", opcoes: ["Baikal", "Vitória", "Titicaca", "Superior"], certa: 0, nivel: 3 },
    { pergunta: "Qual é a capital do Cazaquistão?", opcoes: ["Astana", "Almaty", "Tashkent", "Bishkek"], certa: 0, nivel: 3 },
    { pergunta: "Qual estreito separa a Europa da África no ponto mais próximo?", opcoes: ["Gibraltar", "Bósforo", "Dardanelos", "Messina"], certa: 0, nivel: 3 },
    { pergunta: "Qual é o país mais extenso da África em área territorial?", opcoes: ["Argélia", "Rep. Democrática do Congo", "Sudão", "Líbia"], certa: 0, nivel: 3 },
    { pergunta: "Qual desses países NÃO faz fronteira com a Bolívia?", opcoes: ["Equador", "Peru", "Chile", "Argentina"], certa: 0, nivel: 3 },
  ],

  historia: [
    { pergunta: "Em que ano começou a Segunda Guerra Mundial?", opcoes: ["1939", "1914", "1945", "1935"], certa: 0, nivel: 1 },
    { pergunta: "Quem foi o primeiro presidente do Brasil?", opcoes: ["Deodoro da Fonseca", "Getúlio Vargas", "Dom Pedro I", "Floriano Peixoto"], certa: 0, nivel: 1 },
    { pergunta: "Em que ano o Brasil foi descoberto pelos portugueses?", opcoes: ["1500", "1492", "1530", "1550"], certa: 0, nivel: 1 },
    { pergunta: "Quem foi o primeiro presidente dos Estados Unidos?", opcoes: ["George Washington", "Abraham Lincoln", "Thomas Jefferson", "Benjamin Franklin"], certa: 0, nivel: 1 },
    { pergunta: "Em que ano caiu o Muro de Berlim?", opcoes: ["1989", "1991", "1985", "1979"], certa: 0, nivel: 1 },
    { pergunta: "Qual revolução ocorreu na França em 1789?", opcoes: ["Revolução Francesa", "Revolução Industrial", "Revolução Russa", "Revolução Gloriosa"], certa: 0, nivel: 1 },
    { pergunta: "Quem assinou a Lei Áurea, abolindo a escravidão no Brasil em 1888?", opcoes: ["Princesa Isabel", "Dom Pedro II", "Dom Pedro I", "Deodoro da Fonseca"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano ocorreu a Proclamação da República no Brasil?", opcoes: ["1889", "1888", "1822", "1900"], certa: 0, nivel: 2 },
    { pergunta: "Qual civilização construiu as pirâmides de Gizé?", opcoes: ["Egípcios", "Maias", "Astecas", "Romanos"], certa: 0, nivel: 2 },
    { pergunta: "Quem foi o líder soviético durante boa parte do início da Guerra Fria?", opcoes: ["Josef Stalin", "Vladimir Lenin", "Nikita Khrushchov", "Leon Trotsky"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano os Estados Unidos lançaram bombas atômicas sobre o Japão?", opcoes: ["1945", "1944", "1946", "1943"], certa: 0, nivel: 2 },
    { pergunta: "Qual foi uma das primeiras civilizações a usar a escrita, com o sistema cuneiforme?", opcoes: ["Sumérios", "Egípcios", "Fenícios", "Babilônios"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano foi assinada a Magna Carta na Inglaterra?", opcoes: ["1215", "1315", "1115", "1415"], certa: 0, nivel: 3 },
    { pergunta: "Getúlio Vargas governou o Brasil como:", opcoes: ["Presidente/ditador", "Rei", "Papa", "General estrangeiro"], certa: 0, nivel: 3 },
    { pergunta: "Qual tratado encerrou oficialmente a Primeira Guerra Mundial?", opcoes: ["Tratado de Versalhes", "Tratado de Tordesilhas", "Tratado de Paris", "Congresso de Viena"], certa: 0, nivel: 3 },
    { pergunta: "Em que século teve início a Revolução Industrial?", opcoes: ["Século XVIII", "Século XVI", "Século XIX", "Século XX"], certa: 0, nivel: 3 },
    { pergunta: "Quem foi o principal líder da Revolução Cubana em 1959?", opcoes: ["Fidel Castro", "Che Guevara", "Raúl Castro", "Camilo Cienfuegos"], certa: 0, nivel: 3 },
    { pergunta: "Qual dinastia chinesa é considerada a mais longa da história?", opcoes: ["Zhou", "Han", "Tang", "Qing"], certa: 0, nivel: 3 },
  ],

  "futebol-nacional": [
    { pergunta: "Quantas vezes o Brasil foi campeão da Copa do Mundo?", opcoes: ["5", "4", "6", "3"], certa: 0, nivel: 1 },
    { pergunta: "Qual time é conhecido como \"Mengão\"?", opcoes: ["Flamengo", "Fluminense", "Botafogo", "Vasco"], certa: 0, nivel: 1 },
    { pergunta: "Quem é o maior artilheiro do Brasil em Copas do Mundo?", opcoes: ["Ronaldo Nazário", "Pelé", "Romário", "Neymar"], certa: 0, nivel: 1 },
    { pergunta: "Em que cidade fica o estádio Maracanã?", opcoes: ["Rio de Janeiro", "São Paulo", "Belo Horizonte", "Salvador"], certa: 0, nivel: 1 },
    { pergunta: "Qual clube é conhecido como \"Timão\"?", opcoes: ["Corinthians", "Palmeiras", "Santos", "São Paulo"], certa: 0, nivel: 1 },
    { pergunta: "Quem é considerado o \"Rei do Futebol\"?", opcoes: ["Pelé", "Garrincha", "Zico", "Romário"], certa: 0, nivel: 1 },
    { pergunta: "Em que ano o Brasil sediou a Copa do Mundo pela segunda vez?", opcoes: ["2014", "2010", "2018", "2006"], certa: 0, nivel: 2 },
    { pergunta: "Qual foi o placar de Brasil x Alemanha na semifinal da Copa de 2014?", opcoes: ["7 a 1", "5 a 0", "6 a 2", "4 a 1"], certa: 0, nivel: 2 },
    { pergunta: "Qual clube brasileiro tem o apelido de \"Peixe\"?", opcoes: ["Santos", "Vasco", "Grêmio", "Bahia"], certa: 0, nivel: 2 },
    { pergunta: "Quem foi o técnico do Brasil no pentacampeonato de 2002?", opcoes: ["Luiz Felipe Scolari", "Zagallo", "Carlos Alberto Parreira", "Tite"], certa: 0, nivel: 2 },
    { pergunta: "Qual clube tem o maior número de títulos do Campeonato Brasileiro (até 2023)?", opcoes: ["Palmeiras", "Flamengo", "Santos", "São Paulo"], certa: 0, nivel: 2 },
    { pergunta: "Qual jogador brasileiro venceu a Bola de Ouro em 2007?", opcoes: ["Kaká", "Ronaldinho Gaúcho", "Ronaldo", "Rivaldo"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano o Brasil conquistou seu primeiro título mundial de Copa do Mundo?", opcoes: ["1958", "1950", "1962", "1970"], certa: 0, nivel: 3 },
    { pergunta: "Qual foi o primeiro clube brasileiro campeão da Copa Libertadores?", opcoes: ["Santos", "Flamengo", "Cruzeiro", "Palmeiras"], certa: 0, nivel: 3 },
    { pergunta: "Em que ano o Corinthians conquistou seu primeiro Mundial de Clubes da FIFA?", opcoes: ["2000", "2012", "1998", "2005"], certa: 0, nivel: 3 },
    { pergunta: "Qual técnico brasileiro venceu a Copa do Mundo de 1994?", opcoes: ["Carlos Alberto Parreira", "Zagallo", "Telê Santana", "Luiz Felipe Scolari"], certa: 0, nivel: 3 },
    { pergunta: "Qual clube foi o primeiro brasileiro a vencer a Libertadores mais de uma vez?", opcoes: ["Santos", "Cruzeiro", "São Paulo", "Grêmio"], certa: 0, nivel: 3 },
    { pergunta: "Em qual Copa do Mundo Pelé venceu seu primeiro título, aos 17 anos?", opcoes: ["1958", "1962", "1970", "1966"], certa: 0, nivel: 3 },
  ],

  "futebol-internacional": [
    { pergunta: "Qual seleção tem mais títulos de Copa do Mundo?", opcoes: ["Brasil", "Alemanha", "Itália", "Argentina"], certa: 0, nivel: 1 },
    { pergunta: "Qual jogador é conhecido como \"CR7\"?", opcoes: ["Cristiano Ronaldo", "Ronaldinho", "Ronaldo Nazário", "Neymar"], certa: 0, nivel: 1 },
    { pergunta: "Qual país sediou a Copa do Mundo de 2022?", opcoes: ["Catar", "Rússia", "Brasil", "Alemanha"], certa: 0, nivel: 1 },
    { pergunta: "Qual clube espanhol é conhecido como \"Real\"?", opcoes: ["Real Madrid", "Barcelona", "Atlético de Madrid", "Sevilla"], certa: 0, nivel: 1 },
    { pergunta: "Qual país sediou a Copa do Mundo de 2018?", opcoes: ["Rússia", "Brasil", "Alemanha", "França"], certa: 0, nivel: 1 },
    { pergunta: "Quem é o maior rival de Cristiano Ronaldo na disputa por Bolas de Ouro na década de 2010?", opcoes: ["Lionel Messi", "Neymar", "Luka Modrić", "Robert Lewandowski"], certa: 0, nivel: 1 },
    { pergunta: "Qual seleção venceu a Copa do Mundo de 2010?", opcoes: ["Espanha", "Holanda", "Alemanha", "Itália"], certa: 0, nivel: 2 },
    { pergunta: "Em que país fica o clube Bayern de Munique?", opcoes: ["Alemanha", "Áustria", "Suíça", "Holanda"], certa: 0, nivel: 2 },
    { pergunta: "Qual seleção venceu a Eurocopa de 2016?", opcoes: ["Portugal", "França", "Alemanha", "Espanha"], certa: 0, nivel: 2 },
    { pergunta: "Quantas Copas do Mundo a Alemanha já venceu?", opcoes: ["4", "3", "5", "2"], certa: 0, nivel: 2 },
    { pergunta: "Qual jogador argentino foi campeão do mundo em 2022?", opcoes: ["Lionel Messi", "Diego Maradona", "Sergio Agüero", "Ángel Di María"], certa: 0, nivel: 2 },
    { pergunta: "Qual é a principal competição de clubes da Europa?", opcoes: ["Liga dos Campeões", "Liga Europa", "Copa da UEFA", "Supercopa"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano a Argentina venceu sua primeira Copa do Mundo?", opcoes: ["1978", "1986", "1990", "1982"], certa: 0, nivel: 3 },
    { pergunta: "Qual país sediou a primeira Copa do Mundo da história, em 1930?", opcoes: ["Uruguai", "Brasil", "Itália", "França"], certa: 0, nivel: 3 },
    { pergunta: "Quem foi o artilheiro da Copa do Mundo de 2014?", opcoes: ["James Rodríguez", "Thomas Müller", "Lionel Messi", "Neymar"], certa: 0, nivel: 3 },
    { pergunta: "Qual clube inglês é conhecido como \"Reds\"?", opcoes: ["Liverpool", "Manchester United", "Arsenal", "Chelsea"], certa: 0, nivel: 3 },
    { pergunta: "Quantas Bolas de Ouro Lionel Messi tinha conquistado até 2023?", opcoes: ["8", "7", "6", "9"], certa: 0, nivel: 3 },
    { pergunta: "Qual seleção venceu a Copa do Mundo de 1998, sediando o torneio?", opcoes: ["França", "Brasil", "Itália", "Argentina"], certa: 0, nivel: 3 },
  ],

  nba: [
    { pergunta: "Quantos jogadores de cada time ficam em quadra na NBA?", opcoes: ["5", "6", "7", "4"], certa: 0, nivel: 1 },
    { pergunta: "Qual jogador é conhecido como \"King James\"?", opcoes: ["LeBron James", "Michael Jordan", "Kobe Bryant", "Kevin Durant"], certa: 0, nivel: 1 },
    { pergunta: "Por qual time Michael Jordan jogou a maior parte da carreira?", opcoes: ["Chicago Bulls", "LA Lakers", "Boston Celtics", "Miami Heat"], certa: 0, nivel: 1 },
    { pergunta: "Quantos pontos vale uma cesta de 3 pontos?", opcoes: ["3", "2", "4", "1"], certa: 0, nivel: 1 },
    { pergunta: "Qual cidade tem o time \"Lakers\"?", opcoes: ["Los Angeles", "Boston", "Miami", "Chicago"], certa: 0, nivel: 1 },
    { pergunta: "Qual jogador brasileiro é um dos mais lembrados na história da NBA?", opcoes: ["Nenê Hilário", "Neymar", "Oscar Schmidt", "Marcelinho Huertas"], certa: 0, nivel: 1 },
    { pergunta: "Quantos títulos de NBA Michael Jordan conquistou?", opcoes: ["6", "5", "7", "4"], certa: 0, nivel: 2 },
    { pergunta: "Qual jogador é conhecido pelo apelido \"Black Mamba\"?", opcoes: ["Kobe Bryant", "LeBron James", "Shaquille O'Neal", "Allen Iverson"], certa: 0, nivel: 2 },
    { pergunta: "Qual time venceu o título da NBA em 2023?", opcoes: ["Denver Nuggets", "Miami Heat", "Boston Celtics", "LA Lakers"], certa: 0, nivel: 2 },
    { pergunta: "Quem se tornou o maior pontuador da história da NBA em 2023, superando Kareem Abdul-Jabbar?", opcoes: ["LeBron James", "Kobe Bryant", "Kevin Durant", "Karl Malone"], certa: 0, nivel: 2 },
    { pergunta: "Qual jogador é conhecido como \"The Greek Freak\"?", opcoes: ["Giannis Antetokounmpo", "Luka Dončić", "Nikola Jokić", "Joel Embiid"], certa: 0, nivel: 2 },
    { pergunta: "Quantos períodos (quartos) tem uma partida de NBA?", opcoes: ["4", "2", "3", "5"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano a NBA foi fundada?", opcoes: ["1946", "1950", "1939", "1960"], certa: 0, nivel: 3 },
    { pergunta: "Qual jogador tem o maior número de prêmios de MVP da temporada regular (6 vezes)?", opcoes: ["Kareem Abdul-Jabbar", "Michael Jordan", "LeBron James", "Bill Russell"], certa: 0, nivel: 3 },
    { pergunta: "Quem foi o primeiro jogador a marcar 100 pontos em uma única partida da NBA?", opcoes: ["Wilt Chamberlain", "Kobe Bryant", "Michael Jordan", "LeBron James"], certa: 0, nivel: 3 },
    { pergunta: "Qual franquia tem mais títulos de NBA na história?", opcoes: ["Boston Celtics", "LA Lakers", "Chicago Bulls", "Golden State Warriors"], certa: 0, nivel: 3 },
    { pergunta: "Quem foi eleito \"Novato do Ano\" na temporada de estreia de LeBron James (2003-04)?", opcoes: ["O próprio LeBron James", "Carmelo Anthony", "Dwyane Wade", "Chris Bosh"], certa: 0, nivel: 3 },
    { pergunta: "Em que cidade foi disputada a estreia olímpica do lendário \"Dream Team\" dos EUA, em 1992?", opcoes: ["Barcelona", "Los Angeles", "Atlanta", "Sydney"], certa: 0, nivel: 3 },
  ],

  nfl: [
    { pergunta: "Quantos jogadores de cada time ficam em campo na NFL?", opcoes: ["11", "10", "12", "9"], certa: 0, nivel: 1 },
    { pergunta: "Como se chama a decisão final do campeonato da NFL?", opcoes: ["Super Bowl", "World Series", "Grand Final", "Championship Bowl"], certa: 0, nivel: 1 },
    { pergunta: "Quantos pontos vale um touchdown?", opcoes: ["6", "7", "3", "5"], certa: 0, nivel: 1 },
    { pergunta: "Qual posição normalmente é responsável por lançar a bola?", opcoes: ["Quarterback", "Running Back", "Linebacker", "Wide Receiver"], certa: 0, nivel: 1 },
    { pergunta: "Quantas tentativas (downs) o time atacante tem para avançar 10 jardas?", opcoes: ["4", "3", "5", "2"], certa: 0, nivel: 1 },
    { pergunta: "Quantos quartos tem um jogo de NFL em tempo regulamentar?", opcoes: ["4 quartos de 15 minutos", "2 tempos de 45 minutos", "4 quartos de 12 minutos", "3 tempos de 20 minutos"], certa: 0, nivel: 1 },
    { pergunta: "Qual time venceu o Super Bowl LVIII, disputado em 2024?", opcoes: ["Kansas City Chiefs", "San Francisco 49ers", "Philadelphia Eagles", "Baltimore Ravens"], certa: 0, nivel: 2 },
    { pergunta: "Qual quarterback é considerado um dos maiores da história, com múltiplos títulos pelo New England Patriots?", opcoes: ["Tom Brady", "Peyton Manning", "Aaron Rodgers", "Drew Brees"], certa: 0, nivel: 2 },
    { pergunta: "Quantos pontos vale um field goal?", opcoes: ["3", "2", "6", "1"], certa: 0, nivel: 2 },
    { pergunta: "Qual cidade é sede do time \"Cowboys\"?", opcoes: ["Dallas", "Houston", "Denver", "Green Bay"], certa: 0, nivel: 2 },
    { pergunta: "Quantos times compõem a NFL atualmente?", opcoes: ["32", "30", "28", "34"], certa: 0, nivel: 2 },
    { pergunta: "O que significa a sigla \"NFL\"?", opcoes: ["National Football League", "North Football League", "National Field League", "New Football League"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano ocorreu o primeiro Super Bowl?", opcoes: ["1967", "1970", "1960", "1975"], certa: 0, nivel: 3 },
    { pergunta: "Qual quarterback tem o recorde de mais títulos de Super Bowl vencidos (7)?", opcoes: ["Tom Brady", "Joe Montana", "Terry Bradshaw", "Peyton Manning"], certa: 0, nivel: 3 },
    { pergunta: "Qual time venceu o primeiro Super Bowl da história?", opcoes: ["Green Bay Packers", "Kansas City Chiefs", "Dallas Cowboys", "Oakland Raiders"], certa: 0, nivel: 3 },
    { pergunta: "Quantos Super Bowls Tom Brady disputou ao longo da carreira?", opcoes: ["10", "7", "8", "9"], certa: 0, nivel: 3 },
    { pergunta: "Qual é o nome do troféu entregue ao campeão do Super Bowl?", opcoes: ["Troféu Vince Lombardi", "Troféu Heisman", "Troféu Stanley", "Troféu MVP"], certa: 0, nivel: 3 },
    { pergunta: "Qual time completou uma temporada perfeita, incluindo o título, em 1972?", opcoes: ["Miami Dolphins", "Chicago Bears", "Pittsburgh Steelers", "San Francisco 49ers"], certa: 0, nivel: 3 },
  ],

  "cinema-tv": [
    { pergunta: "Quem dirigiu o filme \"Titanic\" (1997)?", opcoes: ["James Cameron", "Steven Spielberg", "Christopher Nolan", "Martin Scorsese"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o nome do bruxo protagonista da saga \"Harry Potter\"?", opcoes: ["Harry Potter", "Ron Weasley", "Draco Malfoy", "Neville Longbottom"], certa: 0, nivel: 1 },
    { pergunta: "Qual estúdio é dono de personagens como Mickey Mouse?", opcoes: ["Disney", "Warner Bros", "Universal", "Pixar"], certa: 0, nivel: 1 },
    { pergunta: "Quem interpretou o Homem de Ferro nos filmes da Marvel?", opcoes: ["Robert Downey Jr.", "Chris Evans", "Chris Hemsworth", "Mark Ruffalo"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o nome da série animada sobre uma família amarela, criada por Matt Groening?", opcoes: ["Os Simpsons", "Family Guy", "South Park", "Bob's Burgers"], certa: 0, nivel: 1 },
    { pergunta: "Qual filme brasileiro venceu o Oscar de Melhor Filme Internacional em 2025?", opcoes: ["Ainda Estou Aqui", "Cidade de Deus", "Central do Brasil", "Tropa de Elite"], certa: 0, nivel: 1 },
    { pergunta: "Quem dirigiu a trilogia \"O Senhor dos Anéis\"?", opcoes: ["Peter Jackson", "James Cameron", "George Lucas", "Ridley Scott"], certa: 0, nivel: 2 },
    { pergunta: "Qual atriz interpretou a personagem Hermione Granger?", opcoes: ["Emma Watson", "Emma Stone", "Emma Roberts", "Kristen Stewart"], certa: 0, nivel: 2 },
    { pergunta: "Qual foi o primeiro filme de animação da Pixar?", opcoes: ["Toy Story", "Vida de Inseto", "Procurando Nemo", "Shrek"], certa: 0, nivel: 2 },
    { pergunta: "Quem interpretou o Coringa no filme \"Coringa\" (2019), vencendo o Oscar de Melhor Ator?", opcoes: ["Joaquin Phoenix", "Heath Ledger", "Jared Leto", "Jack Nicholson"], certa: 0, nivel: 2 },
    { pergunta: "Qual série é ambientada no universo de \"Game of Thrones\", sobre a família Targaryen?", opcoes: ["A Casa do Dragão", "House of Cards", "Vikings", "The Witcher"], certa: 0, nivel: 2 },
    { pergunta: "Quem criou a saga \"Star Wars\"?", opcoes: ["George Lucas", "Steven Spielberg", "James Cameron", "J.J. Abrams"], certa: 0, nivel: 2 },
    { pergunta: "Qual filme foi o primeiro em língua não inglesa a vencer o Oscar de Melhor Filme, em 2020?", opcoes: ["Parasita", "Roma", "1917", "Coringa"], certa: 0, nivel: 3 },
    { pergunta: "Quem dirigiu \"Cidade de Deus\" (2002)?", opcoes: ["Fernando Meirelles", "Walter Salles", "Hector Babenco", "José Padilha"], certa: 0, nivel: 3 },
    { pergunta: "Qual ator interpretou Michael Corleone em \"O Poderoso Chefão\"?", opcoes: ["Al Pacino", "Robert De Niro", "Marlon Brando", "James Caan"], certa: 0, nivel: 3 },
    { pergunta: "Qual diretor é conhecido por filmes como \"Pulp Fiction\" e \"Kill Bill\"?", opcoes: ["Quentin Tarantino", "Martin Scorsese", "David Fincher", "Christopher Nolan"], certa: 0, nivel: 3 },
    { pergunta: "Qual atriz brasileira venceu o Globo de Ouro de Melhor Atriz em 2025 por \"Ainda Estou Aqui\"?", opcoes: ["Fernanda Torres", "Fernanda Montenegro", "Sônia Braga", "Regina Casé"], certa: 0, nivel: 3 },
    { pergunta: "Em que ano foi lançado o primeiro filme da saga \"Matrix\"?", opcoes: ["1999", "1997", "2001", "2003"], certa: 0, nivel: 3 },
  ],

  musica: [
    { pergunta: "Quem é conhecida como a \"Rainha do Pop\"?", opcoes: ["Madonna", "Beyoncé", "Rihanna", "Lady Gaga"], certa: 0, nivel: 1 },
    { pergunta: "Qual banda britânica é formada por John Lennon, Paul McCartney, George Harrison e Ringo Starr?", opcoes: ["The Beatles", "The Rolling Stones", "Queen", "Pink Floyd"], certa: 0, nivel: 1 },
    { pergunta: "Quem canta o hit \"Envolver\"?", opcoes: ["Anitta", "Ivete Sangalo", "Ludmilla", "Iza"], certa: 0, nivel: 1 },
    { pergunta: "Qual cantora é conhecida como \"Rainha do Rock Brasileiro\"?", opcoes: ["Rita Lee", "Cássia Eller", "Elis Regina", "Marisa Monte"], certa: 0, nivel: 1 },
    { pergunta: "Quem foi o vocalista da banda Queen, falecido em 1991?", opcoes: ["Freddie Mercury", "Brian May", "Roger Taylor", "John Deacon"], certa: 0, nivel: 1 },
    { pergunta: "Qual gênero musical, ligado ao Carnaval, nasceu no Brasil?", opcoes: ["Samba", "Jazz", "Reggae", "Tango"], certa: 0, nivel: 1 },
    { pergunta: "Qual cantora lançou o álbum \"1989\"?", opcoes: ["Taylor Swift", "Ariana Grande", "Katy Perry", "Selena Gomez"], certa: 0, nivel: 2 },
    { pergunta: "Quem compôs a música \"Águas de Março\"?", opcoes: ["Tom Jobim", "Chico Buarque", "Caetano Veloso", "Vinícius de Moraes"], certa: 0, nivel: 2 },
    { pergunta: "Qual banda gravou o álbum \"The Dark Side of the Moon\"?", opcoes: ["Pink Floyd", "Led Zeppelin", "The Who", "Deep Purple"], certa: 0, nivel: 2 },
    { pergunta: "Quem canta o hit \"Vai Malandra\"?", opcoes: ["Anitta", "MC Rebecca", "Ludmilla", "Pabllo Vittar"], certa: 0, nivel: 2 },
    { pergunta: "Qual cantor é conhecido como \"Rei do Brega\"?", opcoes: ["Reginaldo Rossi", "Amado Batista", "Waldick Soriano", "Renato & Seus Blue Caps"], certa: 0, nivel: 2 },
    { pergunta: "Qual dupla sertaneja é famosa pela música \"Evidências\"?", opcoes: ["Chitãozinho & Xororó", "Zezé Di Camargo & Luciano", "Bruno & Marrone", "Victor & Leo"], certa: 0, nivel: 2 },
    { pergunta: "Em que ano foi lançado o álbum \"Thriller\", de Michael Jackson?", opcoes: ["1982", "1979", "1985", "1988"], certa: 0, nivel: 3 },
    { pergunta: "Quem são os autores da música \"Garota de Ipanema\"?", opcoes: ["Tom Jobim e Vinícius de Moraes", "Chico Buarque", "Caetano Veloso", "Dorival Caymmi"], certa: 0, nivel: 3 },
    { pergunta: "Qual artista venceu o Grammy de Álbum do Ano em 2023 com \"Harry's House\"?", opcoes: ["Harry Styles", "Beyoncé", "Adele", "Kendrick Lamar"], certa: 0, nivel: 3 },
    { pergunta: "Quem foi o vocalista da banda Legião Urbana, falecido em 1996?", opcoes: ["Renato Russo", "Dado Villa-Lobos", "Marcelo Bonfá", "Renato Rocha"], certa: 0, nivel: 3 },
    { pergunta: "Qual cantora pop é conhecida pelo hit \"Bad Romance\"?", opcoes: ["Lady Gaga", "Katy Perry", "Rihanna", "Beyoncé"], certa: 0, nivel: 3 },
    { pergunta: "Em que década surgiu o movimento musical \"Bossa Nova\" no Brasil?", opcoes: ["Anos 1950", "Anos 1940", "Anos 1960", "Anos 1970"], certa: 0, nivel: 3 },
  ],

  ciencias: [
    { pergunta: "Qual é o maior planeta do sistema solar?", opcoes: ["Júpiter", "Saturno", "Terra", "Netuno"], certa: 0, nivel: 1 },
    { pergunta: "Qual órgão do corpo humano é responsável por bombear o sangue?", opcoes: ["Coração", "Pulmão", "Fígado", "Rim"], certa: 0, nivel: 1 },
    { pergunta: "Qual gás os seres humanos precisam respirar para sobreviver?", opcoes: ["Oxigênio", "Nitrogênio", "Gás Carbônico", "Hidrogênio"], certa: 0, nivel: 1 },
    { pergunta: "Qual é o maior animal terrestre da atualidade?", opcoes: ["Elefante Africano", "Girafa", "Rinoceronte", "Hipopótamo"], certa: 0, nivel: 1 },
    { pergunta: "Quantos ossos tem o corpo humano adulto, aproximadamente?", opcoes: ["206", "150", "300", "180"], certa: 0, nivel: 1 },
    { pergunta: "Qual planeta é conhecido como o \"planeta vermelho\"?", opcoes: ["Marte", "Vênus", "Júpiter", "Mercúrio"], certa: 0, nivel: 1 },
    { pergunta: "Qual é a menor unidade estrutural e funcional dos seres vivos?", opcoes: ["Célula", "Átomo", "Molécula", "Tecido"], certa: 0, nivel: 2 },
    { pergunta: "Quem formulou a Teoria da Evolução das Espécies?", opcoes: ["Charles Darwin", "Gregor Mendel", "Louis Pasteur", "Isaac Newton"], certa: 0, nivel: 2 },
    { pergunta: "Qual é o elemento químico mais abundante no universo?", opcoes: ["Hidrogênio", "Oxigênio", "Carbono", "Hélio"], certa: 0, nivel: 2 },
    { pergunta: "Qual é a velocidade aproximada da luz no vácuo?", opcoes: ["300 mil km/s", "150 mil km/s", "3 milhões km/s", "30 mil km/s"], certa: 0, nivel: 2 },
    { pergunta: "Qual cientista formulou a Teoria da Relatividade?", opcoes: ["Albert Einstein", "Isaac Newton", "Stephen Hawking", "Niels Bohr"], certa: 0, nivel: 2 },
    { pergunta: "Qual é o maior órgão do corpo humano?", opcoes: ["Pele", "Fígado", "Intestino", "Pulmão"], certa: 0, nivel: 2 },
    { pergunta: "Como se chama o processo pelo qual as plantas produzem seu próprio alimento usando luz solar?", opcoes: ["Fotossíntese", "Respiração celular", "Fermentação", "Osmose"], certa: 0, nivel: 3 },
    { pergunta: "Quantos cromossomos tem uma célula humana normal?", opcoes: ["46", "44", "48", "23"], certa: 0, nivel: 3 },
    { pergunta: "Qual partícula subatômica tem carga negativa?", opcoes: ["Elétron", "Próton", "Nêutron", "Fóton"], certa: 0, nivel: 3 },
    { pergunta: "Qual cientista descobriu a penicilina?", opcoes: ["Alexander Fleming", "Louis Pasteur", "Robert Koch", "Marie Curie"], certa: 0, nivel: 3 },
    { pergunta: "Qual camada da atmosfera nos protege da radiação ultravioleta?", opcoes: ["Camada de ozônio", "Troposfera", "Mesosfera", "Termosfera"], certa: 0, nivel: 3 },
    { pergunta: "Quantos pares de cromossomos sexuais determinam o sexo biológico humano tipicamente?", opcoes: ["1", "2", "23", "46"], certa: 0, nivel: 3 },
  ],
};

/* ========================================================================
   ESCADA DE VALORES
   ======================================================================== */

const VALORES = [
  1000, 2000, 3000, 4000, 5000, 10000, 20000, 30000, 40000, 50000, 100000,
  200000, 300000, 400000, 1000000,
];
const CHECKPOINTS = [5, 10]; // números de pergunta (1-based) que garantem o valor
const TEMPO_PERGUNTA_S = 60;

function formatarValor(v) {
  return "R$ " + v.toLocaleString("pt-BR");
}

/* ========================================================================
   ESCOLHA DE TEMA / SUBCATEGORIA
   ======================================================================== */

const areaTemas = document.getElementById("areaTemas");
const areaSubcategorias = document.getElementById("areaSubcategorias");
const areaJogoMilhao = document.getElementById("areaJogoMilhao");

function mostrarTemas() {
  areaTemas.style.display = "block";
  areaSubcategorias.style.display = "none";
  areaJogoMilhao.style.display = "none";

  const lista = document.getElementById("listaTemas");
  lista.innerHTML = "";
  TEMAS.forEach((tema) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "menu-card";
    card.style.cursor = "pointer";
    card.innerHTML = `<span class="emoji">${tema.emoji}</span><h3>${tema.nome}</h3>`;
    card.addEventListener("click", () => escolherTema(tema));
    lista.appendChild(card);
  });
}

function escolherTema(tema) {
  if (tema.subcategorias) {
    mostrarSubcategorias(tema);
  } else {
    iniciarPartida(tema.id, tema.nome);
  }
}

function mostrarSubcategorias(tema) {
  areaTemas.style.display = "none";
  areaSubcategorias.style.display = "block";

  const lista = document.getElementById("listaSubcategorias");
  lista.innerHTML = "";
  tema.subcategorias.forEach((sub) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "menu-card";
    card.style.cursor = "pointer";
    card.innerHTML = `<span class="emoji">${tema.emoji}</span><h3>${sub.nome}</h3>`;
    card.addEventListener("click", () => iniciarPartida(sub.id, sub.nome));
    lista.appendChild(card);
  });
}

document.getElementById("btnVoltarTemas").addEventListener("click", mostrarTemas);

/* ========================================================================
   MONTAGEM DA PARTIDA
   ======================================================================== */

let partida = null;
let timerId = null;
let tempoRestante = TEMPO_PERGUNTA_S;

function embaralhar(arr) {
  return arr
    .map((v) => [Math.random(), v])
    .sort((a, b) => a[0] - b[0])
    .map((p) => p[1]);
}

function montarPerguntasDaPartida(poolId) {
  const banco = BANCO_PERGUNTAS[poolId] || [];
  const porNivel = { 1: [], 2: [], 3: [] };
  banco.forEach((q) => porNivel[q.nivel].push(q));

  const sobras = { 1: [], 2: [], 3: [] };
  const escolhidas = { 1: [], 2: [], 3: [] };

  [1, 2, 3].forEach((nivel) => {
    const embaralhadas = embaralhar(porNivel[nivel]);
    escolhidas[nivel] = embaralhadas.slice(0, 5);
    sobras[nivel] = embaralhadas.slice(5); // spares pra usar no "Pulei"
  });

  const perguntas = [...escolhidas[1], ...escolhidas[2], ...escolhidas[3]].map((q, i) => ({
    ...q,
    valor: VALORES[i],
  }));

  return { perguntas, sobras };
}

function iniciarPartida(poolId, nomeExibicao) {
  const { perguntas, sobras } = montarPerguntasDaPartida(poolId);

  partida = {
    poolId,
    nomeExibicao,
    perguntas,
    sobras,
    indice: 0,
    valorGarantido: 0,
    fimDeJogo: false,
    ajudasUsadas: { pular: false, cartas: false, universitarios: false },
    opcoesOcultas: [],
  };

  areaTemas.style.display = "none";
  areaSubcategorias.style.display = "none";
  areaJogoMilhao.style.display = "block";

  resetarBotoesAjuda();
  carregarPergunta();
}

/* ========================================================================
   RODADA / PERGUNTA
   ======================================================================== */

function carregarPergunta() {
  const q = partida.perguntas[partida.indice];
  partida.opcoesOcultas = [];

  document.getElementById("perguntaNum").textContent = `Pergunta ${partida.indice + 1} de ${partida.perguntas.length} — ${partida.nomeExibicao}`;
  document.getElementById("valorAtual").textContent = formatarValor(q.valor);
  document.getElementById("pergunta").textContent = q.pergunta;
  document.getElementById("status").textContent = "";
  document.getElementById("status").className = "status-msg";
  document.getElementById("painelCartas").style.display = "none";
  document.getElementById("resultadoCartas").style.display = "none";
  document.getElementById("painelUniversitarios").style.display = "none";

  renderizarOpcoes();

  document.getElementById("btnParar").style.display = "inline-block";
  document.getElementById("btnParar").disabled = partida.indice === 0;
  document.getElementById("btnNovo").style.display = "none";

  montarEscada();
  iniciarTimerPergunta();
}

function renderizarOpcoes() {
  const q = partida.perguntas[partida.indice];
  const elOpcoes = document.getElementById("opcoes");
  elOpcoes.innerHTML = "";

  q.opcoes.forEach((opcao, i) => {
    const btn = document.createElement("button");
    btn.className = "milhao-opcao";
    btn.textContent = opcao;
    if (partida.opcoesOcultas.includes(i)) {
      btn.disabled = true;
      btn.style.visibility = "hidden";
    } else {
      btn.addEventListener("click", () => responder(i));
    }
    elOpcoes.appendChild(btn);
  });
}

function iniciarTimerPergunta() {
  pararTimerPergunta();
  tempoRestante = TEMPO_PERGUNTA_S;
  atualizarTextoTimer();
  timerId = setInterval(tickTimerPergunta, 1000);
}

function pararTimerPergunta() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function tickTimerPergunta() {
  tempoRestante--;
  atualizarTextoTimer();
  if (tempoRestante <= 0) {
    pararTimerPergunta();
    tempoEsgotado();
  }
}

function atualizarTextoTimer() {
  const el = document.getElementById("milhaoTimer");
  const min = Math.floor(tempoRestante / 60);
  const seg = tempoRestante % 60;
  el.textContent = `${min}:${String(seg).padStart(2, "0")}`;
  el.classList.toggle("urgente", tempoRestante <= 10);
}

function tempoEsgotado() {
  const q = partida.perguntas[partida.indice];
  const botoes = document.querySelectorAll("#opcoes .milhao-opcao");
  botoes.forEach((b) => (b.disabled = true));
  if (botoes[q.certa]) botoes[q.certa].classList.add("certa");

  document.getElementById("status").textContent = `⏰ Tempo esgotado! A resposta certa era "${q.opcoes[q.certa]}".`;
  document.getElementById("status").className = "status-msg lose";
  finalizarPartida();
}

/* ========================================================================
   RESPONDER
   ======================================================================== */

function responder(escolha) {
  if (!partida || partida.fimDeJogo) return;
  pararTimerPergunta();

  const q = partida.perguntas[partida.indice];
  const botoes = document.querySelectorAll("#opcoes .milhao-opcao");
  botoes.forEach((b) => (b.disabled = true));

  if (escolha === q.certa) {
    botoes[escolha].classList.add("certa");
    const numeroPergunta = partida.indice + 1;
    if (CHECKPOINTS.includes(numeroPergunta)) {
      partida.valorGarantido = q.valor;
    }

    if (partida.indice === partida.perguntas.length - 1) {
      document.getElementById("status").textContent = "🏆 Você ganhou o milhão! Parabéns!";
      document.getElementById("status").className = "status-msg win";
      finalizarPartida();
    } else {
      document.getElementById("status").textContent = "✅ Resposta certa!";
      document.getElementById("status").className = "status-msg win";
      setTimeout(() => {
        partida.indice++;
        carregarPergunta();
      }, 1200);
    }
  } else {
    botoes[escolha].classList.add("errada");
    botoes[q.certa].classList.add("certa");
    document.getElementById("status").textContent = `❌ Resposta errada! Você leva ${formatarValor(partida.valorGarantido)}.`;
    document.getElementById("status").className = "status-msg lose";
    finalizarPartida();
  }
}

function parar() {
  if (!partida || partida.fimDeJogo || partida.indice === 0) return;
  pararTimerPergunta();
  const valorConquistado = partida.perguntas[partida.indice - 1].valor;
  document.getElementById("status").textContent = `🙌 Você parou e levou ${formatarValor(valorConquistado)}!`;
  document.getElementById("status").className = "status-msg win";
  document.querySelectorAll("#opcoes .milhao-opcao").forEach((b) => (b.disabled = true));
  finalizarPartida();
}

function finalizarPartida() {
  partida.fimDeJogo = true;
  pararTimerPergunta();
  document.getElementById("btnParar").style.display = "none";
  document.getElementById("btnNovo").style.display = "inline-block";
  document.getElementById("milhaoTimer").textContent = "";
  desabilitarAjudas();
  montarEscada();
}

function montarEscada() {
  const elEscada = document.getElementById("escada");
  elEscada.innerHTML = "";
  for (let i = partida.perguntas.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    const numeroPergunta = i + 1;
    li.textContent = `${numeroPergunta}. ${formatarValor(partida.perguntas[i].valor)}`;
    if (CHECKPOINTS.includes(numeroPergunta)) li.classList.add("garantido");
    if (i === partida.indice && !partida.fimDeJogo) li.classList.add("atual");
    elEscada.appendChild(li);
  }
}

document.getElementById("btnParar").addEventListener("click", parar);
document.getElementById("btnNovo").addEventListener("click", mostrarTemas);

/* ========================================================================
   AJUDAS: PULEI, CARTAS, UNIVERSITÁRIOS
   ======================================================================== */

function resetarBotoesAjuda() {
  ["btnPular", "btnCartas", "btnUniversitarios"].forEach((id) => {
    document.getElementById(id).disabled = false;
  });
}

function desabilitarAjudas() {
  ["btnPular", "btnCartas", "btnUniversitarios"].forEach((id) => {
    document.getElementById(id).disabled = true;
  });
}

/* ---- Pulei ---- */

document.getElementById("btnPular").addEventListener("click", pular);

function pular() {
  if (!partida || partida.fimDeJogo || partida.ajudasUsadas.pular) return;

  const q = partida.perguntas[partida.indice];
  const sobrasDoNivel = partida.sobras[q.nivel];
  if (!sobrasDoNivel || !sobrasDoNivel.length) return; // sem pergunta reserva pra essa dificuldade

  partida.ajudasUsadas.pular = true;
  document.getElementById("btnPular").disabled = true;

  const novaPergunta = sobrasDoNivel.pop();
  partida.perguntas[partida.indice] = { ...novaPergunta, valor: q.valor };
  carregarPergunta();
}

/* ---- Cartas ---- */

document.getElementById("btnCartas").addEventListener("click", abrirCartas);

function abrirCartas() {
  if (!partida || partida.fimDeJogo || partida.ajudasUsadas.cartas) return;
  partida.ajudasUsadas.cartas = true;
  document.getElementById("btnCartas").disabled = true;

  const valores = embaralhar([0, 1, 2, 3]);
  const painel = document.getElementById("painelCartas");
  painel.innerHTML = "";
  valores.forEach((valorCarta, i) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn btn-secondary carta-btn";
    btn.textContent = `🎴 Carta ${i + 1}`;
    btn.addEventListener("click", () => escolherCarta(valorCarta));
    painel.appendChild(btn);
  });
  painel.style.display = "flex";
}

function escolherCarta(valorCarta) {
  document.getElementById("painelCartas").style.display = "none";

  const q = partida.perguntas[partida.indice];
  const erradas = [0, 1, 2, 3].filter((i) => i !== q.certa);
  const paraEliminar = embaralhar(erradas).slice(0, valorCarta);
  partida.opcoesOcultas = paraEliminar;

  const resultado = document.getElementById("resultadoCartas");
  resultado.style.display = "block";
  if (valorCarta === 0) {
    resultado.textContent = "🎴 Você tirou a carta 0 — nenhuma alternativa foi eliminada. Azar!";
  } else {
    resultado.textContent = `🎴 Você tirou a carta ${valorCarta} — ${valorCarta} alternativa${valorCarta > 1 ? "s" : ""} errada${valorCarta > 1 ? "s" : ""} eliminada${valorCarta > 1 ? "s" : ""}!`;
  }

  renderizarOpcoes();
}

/* ---- Ajuda dos universitários ---- */

document.getElementById("btnUniversitarios").addEventListener("click", usarUniversitarios);

function usarUniversitarios() {
  if (!partida || partida.fimDeJogo || partida.ajudasUsadas.universitarios) return;
  partida.ajudasUsadas.universitarios = true;
  document.getElementById("btnUniversitarios").disabled = true;

  const q = partida.perguntas[partida.indice];
  const percentuais = simularVotacaoUniversitarios(q.certa);

  const painel = document.getElementById("painelUniversitarios");
  painel.innerHTML = "";
  const letras = ["A", "B", "C", "D"];
  q.opcoes.forEach((opcao, i) => {
    if (partida.opcoesOcultas.includes(i)) return;
    const linha = document.createElement("div");
    linha.className = "milhao-uni-linha";
    linha.innerHTML = `
      <span class="milhao-uni-letra">${letras[i]}</span>
      <div class="milhao-uni-trilha"><div class="milhao-uni-preenchimento" style="width:${percentuais[i]}%"></div></div>
      <span class="milhao-uni-percentual">${percentuais[i]}%</span>
    `;
    painel.appendChild(linha);
  });
  painel.style.display = "block";
}

// Simula uma votação de uma plateia de universitários: a resposta certa
// tende a ganhar mais votos, mas não é garantido — é só uma ajuda, não a
// resposta certa entregue de bandeja.
function simularVotacaoUniversitarios(indiceCerta) {
  const pesoCerta = 40 + Math.random() * 35; // entre 40% e 75%
  const restante = 100 - pesoCerta;

  const outros = [0, 1, 2, 3].filter((i) => i !== indiceCerta && !partida.opcoesOcultas.includes(i));
  const pesosOutros = outros.map(() => Math.random());
  const somaOutros = pesosOutros.reduce((a, b) => a + b, 0) || 1;

  const percentuais = [0, 0, 0, 0];
  percentuais[indiceCerta] = Math.round(pesoCerta);
  outros.forEach((i, idx) => {
    percentuais[i] = Math.round((pesosOutros[idx] / somaOutros) * restante);
  });

  return percentuais;
}

/* ========================================================================
   INÍCIO
   ======================================================================== */

mostrarTemas();
