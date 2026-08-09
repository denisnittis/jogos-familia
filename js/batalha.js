const JOGO = "batalha";

const FROTA = [
  { id: "porta", nome: "Porta-Aviões", tamanho: 5 },
  { id: "encouracado", nome: "Encouraçado", tamanho: 4 },
  { id: "cruzador", nome: "Cruzador", tamanho: 3 },
  { id: "submarino", nome: "Submarino", tamanho: 3 },
  { id: "destroyer", nome: "Contratorpedeiro", tamanho: 2 },
];

const TAM_TABULEIRO = 10;

/* ========================================================================
   HELPERS GERAIS (usados tanto no modo CPU quanto Online)
   ======================================================================== */

function calcularCelulasNavio(r, c, tamanho, orientacao) {
  const celulas = [];
  for (let i = 0; i < tamanho; i++) {
    const rr = orientacao === "V" ? r + i : r;
    const cc = orientacao === "H" ? c + i : c;
    if (rr < 0 || rr >= TAM_TABULEIRO || cc < 0 || cc >= TAM_TABULEIRO) return null;
    celulas.push(`${rr}_${cc}`);
  }
  return celulas;
}

function gerarFrotaAleatoria() {
  const mapa = {};
  FROTA.forEach((navio) => {
    let colocado = false;
    let tentativas = 0;
    while (!colocado && tentativas < 300) {
      tentativas++;
      const orientacao = Math.random() < 0.5 ? "H" : "V";
      const r = Math.floor(Math.random() * TAM_TABULEIRO);
      const c = Math.floor(Math.random() * TAM_TABULEIRO);
      const celulas = calcularCelulasNavio(r, c, navio.tamanho, orientacao);
      if (celulas && celulas.every((cel) => !mapa[cel])) {
        celulas.forEach((cel) => (mapa[cel] = true));
        colocado = true;
      }
    }
  });
  return mapa;
}

// Agrupa as células de "navios" em componentes conexos e retorna o conjunto
// de células cujo componente está 100% coberto por acertos em "tiros".
function calcularCelulasAfundadas(navios, tiros) {
  const visitado = new Set();
  const afundadas = new Set();

  Object.keys(navios).forEach((inicio) => {
    if (visitado.has(inicio)) return;
    const componente = [];
    const fila = [inicio];
    visitado.add(inicio);
    while (fila.length) {
      const atual = fila.shift();
      componente.push(atual);
      const [r, c] = atual.split("_").map(Number);
      [`${r - 1}_${c}`, `${r + 1}_${c}`, `${r}_${c - 1}`, `${r}_${c + 1}`].forEach((viz) => {
        if (navios[viz] && !visitado.has(viz)) {
          visitado.add(viz);
          fila.push(viz);
        }
      });
    }
    if (componente.every((cel) => tiros[cel] === "acerto")) {
      componente.forEach((cel) => afundadas.add(cel));
    }
  });

  return afundadas;
}

function renderizarTabuleiroProprio(elId, navios, tirosRecebidos) {
  const afundadas = calcularCelulasAfundadas(navios, tirosRecebidos);
  const grid = document.getElementById(elId);
  grid.innerHTML = "";
  for (let r = 0; r < TAM_TABULEIRO; r++) {
    for (let c = 0; c < TAM_TABULEIRO; c++) {
      const key = `${r}_${c}`;
      const btn = document.createElement("button");
      btn.className = "naval-cel";
      btn.disabled = true;
      if (navios[key]) btn.classList.add("navio");
      if (tirosRecebidos[key] === "agua") btn.classList.add("agua");
      if (tirosRecebidos[key] === "acerto") btn.classList.add("acerto");
      if (afundadas.has(key)) btn.classList.add("afundado");
      grid.appendChild(btn);
    }
  }
}

