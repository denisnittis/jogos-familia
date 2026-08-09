const JOGO = "forca";

const PALAVRAS = [
  "ABACAXI", "CACHORRO", "ELEFANTE", "GIRAFA", "MONTANHA",
  "FUTEBOL", "PRAIA", "COMPUTADOR", "FAMILIA", "GUITARRA",
  "CACHOEIRA", "BORBOLETA", "CHOCOLATE", "FOGUETE", "CASTELO",
  "PIPOCA", "BICICLETA", "ARCOIRIS", "TARTARUGA", "VULCAO",
  "JACARE", "MOCHILA", "PLANETA", "SORVETE", "DINOSSAURO",
  "VIOLAO", "HELICOPTERO", "PIRATA", "FLORESTA", "TELEFONE",
];

const ESTAGIOS = [
  `
  +---+
      |
      |
      |
      |
=========`,
  `
  +---+
  O   |
      |
      |
      |
=========`,
  `
  +---+
  O   |
  |   |
      |
      |
=========`,
  `
  +---+
  O   |
 /|   |
      |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
      |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
 /    |
      |
=========`,
  `
  +---+
  O   |
 /|\\  |
 / \\  |
      |
=========`,
];

const MAX_ERROS = ESTAGIOS.length - 1;
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/* ========================================================================
   MODO SOLO
   ======================================================================== */

let palavraAtual = "";
let letrasCertas = new Set();
let letrasErradas = new Set();
let fimDeJogoSolo = false;

const elFigura = document.getElementById("figura");
const elPalavra = document.getElementById("palavra");
const elStatus = document.getElementById("status");
const elTeclado = document.getElementById("teclado");
const btnNovo = document.getElementById("btnNovo");

function novaPalavra() {
  palavraAtual = PALAVRAS[Math.floor(Math.random() * PALAVRAS.length)];
  letrasCertas = new Set();
  letrasErradas = new Set();
  fimDeJogoSolo = false;
  elStatus.textContent = "";
  elStatus.className = "status-msg";
  montarTecladoSolo();
  renderSolo();
}

function montarTecladoSolo() {
  elTeclado.innerHTML = "";
  for (const letra of ALFABETO) {
    const btn = document.createElement("button");
    btn.className = "tecla";
    btn.textContent = letra;
    btn.addEventListener("click", () => chutarSolo(letra));
    elTeclado.appendChild(btn);
  }
}

function chutarSolo(letra) {
  if (fimDeJogoSolo) return;

  const botoes = elTeclado.querySelectorAll(".tecla");
  const botao = Array.from(botoes).find((b) => b.textContent === letra);

  if (palavraAtual.includes(letra)) {
    letrasCertas.add(letra);
    if (botao) botao.classList.add("certa");
  } else {
    letrasErradas.add(letra);
    if (botao) botao.classList.add("errada");
  }
  if (botao) botao.disabled = true;

  verificarFimSolo();
  renderSolo();
}

function verificarFimSolo() {
  const ganhou = palavraAtual.split("").every((letra) => letrasCertas.has(letra));

  if (ganhou) {
    fimDeJogoSolo = true;
    elStatus.textContent = "🎉 Você ganhou!";
    elStatus.className = "status-msg win";
    desabilitarTecladoSolo();
  } else if (letrasErradas.size >= MAX_ERROS) {
    fimDeJogoSolo = true;
    elStatus.textContent = "💀 Você perdeu! A palavra era " + palavraAtual;
    elStatus.className = "status-msg lose";
    desabilitarTecladoSolo();
  }
}

function desabilitarTecladoSolo() {
  elTeclado.querySelectorAll(".tecla").forEach((b) => (b.disabled = true));
}

function renderSolo() {
  elFigura.textContent = ESTAGIOS[letrasErradas.size];
  elPalavra.textContent = palavraAtual
    .split("")
    .map((letra) => (letrasCertas.has(letra) ? letra : "_"))
    .join(" ");
}

btnNovo.addEventListener("click", novaPalavra);

/* ========================================================================
   MODO ONLINE (1 x 1)
   ======================================================================== */

let salaAtual = null; // { id }

const areaSolo = document.getElementById("areaSolo");
const areaOnlineLobby = document.getElementById("areaOnlineLobby");
const areaOnlineJogo = document.getElementById("areaOnlineJogo");
const btnModoSolo = document.getElementById("btnModoSolo");
const btnModoOnline = document.getElementById("btnModoOnline");

