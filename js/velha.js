const JOGO = "velha";

const LINHAS_VENCEDORAS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

/* ========================================================================
   MODOS LOCAL (2 jogadores no mesmo aparelho) e CONTRA O COMPUTADOR
   ======================================================================== */

let tabuleiro = Array(9).fill(null);
let jogadorAtual = "X";
let modoCpu = false;
let fimDeJogoLocal = false;
let placarLocal = { X: 0, O: 0, empate: 0 };

const elBoard = document.getElementById("board");
const elStatus = document.getElementById("status");
const btnNovo = document.getElementById("btnNovo");

function montarTabuleiro() {
  elBoard.innerHTML = "";
  tabuleiro.forEach((valor, i) => {
    const btn = document.createElement("button");
    btn.className = "velha-cel";
    btn.textContent = valor || "";
    btn.disabled = !!valor || fimDeJogoLocal;
    btn.addEventListener("click", () => jogarLocal(i));
    elBoard.appendChild(btn);
  });
}

function jogarLocal(indice) {
  if (fimDeJogoLocal || tabuleiro[indice]) return;

  tabuleiro[indice] = jogadorAtual;
  montarTabuleiro();

  const vencedor = checarVencedorArray(tabuleiro);
  if (vencedor) {
    return finalizarLocal(vencedor);
  }
  if (tabuleiro.every((c) => c)) {
    return finalizarLocal("empate");
  }

  jogadorAtual = jogadorAtual === "X" ? "O" : "X";
  atualizarStatusLocal();

  if (modoCpu && jogadorAtual === "O" && !fimDeJogoLocal) {
    setTimeout(jogadaCpu, 400);
  }
}

function jogadaCpu() {
  if (fimDeJogoLocal) return;
  const indice = escolherJogadaCpu();
  if (indice !== -1) jogarLocal(indice);
}

function escolherJogadaCpu() {
  let jogada = encontrarJogadaDecisiva("O");
  if (jogada !== -1) return jogada;

  jogada = encontrarJogadaDecisiva("X");
  if (jogada !== -1) return jogada;

  if (!tabuleiro[4]) return 4;

  const cantos = [0, 2, 6, 8].filter((i) => !tabuleiro[i]);
  if (cantos.length) return cantos[Math.floor(Math.random() * cantos.length)];

  const livres = tabuleiro.map((v, i) => (v ? null : i)).filter((i) => i !== null);
  return livres.length ? livres[Math.floor(Math.random() * livres.length)] : -1;
}

function encontrarJogadaDecisiva(jogador) {
  for (const linha of LINHAS_VENCEDORAS) {
    const valores = linha.map((i) => tabuleiro[i]);
    const vazios = linha.filter((i) => !tabuleiro[i]);
    const ocupadasPeloJogador = valores.filter((v) => v === jogador).length;
    if (ocupadasPeloJogador === 2 && vazios.length === 1) {
      return vazios[0];
    }
  }
  return -1;
}

function checarVencedorArray(t) {
  for (const linha of LINHAS_VENCEDORAS) {
    const [a, b, c] = linha;
    if (t[a] && t[a] === t[b] && t[a] === t[c]) {
      return t[a];
    }
  }
  return null;
}

function finalizarLocal(resultado) {
  fimDeJogoLocal = true;
  montarTabuleiro();
  if (resultado === "empate") {
    placarLocal.empate++;
    elStatus.textContent = "🤝 Empate!";
  } else {
    placarLocal[resultado]++;
    elStatus.textContent = `🎉 Jogador ${resultado} venceu!`;
  }
  atualizarPlacarLocal();
}

function atualizarStatusLocal() {
  if (!fimDeJogoLocal) {
    elStatus.textContent = `Vez do jogador ${jogadorAtual}`;
  }
}

function atualizarPlacarLocal() {
  document.getElementById("placarX").textContent = placarLocal.X;
  document.getElementById("placarO").textContent = placarLocal.O;
  document.getElementById("placarEmpate").textContent = placarLocal.empate;
}