function renderizarTabuleiroInimigo(elId, naviosInimigo, meusTiros, podeAtirar, aoClicar) {
  const afundadas = calcularCelulasAfundadas(naviosInimigo, meusTiros);
  const grid = document.getElementById(elId);
  grid.innerHTML = "";
  for (let r = 0; r < TAM_TABULEIRO; r++) {
    for (let c = 0; c < TAM_TABULEIRO; c++) {
      const key = `${r}_${c}`;
      const btn = document.createElement("button");
      btn.className = "naval-cel";
      const tiro = meusTiros[key];
      if (tiro === "agua") btn.classList.add("agua");
      if (tiro === "acerto") btn.classList.add("acerto");
      if (afundadas.has(key)) btn.classList.add("afundado");

      const podeClicarAqui = podeAtirar && !tiro;
      btn.disabled = !podeClicarAqui;
      if (podeClicarAqui) btn.addEventListener("click", () => aoClicar(r, c));
      grid.appendChild(btn);
    }
  }
}

/* ========================================================================
   POSICIONAMENTO DOS NAVIOS (compartilhado entre os modos CPU e Online)
   ======================================================================== */

let meusNavios = {};
let naviosColocados = {}; // { navioId: [celulas...] }
let navioSelecionado = null;
let orientacaoAtual = "H";

function montarBotoesFrota() {
  const container = document.getElementById("frotaBotoes");
  container.innerHTML = "";
  FROTA.forEach((navio) => {
    const btn = document.createElement("button");
    btn.className = "naval-navio-btn";
    btn.textContent = `${navio.nome} (${navio.tamanho})`;
    btn.dataset.navioId = navio.id;
    btn.addEventListener("click", () => {
      if (naviosColocados[navio.id]) return;
      navioSelecionado = navio.id;
      atualizarBotoesFrota();
    });
    container.appendChild(btn);
  });
  navioSelecionado = FROTA[0].id;
  atualizarBotoesFrota();
}

function atualizarBotoesFrota() {
  document.querySelectorAll(".naval-navio-btn").forEach((btn) => {
    const id = btn.dataset.navioId;
    btn.disabled = !!naviosColocados[id];
    btn.classList.toggle("selecionado", navioSelecionado === id);
  });
  document.getElementById("btnPosPronto").disabled =
    Object.keys(naviosColocados).length < FROTA.length;
}

function selecionarProximoNavioDisponivel() {
  const proximo = FROTA.find((n) => !naviosColocados[n.id]);
  navioSelecionado = proximo ? proximo.id : null;
  atualizarBotoesFrota();
}

function renderizarTabuleiroPosicionamento() {
  const grid = document.getElementById("gridPosicionamento");
  grid.innerHTML = "";
  for (let r = 0; r < TAM_TABULEIRO; r++) {
    for (let c = 0; c < TAM_TABULEIRO; c++) {
      const key = `${r}_${c}`;
      const btn = document.createElement("button");
      btn.className = "naval-cel";
      if (meusNavios[key]) btn.classList.add("navio");
      btn.addEventListener("click", () => clicarPosicionamento(r, c));
      grid.appendChild(btn);
    }
  }
}

function clicarPosicionamento(r, c) {
  if (!navioSelecionado) return;
  const navio = FROTA.find((n) => n.id === navioSelecionado);
  if (!navio || naviosColocados[navio.id]) return;

  const celulas = calcularCelulasNavio(r, c, navio.tamanho, orientacaoAtual);
  if (!celulas || !celulas.every((cel) => !meusNavios[cel])) {
    alert("Posição inválida: fora do tabuleiro ou em cima de outro navio.");
    return;
  }

  celulas.forEach((cel) => (meusNavios[cel] = true));
  naviosColocados[navio.id] = celulas;
  renderizarTabuleiroPosicionamento();
  selecionarProximoNavioDisponivel();
}

document.getElementById("btnGirar").addEventListener("click", () => {
  orientacaoAtual = orientacaoAtual === "H" ? "V" : "H";
  document.getElementById("btnGirar").textContent =
    orientacaoAtual === "H" ? "Orientação: Horizontal ↔" : "Orientação: Vertical ↕";
});