function definirModoJogo(modo) {
  if (modo === "solo" && salaAtual) {
    sairDaSala(JOGO, salaAtual.id);
    salaAtual = null;
  }
  if (modo !== "online") {
    pararDeEscutarConvites(JOGO);
  }

  btnModoSolo.classList.toggle("btn-primary", modo === "solo");
  btnModoSolo.classList.toggle("btn-secondary", modo !== "solo");
  btnModoOnline.classList.toggle("btn-primary", modo === "online");
  btnModoOnline.classList.toggle("btn-secondary", modo !== "online");

  areaSolo.style.display = modo === "solo" ? "block" : "none";
  areaOnlineLobby.style.display = modo === "online" && !salaAtual ? "block" : "none";
  areaOnlineJogo.style.display = modo === "online" && salaAtual ? "block" : "none";

  if (modo === "online") {
    montarSelectOponentes();
    escutarConvites(JOGO, renderizarConvites);

    if (!salaAtual) {
      const salaSalva = lerSalaLocal(JOGO);
      if (salaSalva) {
        salaAtual = { id: salaSalva };
        escutarSala(salaSalva);
      }
    }
  }
}

btnModoSolo.addEventListener("click", () => definirModoJogo("solo"));
btnModoOnline.addEventListener("click", () => definirModoJogo("online"));

function montarSelectOponentes() {
  const sel = document.getElementById("selecionarOponente");
  sel.innerHTML = "";
  outrosNomes().forEach((nome) => {
    const opt = document.createElement("option");
    opt.value = nome;
    opt.textContent = nome;
    sel.appendChild(opt);
  });
}

function renderizarConvites(convites) {
  const painel = document.getElementById("painelConvitesRecebidos");
  const lista = document.getElementById("listaConvites");
  const ids = Object.keys(convites);
  painel.style.display = ids.length ? "block" : "none";
  lista.innerHTML = "";

  ids.forEach((id) => {
    const c = convites[id];
    const div = document.createElement("div");
    div.className = "convite-item";

    const texto = document.createElement("span");
    texto.textContent = `${c.de} te chamou para jogar Forca`;

    const acoes = document.createElement("div");
    acoes.className = "convite-acoes";

    const btnAceitar = document.createElement("button");
    btnAceitar.className = "btn btn-primary";
    btnAceitar.textContent = "Aceitar";
    btnAceitar.addEventListener("click", () => aceitarConvite(id, c.salaId));

    const btnRecusar = document.createElement("button");
    btnRecusar.className = "btn btn-secondary";
    btnRecusar.textContent = "Recusar";
    btnRecusar.addEventListener("click", () => recusarConvite(JOGO, id, c.salaId));

    acoes.appendChild(btnAceitar);
    acoes.appendChild(btnRecusar);
    div.appendChild(texto);
    div.appendChild(acoes);
    lista.appendChild(div);
  });
}

document.getElementById("btnConvidar").addEventListener("click", () => {
  const oponente = document.getElementById("selecionarOponente").value;
  if (!oponente) return;
  const eu = getUser();

  const dadosIniciais = {
    criadoPor: eu,
    jogadores: { escolhedor: eu, adivinhador: oponente },
    placar: { [eu]: 0, [oponente]: 0 },
    rodada: { palavra: "", dica: "", dicaUsada: false, letrasCertas: {}, letrasErradas: {}, status: "escolhendo" },
    status: "aguardando",
    criadoEm: firebase.database.ServerValue.TIMESTAMP,
  };

  criarSalaEConvidar(JOGO, oponente, dadosIniciais, (salaId) => {
    salaAtual = { id: salaId };
    escutarSala(salaId);
  });
});

function aceitarConvite(conviteId, salaId) {
  removerConvite(JOGO, conviteId);
  refSala(JOGO, salaId)
    .update({ status: "jogando" })
    .then(() => {
      salaAtual = { id: salaId };
      escutarSala(salaId);
    });
}

function escutarSala(salaId) {
  salvarSalaLocal(JOGO, salaId);
  refSala(JOGO, salaId).on("value", (snap) => {
    const sala = snap.val();
    if (!sala) {
      salaAtual = null;
      limparSalaLocal(JOGO);
      areaOnlineJogo.style.display = "none";
      areaOnlineLobby.style.display = "block";
      document.getElementById("painelAguardando").style.display = "none";
      return;
    }
    renderizarSala(sala);
  });
}