function novaPartidaLocal() {
  tabuleiro = Array(9).fill(null);
  jogadorAtual = "X";
  fimDeJogoLocal = false;
  montarTabuleiro();
  atualizarStatusLocal();
}

function definirModoLocal(cpu) {
  modoCpu = cpu;
  btnModoCpu.classList.toggle("btn-primary", cpu);
  btnModoCpu.classList.toggle("btn-secondary", !cpu);
  btnModo2p.classList.toggle("btn-primary", !cpu);
  btnModo2p.classList.toggle("btn-secondary", cpu);
  novaPartidaLocal();
}

btnNovo.addEventListener("click", novaPartidaLocal);

/* ========================================================================
   SELETOR DE MODO PRINCIPAL (local/cpu x online)
   ======================================================================== */

const btnModo2p = document.getElementById("btnModo2p");
const btnModoCpu = document.getElementById("btnModoCpu");
const btnModoOnline = document.getElementById("btnModoOnline");
const areaLocal = document.getElementById("areaLocal");
const areaOnlineLobby = document.getElementById("areaOnlineLobby");
const areaOnlineJogo = document.getElementById("areaOnlineJogo");

let modoPrincipal = "local";
let salaAtual = null;

function irParaModoLocal(cpu) {
  if (modoPrincipal === "online") {
    pararDeEscutarConvites(JOGO);
    if (salaAtual) {
      sairDaSala(JOGO, salaAtual.id);
      salaAtual = null;
    }
    areaOnlineLobby.style.display = "none";
    areaOnlineJogo.style.display = "none";
  }
  modoPrincipal = "local";
  areaLocal.style.display = "block";
  btnModoOnline.classList.remove("btn-primary");
  btnModoOnline.classList.add("btn-secondary");
  definirModoLocal(cpu);
}

function irParaModoOnline() {
  if (modoPrincipal !== "online") {
    areaLocal.style.display = "none";
    montarSelectOponentes();
    escutarConvites(JOGO, renderizarConvites);
  }
  modoPrincipal = "online";
  btnModo2p.classList.remove("btn-primary");
  btnModo2p.classList.add("btn-secondary");
  btnModoCpu.classList.remove("btn-primary");
  btnModoCpu.classList.add("btn-secondary");
  btnModoOnline.classList.remove("btn-secondary");
  btnModoOnline.classList.add("btn-primary");

  if (!salaAtual) {
    const salaSalva = lerSalaLocal(JOGO);
    if (salaSalva) {
      salaAtual = { id: salaSalva };
      escutarSala(salaSalva);
    }
  }

  areaOnlineLobby.style.display = salaAtual ? "none" : "block";
  areaOnlineJogo.style.display = salaAtual ? "block" : "none";
}

btnModo2p.addEventListener("click", () => irParaModoLocal(false));
btnModoCpu.addEventListener("click", () => irParaModoLocal(true));
btnModoOnline.addEventListener("click", irParaModoOnline);

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
    texto.textContent = `${c.de} te chamou para jogar Jogo da Velha`;

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
    jogadores: { X: eu, O: oponente },
    tabuleiro: {},
    vez: "X",
    vencedor: "",
    placar: { [eu]: 0, [oponente]: 0, empates: 0 },
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
    renderizarSalaVelha(sala);
  });
}