document.getElementById("btnAleatorio").addEventListener("click", () => {
  FROTA.forEach((navio) => {
    if (naviosColocados[navio.id]) return;
    let colocado = false;
    let tentativas = 0;
    while (!colocado && tentativas < 300) {
      tentativas++;
      const orientacao = Math.random() < 0.5 ? "H" : "V";
      const r = Math.floor(Math.random() * TAM_TABULEIRO);
      const c = Math.floor(Math.random() * TAM_TABULEIRO);
      const celulas = calcularCelulasNavio(r, c, navio.tamanho, orientacao);
      if (celulas && celulas.every((cel) => !meusNavios[cel])) {
        celulas.forEach((cel) => (meusNavios[cel] = true));
        naviosColocados[navio.id] = celulas;
        colocado = true;
      }
    }
  });
  renderizarTabuleiroPosicionamento();
  selecionarProximoNavioDisponivel();
});

function reiniciarPosicionamento() {
  meusNavios = {};
  naviosColocados = {};
  orientacaoAtual = "H";
  document.getElementById("btnGirar").textContent = "Orientação: Horizontal ↔";
  montarBotoesFrota();
  renderizarTabuleiroPosicionamento();
}

document.getElementById("btnReiniciarPosicionamento").addEventListener("click", reiniciarPosicionamento);

document.getElementById("btnPosPronto").addEventListener("click", () => {
  if (Object.keys(naviosColocados).length < FROTA.length) return;
  if (modoBatalha === "cpu") {
    iniciarBatalhaCpu();
  } else {
    ficarProntoOnline();
  }
});

/* ========================================================================
   MODO CONTRA O COMPUTADOR
   ======================================================================== */

let naviosCpu = {};
let meusTirosCpu = {}; // tiros que EU dei no tabuleiro do CPU
let tirosDoCpu = {}; // tiros que o CPU deu no MEU tabuleiro
let faseCpu = "posicionando";
let turnoCpu = null;

function iniciarBatalhaCpu() {
  naviosCpu = gerarFrotaAleatoria();
  meusTirosCpu = {};
  tirosDoCpu = {};
  faseCpu = "jogando";
  turnoCpu = "voce";

  areaPosicionamento.style.display = "none";
  areaBatalha.style.display = "block";
  document.getElementById("onlineInfoBatalha").style.display = "none";
  document.getElementById("btnSairSalaBatalha").style.display = "none";
  document.getElementById("btnBatalhaNova").style.display = "none";

  renderizarBatalhaCpu();
}

function renderizarBatalhaCpu() {
  renderizarTabuleiroProprio("gridMeu", meusNavios, tirosDoCpu);
  const podeAtirar = turnoCpu === "voce" && faseCpu !== "finalizado";
  renderizarTabuleiroInimigo("gridInimigo", naviosCpu, meusTirosCpu, podeAtirar, atirarCpu);

  if (faseCpu !== "finalizado") {
    const elStatus = document.getElementById("statusBatalha");
    elStatus.textContent =
      turnoCpu === "voce" ? "Sua vez! Atire no tabuleiro do computador." : "Vez do computador...";
    elStatus.className = "status-msg";
  }
}

function atirarCpu(r, c) {
  if (turnoCpu !== "voce" || faseCpu === "finalizado") return;
  const key = `${r}_${c}`;
  if (meusTirosCpu[key]) return;

  meusTirosCpu[key] = naviosCpu[key] ? "acerto" : "agua";

  const totalCpu = Object.keys(naviosCpu).length;
  const acertosCpu = Object.values(meusTirosCpu).filter((v) => v === "acerto").length;
  if (acertosCpu >= totalCpu) {
    return finalizarBatalhaCpu("voce");
  }

  turnoCpu = "cpu";
  renderizarBatalhaCpu();
  setTimeout(jogadaCpuBatalha, 600);
}

function jogadaCpuBatalha() {
  const key = escolherTiroCpu();
  tirosDoCpu[key] = meusNavios[key] ? "acerto" : "agua";

  const totalMeu = Object.keys(meusNavios).length;
  const acertosMeu = Object.values(tirosDoCpu).filter((v) => v === "acerto").length;
  if (acertosMeu >= totalMeu) {
    return finalizarBatalhaCpu("cpu");
  }

  turnoCpu = "voce";
  renderizarBatalhaCpu();
}

