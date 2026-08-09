// Cada pergunta tem 4 alternativas; "certa" é o índice (0-3) da resposta correta.
const PERGUNTAS = [
  { valor: 1000, pergunta: "Qual é a capital do Brasil?", opcoes: ["Rio de Janeiro", "São Paulo", "Brasília", "Salvador"], certa: 2 },
  { valor: 2000, pergunta: "Quantos dias tem um ano bissexto?", opcoes: ["364", "365", "366", "367"], certa: 2 },
  { valor: 3000, pergunta: "Qual planeta é conhecido como 'planeta vermelho'?", opcoes: ["Vênus", "Marte", "Júpiter", "Saturno"], certa: 1 },
  { valor: 4000, pergunta: "Quem pintou a Mona Lisa?", opcoes: ["Van Gogh", "Picasso", "Leonardo da Vinci", "Michelangelo"], certa: 2 },
  { valor: 5000, pergunta: "Qual é o maior oceano do mundo?", opcoes: ["Atlântico", "Índico", "Ártico", "Pacífico"], certa: 3 },
  { valor: 10000, pergunta: "Em que ano o homem pisou na Lua pela primeira vez?", opcoes: ["1965", "1969", "1972", "1959"], certa: 1 },
  { valor: 20000, pergunta: "Qual é o maior país do mundo em área territorial?", opcoes: ["China", "Estados Unidos", "Canadá", "Rússia"], certa: 3 },
  { valor: 30000, pergunta: "Quantos ossos tem o corpo humano adulto, aproximadamente?", opcoes: ["156", "206", "256", "306"], certa: 1 },
  { valor: 40000, pergunta: "Qual desses elementos químicos tem o símbolo 'Au'?", opcoes: ["Prata", "Alumínio", "Ouro", "Argônio"], certa: 2 },
  { valor: 50000, pergunta: "Quem escreveu 'Dom Casmurro'?", opcoes: ["José de Alencar", "Machado de Assis", "Clarice Lispector", "Graciliano Ramos"], certa: 1 },
  { valor: 100000, pergunta: "Qual é o menor país do mundo?", opcoes: ["Mônaco", "San Marino", "Vaticano", "Liechtenstein"], certa: 2 },
  { valor: 200000, pergunta: "Qual é o osso mais longo do corpo humano?", opcoes: ["Úmero", "Fêmur", "Tíbia", "Fíbula"], certa: 1 },
  { valor: 300000, pergunta: "Em que ano começou a Segunda Guerra Mundial?", opcoes: ["1937", "1939", "1941", "1935"], certa: 1 },
  { valor: 400000, pergunta: "Qual é a velocidade da luz no vácuo, aproximadamente?", opcoes: ["300 mil km/s", "150 mil km/s", "3 milhões km/s", "30 mil km/s"], certa: 0 },
  { valor: 1000000, pergunta: "Qual é o nome do mais alto pico montanhoso do mundo?", opcoes: ["K2", "Kilimanjaro", "Everest", "Aconcágua"], certa: 2 },
];

const CHECKPOINTS = [5, 10]; // índices (1-based) que garantem o valor

let indiceAtual = 0;
let valorGarantido = 0;
let fimDeJogo = false;

const elValorAtual = document.getElementById("valorAtual");
const elPerguntaNum = document.getElementById("perguntaNum");
const elPergunta = document.getElementById("pergunta");
const elOpcoes = document.getElementById("opcoes");
const elStatus = document.getElementById("status");
const elEscada = document.getElementById("escada");
const btnParar = document.getElementById("btnParar");
const btnNovo = document.getElementById("btnNovo");

function formatarValor(v) {
  return "R$ " + v.toLocaleString("pt-BR");
}

function montarEscada() {
  elEscada.innerHTML = "";
  for (let i = PERGUNTAS.length - 1; i >= 0; i--) {
    const li = document.createElement("li");
    const numeroPergunta = i + 1;
    li.textContent = `${numeroPergunta}. ${formatarValor(PERGUNTAS[i].valor)}`;
    if (CHECKPOINTS.includes(numeroPergunta)) {
      li.classList.add("garantido");
    }
    if (i === indiceAtual && !fimDeJogo) {
      li.classList.add("atual");
    }
    elEscada.appendChild(li);
  }
}

function carregarPergunta() {
  const q = PERGUNTAS[indiceAtual];
  elPerguntaNum.textContent = `Pergunta ${indiceAtual + 1} de ${PERGUNTAS.length}`;
  elValorAtual.textContent = formatarValor(q.valor);
  elPergunta.textContent = q.pergunta;
  elStatus.textContent = "";
  elStatus.className = "status-msg";

  elOpcoes.innerHTML = "";
  q.opcoes.forEach((opcao, i) => {
    const btn = document.createElement("button");
    btn.className = "milhao-opcao";
    btn.textContent = opcao;
    btn.addEventListener("click", () => responder(i));
    elOpcoes.appendChild(btn);
  });

  btnParar.style.display = "inline-block";
  btnParar.disabled = indiceAtual === 0;
  btnNovo.style.display = "none";
  montarEscada();
}

function responder(escolha) {
  if (fimDeJogo) return;
  const q = PERGUNTAS[indiceAtual];
  const botoes = elOpcoes.querySelectorAll(".milhao-opcao");
  botoes.forEach((b) => (b.disabled = true));

  if (escolha === q.certa) {
    botoes[escolha].classList.add("certa");
    const numeroPergunta = indiceAtual + 1;
    if (CHECKPOINTS.includes(numeroPergunta)) {
      valorGarantido = q.valor;
    }

    if (indiceAtual === PERGUNTAS.length - 1) {
      elStatus.textContent = `🏆 Você ganhou o milhão! Parabéns!`;
      elStatus.className = "status-msg win";
      finalizar();
    } else {
      elStatus.textContent = "✅ Resposta certa!";
      elStatus.className = "status-msg win";
      setTimeout(() => {
        indiceAtual++;
        carregarPergunta();
      }, 1200);
    }
  } else {
    botoes[escolha].classList.add("errada");
    botoes[q.certa].classList.add("certa");
    elStatus.textContent = `❌ Resposta errada! Você leva ${formatarValor(valorGarantido)}.`;
    elStatus.className = "status-msg lose";
    finalizar();
  }
}

function parar() {
  if (fimDeJogo || indiceAtual === 0) return;
  const valorConquistado = PERGUNTAS[indiceAtual - 1].valor;
  elStatus.textContent = `🙌 Você parou e levou ${formatarValor(valorConquistado)}!`;
  elStatus.className = "status-msg win";
  elOpcoes.querySelectorAll(".milhao-opcao").forEach((b) => (b.disabled = true));
  finalizar();
}

function finalizar() {
  fimDeJogo = true;
  btnParar.style.display = "none";
  btnNovo.style.display = "inline-block";
  montarEscada();
}

function novoJogo() {
  indiceAtual = 0;
  valorGarantido = 0;
  fimDeJogo = false;
  carregarPergunta();
}

btnParar.addEventListener("click", parar);
btnNovo.addEventListener("click", novoJogo);

novoJogo();
