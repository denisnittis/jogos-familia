const JOGO = "forca";

// Partes do boneco, na ordem em que aparecem a cada erro.
const PARTES_BONECO = [
  '<circle cx="140" cy="62" r="16" />',
  '<line x1="140" y1="78" x2="140" y2="128" />',
  '<line x1="140" y1="92" x2="118" y2="112" />',
  '<line x1="140" y1="92" x2="162" y2="112" />',
  '<line x1="140" y1="128" x2="122" y2="158" />',
  '<line x1="140" y1="128" x2="158" y2="158" />',
];
const ROSTO_TRISTE =
  '<g class="rosto"><line x1="133" y1="57" x2="137" y2="61" /><line x1="137" y1="57" x2="133" y2="61" />' +
  '<line x1="143" y1="57" x2="147" y2="61" /><line x1="147" y1="57" x2="143" y2="61" />' +
  '<path d="M134 70 q6 -5 12 0" /></g>';

const MAX_ERROS = PARTES_BONECO.length;
const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const TEMPO_LETRA_MS = 60 * 1000;

// Desenha a forca com "erros" partes do boneco.
function desenharForca(el, erros) {
  const n = Math.min(erros, MAX_ERROS);
  if (el.dataset.erros === String(n)) return; // nada mudou
  // só a parte nova aparece com animação
  const anterior = Number(el.dataset.erros || 0);
  const partes = PARTES_BONECO.slice(0, n).map((parte, i) =>
    i >= anterior && n > anterior ? '<g class="nova">' + parte + "</g>" : parte
  );
  el.dataset.erros = String(n);
  el.innerHTML =
    '<svg viewBox="0 0 200 180" role="img" aria-label="Forca com ' + n + ' de ' + MAX_ERROS + ' erros">' +
    '<g class="forca-poste"><line x1="20" y1="170" x2="110" y2="170" /><line x1="50" y1="170" x2="50" y2="15" />' +
    '<line x1="48" y1="15" x2="142" y2="15" /><line x1="140" y1="15" x2="140" y2="46" />' +
    '<line x1="50" y1="45" x2="80" y2="15" /></g>' +
    '<g class="forca-boneco">' + partes.join("") + (n >= MAX_ERROS ? ROSTO_TRISTE : "") + "</g>" +
    "</svg>";
}

// Tira acento e cedilha: "JACARÉ" vira "JACARE", "ONÇA" vira "ONCA".
function semAcento(texto) {
  return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

/* ========================================================================
   MODO SOLO
   ======================================================================== */

const CATEGORIAS_FORCA = Object.keys(PALAVRAS_POR_CATEGORIA);

let categoriaEscolhida = lerLocal("forca-categoria", "Todas");
if (categoriaEscolhida !== "Todas" && !PALAVRAS_POR_CATEGORIA[categoriaEscolhida]) categoriaEscolhida = "Todas";
let sacola = []; // palavras ainda não sorteadas, pra não repetir logo
let palavraAtual = ""; // como é escrita, ex.: "JACARÉ"
let palavraBase = ""; // sem acento, ex.: "JACARE"
let categoriaAtual = "";
let letrasCertas = new Set();
let letrasErradas = new Set();
let fimDeJogoSolo = false;
let sequencia = Number(lerLocal("forca-sequencia", "0")) || 0;
let recorde = Number(lerLocal("forca-recorde", "0")) || 0;

const elFigura = document.getElementById("figura");
const elPalavra = document.getElementById("palavra");
const elStatus = document.getElementById("status");
const elTeclado = document.getElementById("teclado");
const btnNovo = document.getElementById("btnNovo");

function lerLocal(chave, padrao) {
  try {
    const v = localStorage.getItem(chave);
    return v === null ? padrao : v;
  } catch (e) {
    return padrao;
  }
}

function salvarLocal(chave, valor) {
  try {
    localStorage.setItem(chave, String(valor));
  } catch (e) {}
}

function montarCategorias() {
  const el = document.getElementById("categoriasForca");
  el.innerHTML = "";
  ["Todas", ...CATEGORIAS_FORCA].forEach((cat) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = cat;
    btn.classList.toggle("selecionado", cat === categoriaEscolhida);
    btn.addEventListener("click", () => {
      categoriaEscolhida = cat;
      salvarLocal("forca-categoria", cat);
      sacola = [];
      montarCategorias();
      novaPalavra();
    });
    el.appendChild(btn);
  });
}