function escolherTiroCpu() {
  const afundadas = calcularCelulasAfundadas(meusNavios, tirosDoCpu);
  const alvos = [];
  Object.keys(tirosDoCpu).forEach((key) => {
    if (tirosDoCpu[key] !== "acerto" || afundadas.has(key)) return;
    const [r, c] = key.split("_").map(Number);
    [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]].forEach(([rr, cc]) => {
      const k2 = `${rr}_${cc}`;
      if (rr >= 0 && rr < TAM_TABULEIRO && cc >= 0 && cc < TAM_TABULEIRO && !tirosDoCpu[k2] && !alvos.includes(k2)) {
        alvos.push(k2);
      }
    });
  });
  if (alvos.length) return alvos[Math.floor(Math.random() * alvos.length)];

  let key;
  do {
    key = `${Math.floor(Math.random() * TAM_TABULEIRO)}_${Math.floor(Math.random() * TAM_TABULEIRO)}`;
  } while (tirosDoCpu[key]);
  return key;
}

function finalizarBatalhaCpu(vencedor) {
  faseCpu = "finalizado";
  turnoCpu = null;

  const elStatus = document.getElementById("statusBatalha");
  if (vencedor === "voce") {
    elStatus.textContent = "🎉 Você afundou toda a frota inimiga!";
    elStatus.className = "status-msg win";
  } else {
    elStatus.textContent = "💀 O computador afundou sua frota!";
    elStatus.className = "status-msg lose";
  }
  document.getElementById("btnBatalhaNova").style.display = "inline-block";
  renderizarBatalhaCpu();
}

/* ========================================================================
   SELETOR DE MODO PRINCIPAL (cpu x online)
   ======================================================================== */

const btnModoCpuBatalha = document.getElementById("btnModoCpuBatalha");
const btnModoOnlineBatalha = document.getElementById("btnModoOnlineBatalha");
const areaOnlineLobby = document.getElementById("areaOnlineLobby");
const areaPosicionamento = document.getElementById("areaPosicionamento");
const areaBatalha = document.getElementById("areaBatalha");

let modoBatalha = "cpu";
let salaAtual = null;
let papelAtual = null; // "A" ou "B" na sala online atual

function irParaModoCpuBatalha() {
  if (modoBatalha === "online") {
    pararDeEscutarConvites(JOGO);
    if (salaAtual) {
      sairDaSala(JOGO, salaAtual.id);
      salaAtual = null;
    }
    areaOnlineLobby.style.display = "none";
  }
  modoBatalha = "cpu";
  btnModoCpuBatalha.classList.add("btn-primary");
  btnModoCpuBatalha.classList.remove("btn-secondary");
  btnModoOnlineBatalha.classList.add("btn-secondary");
  btnModoOnlineBatalha.classList.remove("btn-primary");

  faseCpu = "posicionando";
  reiniciarPosicionamento();
  areaBatalha.style.display = "none";
  areaPosicionamento.style.display = "block";
  document.getElementById("painelEsperaPosicionamento").style.display = "none";
  document.getElementById("gridPosicionamento").style.pointerEvents = "auto";
}

function irParaModoOnlineBatalha() {
  if (modoBatalha !== "online") {
    areaPosicionamento.style.display = "none";
    areaBatalha.style.display = "none";
    montarSelectOponentes();
    escutarConvites(JOGO, renderizarConvites);
  }
  modoBatalha = "online";
  btnModoOnlineBatalha.classList.add("btn-primary");
  btnModoOnlineBatalha.classList.remove("btn-secondary");
  btnModoCpuBatalha.classList.add("btn-secondary");
  btnModoCpuBatalha.classList.remove("btn-primary");

  if (!salaAtual) {
    const salaSalva = lerSalaLocal(JOGO);
    if (salaSalva) {
      salaAtual = { id: salaSalva };
      reiniciarPosicionamento();
      escutarSala(salaSalva);
    }
  }

  areaOnlineLobby.style.display = salaAtual ? "none" : "block";
}

btnModoCpuBatalha.addEventListener("click", irParaModoCpuBatalha);
btnModoOnlineBatalha.addEventListener("click", irParaModoOnlineBatalha);