function renderizarSala(sala) {
  const eu = getUser();

  if (sala.status === "aguardando") {
    areaOnlineLobby.style.display = "block";
    areaOnlineJogo.style.display = "none";
    document.getElementById("painelAguardando").style.display = "block";
    document.getElementById("textoAguardando").textContent =
      `Aguardando ${sala.jogadores.adivinhador} aceitar...`;
    return;
  }

  areaOnlineLobby.style.display = "none";
  areaOnlineJogo.style.display = "block";

  const souEscolhedor = sala.jogadores.escolhedor === eu;

  document.getElementById("onlineJogadores").innerHTML =
    `<span class="${souEscolhedor ? "voce" : ""}">${sala.jogadores.escolhedor} <span class="badge-papel">Escolhe</span></span>` +
    `<span class="${!souEscolhedor ? "voce" : ""}">${sala.jogadores.adivinhador} <span class="badge-papel">Adivinha</span></span>`;

  const placar = sala.placar || {};
  document.getElementById("onlinePlacar").innerHTML = Object.keys(placar)
    .map((nome) => `<span>${nome}: ${placar[nome]}</span>`)
    .join("");

  const rodada = sala.rodada || {};
  const elEscolhendo = document.getElementById("onlineEscolhendo");
  const elJogando = document.getElementById("onlineJogando");
  const btnProxima = document.getElementById("btnProximaRodada");

  if (rodada.status === "escolhendo") {
    elJogando.style.display = "none";
    btnProxima.style.display = "none";
    elEscolhendo.style.display = "block";

    if (souEscolhedor) {
      document.getElementById("textoEscolhendo").textContent =
        "Digite uma palavra para o adversário adivinhar:";
      document.getElementById("formPalavra").style.display = "flex";
    } else {
      document.getElementById("textoEscolhendo").textContent =
        `${sala.jogadores.escolhedor} está escolhendo a palavra...`;
      document.getElementById("formPalavra").style.display = "none";
    }
    return;
  }

  elEscolhendo.style.display = "none";
  elJogando.style.display = "block";
  renderizarJogoOnline(sala, rodada, souEscolhedor);
  btnProxima.style.display =
    rodada.status === "venceu" || rodada.status === "perdeu" ? "inline-block" : "none";
}

function renderizarJogoOnline(sala, rodada, souEscolhedor) {
  const certas = rodada.letrasCertas || {};
  const erradas = rodada.letrasErradas || {};
  const numErradas = Object.keys(erradas).length + (rodada.dicaUsada ? 1 : 0);

  document.getElementById("figuraOnline").textContent = ESTAGIOS[Math.min(numErradas, MAX_ERROS)];
  document.getElementById("palavraOnline").textContent = rodada.palavra
    .split("")
    .map((l) => (certas[l] ? l : "_"))
    .join(" ");

  const elStatusOnline = document.getElementById("statusOnline");
  if (rodada.status === "venceu") {
    elStatusOnline.textContent = souEscolhedor
      ? `😢 ${sala.jogadores.adivinhador} acertou a palavra!`
      : "🎉 Você acertou!";
    elStatusOnline.className = souEscolhedor ? "status-msg lose" : "status-msg win";
  } else if (rodada.status === "perdeu") {
    elStatusOnline.textContent = souEscolhedor
      ? `🎉 ${sala.jogadores.adivinhador} não conseguiu! A palavra era ${rodada.palavra}.`
      : `💀 Você perdeu! A palavra era ${rodada.palavra}.`;
    elStatusOnline.className = souEscolhedor ? "status-msg win" : "status-msg lose";
  } else {
    elStatusOnline.textContent = souEscolhedor ? "Aguardando o adversário tentar..." : "";
    elStatusOnline.className = "status-msg";
  }

  const fimDeRodada = rodada.status === "venceu" || rodada.status === "perdeu";

  const areaDica = document.getElementById("areaDica");
  const btnVerDica = document.getElementById("btnVerDica");
  const textoDicaRevelada = document.getElementById("textoDicaRevelada");
  if (!souEscolhedor && rodada.dica) {
    areaDica.style.display = "block";
    if (rodada.dicaUsada || fimDeRodada) {
      btnVerDica.style.display = "none";
      textoDicaRevelada.style.display = "block";
      textoDicaRevelada.textContent = `💡 Dica: ${rodada.dica}`;
    } else {
      btnVerDica.style.display = "inline-block";
      textoDicaRevelada.style.display = "none";
    }
  } else {
    areaDica.style.display = "none";
  }

  const teclado = document.getElementById("tecladoOnline");
  teclado.innerHTML = "";
  for (const letra of ALFABETO) {
    const btn = document.createElement("button");
    btn.className = "tecla";
    btn.textContent = letra;
    if (certas[letra]) btn.classList.add("certa");
    if (erradas[letra]) btn.classList.add("errada");

    const podeClicar = !souEscolhedor && !fimDeRodada && !certas[letra] && !erradas[letra];
    btn.disabled = !podeClicar;
    if (podeClicar) btn.addEventListener("click", () => chutarOnline(letra));
    teclado.appendChild(btn);
  }
}