function renderizarSalaVelha(sala) {
  const eu = getUser();

  if (sala.status === "aguardando") {
    areaOnlineLobby.style.display = "block";
    areaOnlineJogo.style.display = "none";
    document.getElementById("painelAguardando").style.display = "block";
    document.getElementById("textoAguardando").textContent =
      `Aguardando ${sala.jogadores.O} aceitar...`;
    return;
  }

  areaOnlineLobby.style.display = "none";
  areaOnlineJogo.style.display = "block";

  const meuSimbolo = sala.jogadores.X === eu ? "X" : "O";

  document.getElementById("onlineJogadores").innerHTML =
    `<span class="${meuSimbolo === "X" ? "voce" : ""}">❌ ${sala.jogadores.X}</span>` +
    `<span class="${meuSimbolo === "O" ? "voce" : ""}">⭕ ${sala.jogadores.O}</span>`;

  const placar = sala.placar || {};
  document.getElementById("onlinePlacar").innerHTML =
    `<span>❌ ${placar[sala.jogadores.X] || 0}</span>` +
    `<span>⭕ ${placar[sala.jogadores.O] || 0}</span>` +
    `<span>🤝 ${placar.empates || 0}</span>`;

  const elStatusOnline = document.getElementById("statusOnline");
  const btnNovaOnline = document.getElementById("btnNovaOnline");

  if (sala.vencedor === "empate") {
    elStatusOnline.textContent = "🤝 Empate!";
    elStatusOnline.className = "status-msg";
    btnNovaOnline.style.display = "inline-block";
  } else if (sala.vencedor === "X" || sala.vencedor === "O") {
    const nomeVencedor = sala.jogadores[sala.vencedor];
    const souVencedor = nomeVencedor === eu;
    elStatusOnline.textContent = souVencedor ? "🎉 Você venceu!" : `😢 ${nomeVencedor} venceu!`;
    elStatusOnline.className = souVencedor ? "status-msg win" : "status-msg lose";
    btnNovaOnline.style.display = "inline-block";
  } else {
    const minhaVez = sala.vez === meuSimbolo;
    elStatusOnline.textContent = minhaVez ? "Sua vez!" : `Vez de ${sala.jogadores[sala.vez]}...`;
    elStatusOnline.className = "status-msg";
    btnNovaOnline.style.display = "none";
  }

  renderizarBoardOnline(sala, meuSimbolo);
}

function renderizarBoardOnline(sala, meuSimbolo) {
  const board = document.getElementById("boardOnline");
  board.innerHTML = "";
  const tab = sala.tabuleiro || {};
  const fimDeJogoOnline = !!sala.vencedor;
  const minhaVez = sala.vez === meuSimbolo && !fimDeJogoOnline;

  for (let i = 0; i < 9; i++) {
    const valor = tab[i] || "";
    const btn = document.createElement("button");
    btn.className = "velha-cel";
    btn.textContent = valor;
    btn.disabled = !!valor || !minhaVez;
    if (!valor && minhaVez) {
      btn.addEventListener("click", () => jogarOnline(i));
    }
    board.appendChild(btn);
  }
}

function jogarOnline(indice) {
  if (!salaAtual) return;
  const salaRef = refSala(JOGO, salaAtual.id);

  salaRef.once("value").then((snap) => {
    const sala = snap.val();
    if (!sala || sala.vencedor) return;
    const eu = getUser();
    const meuSimbolo = sala.jogadores.X === eu ? "X" : "O";
    if (sala.vez !== meuSimbolo) return;
    const tab = sala.tabuleiro || {};
    if (tab[indice]) return;
    tab[indice] = meuSimbolo;

    const vencedor = checarVencedorArray(tab);
    const cheio = Object.keys(tab).length === 9;
    const atualizacoes = { tabuleiro: tab };
    if (vencedor) {
      atualizacoes.vencedor = vencedor;
    } else if (cheio) {
      atualizacoes.vencedor = "empate";
    } else {
      atualizacoes.vez = meuSimbolo === "X" ? "O" : "X";
    }

    salaRef.update(atualizacoes).then(() => {
      if (vencedor) {
        const nomeVencedor = sala.jogadores[vencedor];
        salaRef.child(`placar/${nomeVencedor}`).transaction((v) => (v || 0) + 1);
      } else if (cheio) {
        salaRef.child("placar/empates").transaction((v) => (v || 0) + 1);
      }
    });
  });
}

document.getElementById("btnNovaOnline").addEventListener("click", () => {
  if (!salaAtual) return;
  refSala(JOGO, salaAtual.id).update({ tabuleiro: {}, vencedor: "", vez: "X" });
});

function sairDaSalaClique() {
  if (salaAtual) sairDaSala(JOGO, salaAtual.id);
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

if (lerSalaLocal(JOGO)) {
  irParaModoOnline();
} else {
  definirModoLocal(false);
  refConvitesDe(JOGO, getUser())
    .once("value")
    .then((snap) => {
      if (snap.exists()) irParaModoOnline();
    });
}