/* ========================================================================
   MODO ONLINE (1 x 1)
   ======================================================================== */

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
    texto.textContent = `${c.de} te chamou para jogar Batalha Naval`;

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
    jogadores: { A: eu, B: oponente },
    fase: "posicionando",
    navios: {},
    prontos: { A: false, B: false },
    tiros: {},
    vez: "A",
    vencedor: "",
    placar: { [eu]: 0, [oponente]: 0 },
    status: "aguardando",
    criadoEm: firebase.database.ServerValue.TIMESTAMP,
  };

  criarSalaEConvidar(JOGO, oponente, dadosIniciais, (salaId) => {
    salaAtual = { id: salaId };
    reiniciarPosicionamento();
    escutarSala(salaId);
  });
});

function aceitarConvite(conviteId, salaId) {
  removerConvite(JOGO, conviteId);
  refSala(JOGO, salaId)
    .update({ status: "jogando" })
    .then(() => {
      salaAtual = { id: salaId };
      reiniciarPosicionamento();
      escutarSala(salaId);
    });
}

function escutarSala(salaId) {
  salvarSalaLocal(JOGO, salaId);
  refSala(JOGO, salaId).on("value", (snap) => {
    const sala = snap.val();
    if (!sala) {
      salaAtual = null;
      papelAtual = null;
      limparSalaLocal(JOGO);
      areaPosicionamento.style.display = "none";
      areaBatalha.style.display = "none";
      areaOnlineLobby.style.display = "block";
      document.getElementById("painelAguardando").style.display = "none";
      return;
    }
    renderizarSalaBatalha(sala);
  });
}

function renderizarSalaBatalha(sala) {
  const eu = getUser();

  if (sala.status === "aguardando") {
    areaOnlineLobby.style.display = "block";
    areaPosicionamento.style.display = "none";
    areaBatalha.style.display = "none";
    document.getElementById("painelAguardando").style.display = "block";
    document.getElementById("textoAguardando").textContent = `Aguardando ${sala.jogadores.B} aceitar...`;
    return;
  }

  areaOnlineLobby.style.display = "none";
  papelAtual = sala.jogadores.A === eu ? "A" : "B";
  const papelInimigo = papelAtual === "A" ? "B" : "A";
  const prontos = sala.prontos || {};

  if (sala.fase === "posicionando") {
    areaPosicionamento.style.display = "block";
    areaBatalha.style.display = "none";

    const painelEspera = document.getElementById("painelEsperaPosicionamento");
    const grid = document.getElementById("gridPosicionamento");
    if (prontos[papelAtual]) {
      painelEspera.style.display = "block";
      painelEspera.textContent = `Aguardando ${sala.jogadores[papelInimigo]} terminar de posicionar os navios...`;
      grid.style.pointerEvents = "none";
    } else {
      painelEspera.style.display = "none";
      grid.style.pointerEvents = "auto";
    }

    if (prontos.A && prontos.B) {
      refSala(JOGO, salaAtual.id).update({ fase: "jogando" });
    }
    return;
  }

  areaPosicionamento.style.display = "none";
  areaBatalha.style.display = "block";

  const navios = sala.navios || {};
  const tiros = sala.tiros || {};
  const meusNaviosSala = navios[papelAtual] || {};
  const naviosInimigoSala = navios[papelInimigo] || {};
  const meusTirosSala = tiros[papelAtual] || {};
  const tirosInimigoSala = tiros[papelInimigo] || {};

  document.getElementById("onlineInfoBatalha").style.display = "block";
  document.getElementById("btnSairSalaBatalha").style.display = "inline-block";

  document.getElementById("onlineJogadoresBatalha").innerHTML =
    `<span class="${papelAtual === "A" ? "voce" : ""}">${sala.jogadores.A}</span>` +
    `<span class="${papelAtual === "B" ? "voce" : ""}">${sala.jogadores.B}</span>`;

  const placar = sala.placar || {};
  document.getElementById("onlinePlacarBatalha").innerHTML = Object.keys(placar)
    .map((nome) => `<span>${nome}: ${placar[nome]}</span>`)
    .join("");

  const elStatus = document.getElementById("statusBatalha");
  const btnNova = document.getElementById("btnBatalhaNova");

  if (sala.vencedor) {
    const nomeVencedor = sala.jogadores[sala.vencedor];
    const souVencedor = sala.vencedor === papelAtual;
    elStatus.textContent = souVencedor ? "🎉 Você venceu!" : `😢 ${nomeVencedor} venceu!`;
    elStatus.className = souVencedor ? "status-msg win" : "status-msg lose";
    btnNova.style.display = "inline-block";
  } else {
    const minhaVez = sala.vez === papelAtual;
    elStatus.textContent = minhaVez
      ? "Sua vez! Atire no tabuleiro do adversário."
      : `Vez de ${sala.jogadores[sala.vez]}...`;
    elStatus.className = "status-msg";
    btnNova.style.display = "none";
  }

  renderizarTabuleiroProprio("gridMeu", meusNaviosSala, tirosInimigoSala);
  const podeAtirar = sala.vez === papelAtual && !sala.vencedor;
  renderizarTabuleiroInimigo("gridInimigo", naviosInimigoSala, meusTirosSala, podeAtirar, atirarOnline);
}