function encherSacola() {
  const cats = categoriaEscolhida === "Todas" ? CATEGORIAS_FORCA : [categoriaEscolhida];
  sacola = [];
  cats.forEach((cat) => PALAVRAS_POR_CATEGORIA[cat].forEach((palavra) => sacola.push({ palavra, cat })));
  for (let i = sacola.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [sacola[i], sacola[j]] = [sacola[j], sacola[i]];
  }
}

function novaPalavra() {
  if (!sacola.length) encherSacola();
  const sorteada = sacola.pop();
  palavraAtual = sorteada.palavra;
  palavraBase = semAcento(palavraAtual);
  categoriaAtual = sorteada.cat;
  letrasCertas = new Set();
  letrasErradas = new Set();
  fimDeJogoSolo = false;
  elStatus.textContent = "";
  elStatus.className = "status-msg";
  document.getElementById("categoriaAtual").textContent = "Categoria: " + categoriaAtual;
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
  if (fimDeJogoSolo || letrasCertas.has(letra) || letrasErradas.has(letra)) return;

  const botoes = elTeclado.querySelectorAll(".tecla");
  const botao = Array.from(botoes).find((b) => b.textContent === letra);

  if (palavraBase.includes(letra)) {
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

function ehLetra(ch) {
  return ch >= "A" && ch <= "Z";
}

function verificarFimSolo() {
  const ganhou = palavraBase.split("").every((letra) => !ehLetra(letra) || letrasCertas.has(letra));

  if (ganhou) {
    fimDeJogoSolo = true;
    sequencia++;
    if (sequencia > recorde) recorde = sequencia;
    elStatus.textContent = sequencia > 1 ? `🎉 Acertou! ${sequencia} seguidas!` : "🎉 Você ganhou!";
    elStatus.className = "status-msg win";
    desabilitarTecladoSolo();
  } else if (letrasErradas.size >= MAX_ERROS) {
    fimDeJogoSolo = true;
    sequencia = 0;
    elStatus.textContent = "💀 Você perdeu! A palavra era " + palavraAtual;
    elStatus.className = "status-msg lose";
    desabilitarTecladoSolo();
  }
  salvarLocal("forca-sequencia", sequencia);
  salvarLocal("forca-recorde", recorde);
}

function desabilitarTecladoSolo() {
  elTeclado.querySelectorAll(".tecla").forEach((b) => (b.disabled = true));
}

function renderSolo() {
  desenharForca(elFigura, letrasErradas.size);
  // Mostra a letra com acento assim que a letra sem acento for descoberta;
  // no fim do jogo mostra a palavra inteira.
  elPalavra.innerHTML = palavraAtual
    .split("")
    .map((ch, i) => {
      const base = palavraBase[i];
      if (!ehLetra(base)) return ch === " " ? '<span class="espaco"></span>' : `<span>${ch}</span>`;
      if (letrasCertas.has(base)) return `<span>${ch}</span>`;
      if (fimDeJogoSolo) return `<span class="revelada">${ch}</span>`;
      return "<span>_</span>";
    })
    .join("");
  document.getElementById("sequenciaForca").textContent =
    `🔥 Sequência: ${sequencia}   🏆 Recorde: ${recorde}`;
  btnNovo.textContent = fimDeJogoSolo ? "Próxima palavra" : "Pular palavra";
}

btnNovo.addEventListener("click", () => {
  // pular uma palavra no meio conta como derrota pra sequência
  if (!fimDeJogoSolo && (letrasCertas.size || letrasErradas.size)) {
    sequencia = 0;
    salvarLocal("forca-sequencia", 0);
  }
  novaPalavra();
});

// Teclado do computador também funciona no modo Sozinho.
document.addEventListener("keydown", (e) => {
  if (areaSolo.style.display === "none" || e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return;
  const letra = semAcento(e.key || "").toUpperCase();
  if (letra.length === 1 && ALFABETO.includes(letra)) chutarSolo(letra);
  else if (e.key === "Enter" && fimDeJogoSolo) novaPalavra();
});

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
    pararTimerProximaLetra();
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
    pararTimerProximaLetra();
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
  const numErradas =
    Object.keys(erradas).length + (rodada.dicaUsada ? 1 : 0) + (rodada.temposEsgotados || 0);
  const fimDeRodada = rodada.status === "venceu" || rodada.status === "perdeu";

  if (fimDeRodada) {
    pararTimerProximaLetra();
  } else {
    proximaLetraTerminaEmAtual = rodada.proximaLetraTerminaEm || null;
    document.getElementById("legendaTempoLetra").style.display = "block";
    iniciarTimerProximaLetra();
  }

  desenharForca(document.getElementById("figuraOnline"), numErradas);
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
    rodada: {
      palavra,
      dica,
      dicaUsada: false,
      letrasCertas: {},
      letrasErradas: {},
      temposEsgotados: 0,
      proximaLetraTerminaEm: Date.now() + TEMPO_LETRA_MS,
      status: "jogando",
    },
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
    const totalErros =
      Object.keys(erradas).length + (rodada.dicaUsada ? 1 : 0) + (rodada.temposEsgotados || 0);
    const perdeu = totalErros >= MAX_ERROS;

    rodada.letrasCertas = certas;
    rodada.letrasErradas = erradas;
    if (ganhou) rodada.status = "venceu";
    else if (perdeu) rodada.status = "perdeu";
    else rodada.proximaLetraTerminaEm = Date.now() + TEMPO_LETRA_MS; // nova chance, novo minuto
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
    const totalErros = Object.keys(erradas).length + 1 + (rodada.temposEsgotados || 0);

    rodada.dicaUsada = true;
    if (totalErros >= MAX_ERROS) rodada.status = "perdeu";
    else rodada.proximaLetraTerminaEm = Date.now() + TEMPO_LETRA_MS; // viu a dica, novo minuto pra chutar
    return rodada;
  });
}