document.getElementById("formPalavra").addEventListener("submit", (e) => {
  e.preventDefault();
  if (!salaAtual) return;
  const inputPalavra = document.getElementById("inputPalavra");
  const inputDica = document.getElementById("inputDica");
  const palavra = inputPalavra.value
    .normalize("NFD")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
  if (!palavra) return;
  const dica = inputDica.value.trim().slice(0, 80);

  refSala(JOGO, salaAtual.id).update({
    rodada: { palavra, dica, dicaUsada: false, letrasCertas: {}, letrasErradas: {}, status: "jogando" },
  });
  inputPalavra.value = "";
  inputDica.value = "";
});

// Usa transaction() em vez de once()+update(): se o jogador clicar em duas
// letras rapidamente (ou clicar numa letra logo depois de ver a dica), as
// duas ações competem pelo mesmo dado no Firebase. Com once()+update() a
// segunda leitura pode pegar o valor desatualizado e sobrescrever a
// primeira jogada. transaction() resolve isso tentando de novo
// automaticamente com o valor mais recente do servidor até conseguir.
function chutarOnline(letra) {
  if (!salaAtual) return;
  const rodadaRef = refSala(JOGO, salaAtual.id).child("rodada");

  rodadaRef.transaction((rodada) => {
    if (!rodada || rodada.status !== "jogando") return rodada;
    const certas = rodada.letrasCertas || {};
    const erradas = rodada.letrasErradas || {};
    if (certas[letra] || erradas[letra]) return rodada;

    if (rodada.palavra.includes(letra)) {
      certas[letra] = true;
    } else {
      erradas[letra] = true;
    }

    const ganhou = rodada.palavra.split("").every((l) => certas[l]);
    const totalErros = Object.keys(erradas).length + (rodada.dicaUsada ? 1 : 0);
    const perdeu = totalErros >= MAX_ERROS;

    rodada.letrasCertas = certas;
    rodada.letrasErradas = erradas;
    if (ganhou) rodada.status = "venceu";
    else if (perdeu) rodada.status = "perdeu";
    return rodada;
  }, (erro, sucesso, snapshot) => {
    if (sucesso && snapshot.val() && snapshot.val().status === "venceu") {
      const eu = getUser();
      refSala(JOGO, salaAtual.id)
        .child(`placar/${eu}`)
        .transaction((v) => (v || 0) + 1);
    }
  });
}

function verDicaOnline() {
  if (!salaAtual) return;
  const rodadaRef = refSala(JOGO, salaAtual.id).child("rodada");

  rodadaRef.transaction((rodada) => {
    if (!rodada || rodada.status !== "jogando" || rodada.dicaUsada || !rodada.dica) return rodada;

    const erradas = rodada.letrasErradas || {};
    const totalErros = Object.keys(erradas).length + 1;

    rodada.dicaUsada = true;
    if (totalErros >= MAX_ERROS) rodada.status = "perdeu";
    return rodada;
  });
}

document.getElementById("btnVerDica").addEventListener("click", verDicaOnline);

document.getElementById("btnProximaRodada").addEventListener("click", () => {
  if (!salaAtual) return;
  refSala(JOGO, salaAtual.id)
    .once("value")
    .then((snap) => {
      const sala = snap.val();
      if (!sala) return;
      refSala(JOGO, salaAtual.id).update({
        jogadores: {
          escolhedor: sala.jogadores.adivinhador,
          adivinhador: sala.jogadores.escolhedor,
        },
        rodada: { palavra: "", dica: "", dicaUsada: false, letrasCertas: {}, letrasErradas: {}, status: "escolhendo" },
      });
    });
});

function sairDaSalaClique() {
  if (salaAtual) {
    sairDaSala(JOGO, salaAtual.id);
  }
  salaAtual = null;
  areaOnlineJogo.style.display = "none";
  areaOnlineLobby.style.display = "block";
  document.getElementById("painelAguardando").style.display = "none";
}

document.getElementById("btnSairSala").addEventListener("click", sairDaSalaClique);
document.getElementById("btnCancelarConvite").addEventListener("click", sairDaSalaClique);

/* ========================================================================
   INÍCIO
   ======================================================================== */

novaPalavra();
if (lerSalaLocal(JOGO)) {
  definirModoJogo("online");
} else {
  definirModoJogo("solo");
  // se já tiver um convite pendente esperando, mostra a aba Online direto
  // em vez de deixar escondido atrás do botão "Online (1 x 1)"
  refConvitesDe(JOGO, getUser())
    .once("value")
    .then((snap) => {
      if (snap.exists()) definirModoJogo("online");
    });
}