function ficarProntoOnline() {
  if (!salaAtual || !papelAtual) return;
  refSala(JOGO, salaAtual.id).update({
    [`navios/${papelAtual}`]: meusNavios,
    [`prontos/${papelAtual}`]: true,
  });
}

function atirarOnline(r, c) {
  if (!salaAtual) return;
  const key = `${r}_${c}`;
  const salaRef = refSala(JOGO, salaAtual.id);

  salaRef.once("value").then((snap) => {
    const sala = snap.val();
    if (!sala || sala.fase !== "jogando" || sala.vencedor) return;
    const eu = getUser();
    const meuPapel = sala.jogadores.A === eu ? "A" : "B";
    if (sala.vez !== meuPapel) return;

    const tiros = (sala.tiros && sala.tiros[meuPapel]) || {};
    if (tiros[key]) return;

    const papelInimigo = meuPapel === "A" ? "B" : "A";
    const naviosInimigo = (sala.navios && sala.navios[papelInimigo]) || {};
    tiros[key] = naviosInimigo[key] ? "acerto" : "agua";

    const totalNavios = Object.keys(naviosInimigo).length;
    const totalAcertos = Object.values(tiros).filter((v) => v === "acerto").length;
    const venceu = totalNavios > 0 && totalAcertos >= totalNavios;

    const atualizacoes = { [`tiros/${meuPapel}`]: tiros };
    if (venceu) {
      atualizacoes.vencedor = meuPapel;
      atualizacoes.fase = "finalizado";
    } else {
      atualizacoes.vez = papelInimigo;
    }

    salaRef.update(atualizacoes).then(() => {
      if (venceu) {
        const nomeVencedor = sala.jogadores[meuPapel];
        salaRef.child(`placar/${nomeVencedor}`).transaction((v) => (v || 0) + 1);
      }
    });
  });
}

document.getElementById("btnBatalhaNova").addEventListener("click", () => {
  if (modoBatalha === "cpu") {
    faseCpu = "posicionando";
    reiniciarPosicionamento();
    areaBatalha.style.display = "none";
    areaPosicionamento.style.display = "block";
    return;
  }

  if (!salaAtual) return;
  reiniciarPosicionamento();
  refSala(JOGO, salaAtual.id).update({
    fase: "posicionando",
    navios: {},
    prontos: { A: false, B: false },
    tiros: {},
    vencedor: "",
    vez: "A",
  });
});

function sairDaSalaBatalhaClique() {
  if (salaAtual) sairDaSala(JOGO, salaAtual.id);
  salaAtual = null;
  papelAtual = null;
  areaPosicionamento.style.display = "none";
  areaBatalha.style.display = "none";
  areaOnlineLobby.style.display = "block";
  document.getElementById("painelAguardando").style.display = "none";
}

document.getElementById("btnSairSalaBatalha").addEventListener("click", sairDaSalaBatalhaClique);
document.getElementById("btnCancelarConvite").addEventListener("click", sairDaSalaBatalhaClique);

/* ========================================================================
   INÍCIO
   ======================================================================== */

montarBotoesFrota();
renderizarTabuleiroPosicionamento();

if (lerSalaLocal(JOGO)) {
  irParaModoOnlineBatalha();
} else {
  irParaModoCpuBatalha();
}