document.getElementById("btnVerDica").addEventListener("click", verDicaOnline);

// Se o adivinhador demorar mais de 1 minuto sem escolher uma letra, conta
// como se tivesse errado uma (mesma penalidade da dica). Mesmo padrão de
// transaction: só quem "pegar" o prazo já vencido aplica a penalidade, e a
// checagem "Date.now() < proximaLetraTerminaEm" evita duplicar se dois
// clientes tentarem ao mesmo tempo.
function aplicarTimeoutLetra() {
  if (!salaAtual) return;
  const rodadaRef = refSala(JOGO, salaAtual.id).child("rodada");

  rodadaRef.transaction((rodada) => {
    if (!rodada || rodada.status !== "jogando") return rodada;
    if (!rodada.proximaLetraTerminaEm || Date.now() < rodada.proximaLetraTerminaEm) return rodada;

    const erradas = rodada.letrasErradas || {};
    const temposEsgotados = (rodada.temposEsgotados || 0) + 1;
    const totalErros = Object.keys(erradas).length + (rodada.dicaUsada ? 1 : 0) + temposEsgotados;

    rodada.temposEsgotados = temposEsgotados;
    if (totalErros >= MAX_ERROS) {
      rodada.status = "perdeu";
    } else {
      rodada.proximaLetraTerminaEm = Date.now() + TEMPO_LETRA_MS;
    }
    return rodada;
  });
}

let proximaLetraTerminaEmAtual = null;
let timerProximaLetraId = null;

function iniciarTimerProximaLetra() {
  if (timerProximaLetraId) return;
  timerProximaLetraId = setInterval(tickProximaLetra, 500);
}

function pararTimerProximaLetra() {
  if (timerProximaLetraId) {
    clearInterval(timerProximaLetraId);
    timerProximaLetraId = null;
  }
  proximaLetraTerminaEmAtual = null;
  document.getElementById("tempoProximaLetra").textContent = "";
  document.getElementById("legendaTempoLetra").style.display = "none";
}

function tickProximaLetra() {
  const el = document.getElementById("tempoProximaLetra");
  if (!proximaLetraTerminaEmAtual) {
    el.textContent = "";
    return;
  }

  const restante = proximaLetraTerminaEmAtual - Date.now();
  if (restante <= 0) {
    el.textContent = "0:00";
    el.classList.add("urgente");
    aplicarTimeoutLetra();
    return;
  }

  const segundos = Math.ceil(restante / 1000);
  el.textContent = `0:${String(segundos).padStart(2, "0")}`;
  el.classList.toggle("urgente", segundos <= 10);
}

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
        rodada: {
          palavra: "",
          dica: "",
          dicaUsada: false,
          letrasCertas: {},
          letrasErradas: {},
          temposEsgotados: 0,
          proximaLetraTerminaEm: null,
          status: "escolhendo",
        },
      });
    });
});

function sairDaSalaClique() {
  pararTimerProximaLetra();
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

montarCategorias();
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
