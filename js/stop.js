const JOGO = "stop";

// "id" é usado como chave no Firebase (não pode ter ".", "#", "$", "/", "[" ou
// "]"), "label" é só o texto mostrado na tela — por isso são separados.
const CATEGORIAS = [
  { id: "nome", label: "Nome" },
  { id: "fruta", label: "Fruta" },
  { id: "cor", label: "Cor" },
  { id: "cidade", label: "Cidade" },
  { id: "estado", label: "Estado" },
  { id: "pais", label: "País" },
  { id: "sogra", label: "Minha sogra é..." },
  { id: "animal", label: "Animal" },
];

// Alfabeto tradicional do Stop/Adedonha: sem K, W, Y.
const LETRAS = "ABCDEFGHIJLMNOPQRSTUVXZ";

const DURACAO_MS = 2 * 60 * 1000;
const CONTESTACAO_MS = 30 * 1000;

let salaAtual = null; // { id }
let terminaEmRodadaAtual = null;
let jaEnviei = false;
let respostasLocais = {};
let timerIntervalId = null;
let contestacaoTerminaEmAtual = null;

const areaLobby = document.getElementById("areaLobby");
const areaEspera = document.getElementById("areaEspera");
const areaJogando = document.getElementById("areaJogando");
const areaContestacao = document.getElementById("areaContestacao");
const areaResultado = document.getElementById("areaResultado");

function mostrarArea(nome) {
  areaLobby.style.display = nome === "lobby" ? "block" : "none";
  areaEspera.style.display = nome === "espera" ? "block" : "none";
  areaJogando.style.display = nome === "jogando" ? "block" : "none";
  areaContestacao.style.display = nome === "contestacao" ? "block" : "none";
  areaResultado.style.display = nome === "resultado" ? "block" : "none";
}

function mostrarLobby() {
  mostrarArea("lobby");
  escutarSalasAbertas();
}

/* ========================================================================
   LOBBY: criar sala ou entrar numa sala aberta
   ======================================================================== */

function escutarSalasAbertas() {
  db.ref("salas/stop").on("value", (snap) => {
    renderizarSalasAbertas(snap.val() || {});
  });
}

function pararDeEscutarSalasAbertas() {
  db.ref("salas/stop").off();
}

function renderizarSalasAbertas(salas) {
  const lista = document.getElementById("listaSalas");
  const eu = getUser();
  const abertas = Object.keys(salas).filter((id) => {
    const s = salas[id];
    return s.status === "aguardando" && !(s.jogadores && s.jogadores[eu]);
  });

  if (!abertas.length) {
    lista.innerHTML = '<p class="stop-sala-vazia">Nenhuma sala aberta no momento.</p>';
    return;
  }

  lista.innerHTML = "";
  abertas.forEach((id) => {
    const s = salas[id];
    const n = Object.keys(s.jogadores || {}).length;
    const div = document.createElement("div");
    div.className = "convite-item";

    const texto = document.createElement("span");
    texto.textContent = `Sala de ${s.criadoPor} — ${n} jogador${n === 1 ? "" : "es"}`;

    const btn = document.createElement("button");
    btn.className = "btn btn-primary";
    btn.textContent = "Entrar";
    btn.addEventListener("click", () => entrarNaSala(id));

    div.appendChild(texto);
    div.appendChild(btn);
    lista.appendChild(div);
  });
}

document.getElementById("btnCriarSala").addEventListener("click", () => {
  const eu = getUser();
  const novaRef = db.ref("salas/stop").push();
  const dadosIniciais = {
    criadoPor: eu,
    criadoEm: firebase.database.ServerValue.TIMESTAMP,
    jogadores: { [eu]: true },
    status: "aguardando",
    pontuacaoTotal: { [eu]: 0 },
  };
  novaRef.set(dadosIniciais).then(() => {
    pararDeEscutarSalasAbertas();
    salaAtual = { id: novaRef.key };
    escutarSala(novaRef.key);
  });
});

function entrarNaSala(salaId) {
  const eu = getUser();
  refSala(JOGO, salaId)
    .child(`jogadores/${eu}`)
    .set(true)
    .then(() => {
      refSala(JOGO, salaId)
        .child(`pontuacaoTotal/${eu}`)
        .transaction((v) => (v === null ? 0 : v));
      pararDeEscutarSalasAbertas();
      salaAtual = { id: salaId };
      escutarSala(salaId);
    });
}

/* ========================================================================
   SALA (espera / jogando / resultado)
   ======================================================================== */

function escutarSala(salaId) {
  salvarSalaLocal(JOGO, salaId);
  refSala(JOGO, salaId).on("value", (snap) => {
    const sala = snap.val();
    if (!sala) {
      salaAtual = null;
      limparSalaLocal(JOGO);
      terminaEmRodadaAtual = null;
      contestacaoTerminaEmAtual = null;
      pararTimer();
      mostrarLobby();
      return;
    }
    renderizarSala(sala);
  });
}

function renderizarSala(sala) {
  if (sala.status === "aguardando") {
    mostrarArea("espera");
    document.getElementById("esperaCriador").textContent = sala.criadoPor;
    const nomes = Object.keys(sala.jogadores || {});
    document.getElementById("esperaJogadores").innerHTML = nomes
      .map((n) => `<span class="stop-jogador-badge">${n}</span>`)
      .join("");
    document.getElementById("avisoMinimoJogadores").style.display = "none";
    return;
  }

  if (sala.status === "jogando") {
    mostrarArea("jogando");
    iniciarOuAtualizarJogo(sala);
    return;
  }

  if (sala.status === "contestando") {
    pararTimer();
    mostrarArea("contestacao");
    iniciarOuAtualizarContestacao(sala);
    return;
  }

  if (sala.status === "resultado") {
    pararTimer();
    mostrarArea("resultado");
    renderizarResultado(sala);
  }
}

document.getElementById("btnIniciarRodada").addEventListener("click", () => {
  if (!salaAtual) return;
  refSala(JOGO, salaAtual.id)
    .once("value")
    .then((snap) => {
      const sala = snap.val();
      if (!sala) return;
      const nomes = Object.keys(sala.jogadores || {});
      if (nomes.length < 2) {
        document.getElementById("avisoMinimoJogadores").style.display = "block";
        return;
      }
      sortearNovaRodada();
    });
});

function sortearNovaRodada() {
  const letra = LETRAS[Math.floor(Math.random() * LETRAS.length)];
  refSala(JOGO, salaAtual.id).update({
    status: "jogando",
    letra,
    terminaEm: Date.now() + DURACAO_MS,
    respostas: {},
    votosTrocarLetra: null,
    trocaLetraClaim: false,
    contestacaoAberta: false,
    contestacoes: null,
    contestacaoTerminaEm: null,
    resultadoCalculado: false,
    resultado: null,
  });
}

document.getElementById("btnNovaRodada").addEventListener("click", sortearNovaRodada);

/* ========================================================================
   RODADA EM ANDAMENTO
   ======================================================================== */

document.getElementById("formCategorias").addEventListener("submit", (e) => e.preventDefault());

function iniciarOuAtualizarJogo(sala) {
  atualizarVotosTrocarLetra(sala);

  if (sala.terminaEm === terminaEmRodadaAtual) return; // mesma rodada, nada mais a resetar

  terminaEmRodadaAtual = sala.terminaEm;
  jaEnviei = false;
  respostasLocais = {};
  montarFormularioCategorias(sala.letra);

  pararTimer();
  const rodadaLocal = sala.terminaEm;
  tickTimer(rodadaLocal);
  timerIntervalId = setInterval(() => tickTimer(rodadaLocal), 250);
}

/* ---- votação pra trocar a letra sorteada ---- */

function atualizarVotosTrocarLetra(sala) {
  const eu = getUser();
  const jogadores = Object.keys(sala.jogadores || {});
  const votos = Object.keys(sala.votosTrocarLetra || {});
  const euVotei = votos.includes(eu);

  const btn = document.getElementById("btnTrocarLetra");
  btn.textContent = euVotei ? "🔄 Voto registrado" : "🔄 Trocar letra";
  btn.classList.toggle("btn-primary", euVotei);
  btn.classList.toggle("btn-secondary", !euVotei);

  const texto = document.getElementById("votosTrocarLetraTexto");
  texto.textContent = votos.length > 0 ? `${votos.length}/${jogadores.length} votos` : "";
}

document.getElementById("btnTrocarLetra").addEventListener("click", alternarVotoTrocarLetra);

function alternarVotoTrocarLetra() {
  if (!salaAtual) return;
  const eu = getUser();
  const votoRef = refSala(JOGO, salaAtual.id).child(`votosTrocarLetra/${eu}`);

  votoRef
    .once("value")
    .then((snap) => (snap.exists() ? votoRef.remove() : votoRef.set(true)))
    .then(() => verificarMaioriaTrocarLetra());
}

function verificarMaioriaTrocarLetra() {
  if (!salaAtual) return;
  refSala(JOGO, salaAtual.id)
    .once("value")
    .then((snap) => {
      const sala = snap.val();
      if (!sala || sala.status !== "jogando") return;
      const totalJogadores = Object.keys(sala.jogadores || {}).length;
      const votos = Object.keys(sala.votosTrocarLetra || {}).length;
      if (votos * 2 > totalJogadores) {
        tentarTrocarLetra(sala.letra);
      }
    });
}

// Mesmo padrão de reivindicação por transaction: só um cliente executa a
// troca, mesmo que o voto decisivo seja detectado em mais de um cliente ao
// mesmo tempo.
function tentarTrocarLetra(letraAtual) {
  const claimRef = refSala(JOGO, salaAtual.id).child("trocaLetraClaim");

  claimRef.transaction(
    (atual) => {
      if (atual) return; // já está sendo trocada
      return true;
    },
    (erro, sucesso, snapshot) => {
      if (!sucesso || !snapshot.val()) return;
      const novaLetra = sortearLetraDiferente(letraAtual);
      refSala(JOGO, salaAtual.id).update({
        letra: novaLetra,
        terminaEm: Date.now() + DURACAO_MS,
        respostas: {},
        votosTrocarLetra: null,
        trocaLetraClaim: false,
      });
    }
  );
}

function sortearLetraDiferente(letraAtual) {
  const disponiveis = LETRAS.split("").filter((l) => l !== letraAtual);
  return disponiveis[Math.floor(Math.random() * disponiveis.length)];
}

function montarFormularioCategorias(letra) {
  document.getElementById("stopLetra").textContent = letra;
  document.getElementById("statusJogando").textContent = "";
  document.getElementById("statusJogando").className = "status-msg";

  const form = document.getElementById("formCategorias");
  form.innerHTML = "";
  CATEGORIAS.forEach((categoria) => {
    const div = document.createElement("div");
    div.className = "stop-categoria";

    const label = document.createElement("label");
    label.textContent = categoria.label;

    const input = document.createElement("input");
    input.type = "text";
    input.autocomplete = "off";
    input.addEventListener("input", () => {
      respostasLocais[categoria.id] = input.value;
    });

    div.appendChild(label);
    div.appendChild(input);
    form.appendChild(div);
  });
}

function tickTimer(rodadaLocal) {
  if (rodadaLocal !== terminaEmRodadaAtual) return; // rodada antiga, ignora

  const restante = terminaEmRodadaAtual - Date.now();
  const elTimer = document.getElementById("stopTimer");

  if (restante <= 0) {
    elTimer.textContent = "0:00";
    elTimer.classList.add("urgente");
    pararTimer();
    if (!jaEnviei) {
      jaEnviei = true;
      desabilitarFormulario();
      enviarRespostas();
      document.getElementById("statusJogando").textContent = "Tempo esgotado! Abrindo a revisão das respostas...";
      setTimeout(tentarAbrirContestacao, 4000 + Math.random() * 1500);
    }
    return;
  }

  const segundosTotais = Math.ceil(restante / 1000);
  const min = Math.floor(segundosTotais / 60);
  const seg = segundosTotais % 60;
  elTimer.textContent = `${min}:${String(seg).padStart(2, "0")}`;
  elTimer.classList.toggle("urgente", segundosTotais <= 10);
}

function pararTimer() {
  if (timerIntervalId) {
    clearInterval(timerIntervalId);
    timerIntervalId = null;
  }
}

function desabilitarFormulario() {
  document.querySelectorAll("#formCategorias input").forEach((input) => (input.disabled = true));
}

function enviarRespostas() {
  if (!salaAtual) return;
  refSala(JOGO, salaAtual.id).child(`respostas/${getUser()}`).set(respostasLocais);
}

/* ========================================================================
   CONTESTAÇÃO: revisão das respostas antes de fechar a pontuação
   ======================================================================== */

// Mesmo padrão da reivindicação por transaction usada no cálculo do
// resultado: só um cliente abre a fase de contestação, mesmo que vários
// cheguem no fim do cronômetro quase ao mesmo tempo.
function tentarAbrirContestacao() {
  if (!salaAtual) return;
  const claimRef = refSala(JOGO, salaAtual.id).child("contestacaoAberta");

  claimRef.transaction(
    (atual) => {
      if (atual) return; // já foi (ou está sendo) aberta
      return true;
    },
    (erro, sucesso, snapshot) => {
      if (!sucesso || !snapshot.val()) return;
      refSala(JOGO, salaAtual.id).update({
        status: "contestando",
        contestacaoTerminaEm: Date.now() + CONTESTACAO_MS,
      });
    }
  );
}

function iniciarOuAtualizarContestacao(sala) {
  if (sala.contestacaoTerminaEm === contestacaoTerminaEmAtual) {
    // mesma fase: só atualiza a tabela (alguém pode ter contestado algo)
    renderizarTabelaContestacao(sala);
    return;
  }

  contestacaoTerminaEmAtual = sala.contestacaoTerminaEm;
  renderizarTabelaContestacao(sala);

  pararTimer();
  const faseLocal = sala.contestacaoTerminaEm;
  tickTimerContestacao(faseLocal);
  timerIntervalId = setInterval(() => tickTimerContestacao(faseLocal), 250);
}

function renderizarTabelaContestacao(sala) {
  const eu = getUser();
  const jogadores = Object.keys(sala.jogadores || {});
  const respostas = sala.respostas || {};
  const contestacoes = sala.contestacoes || {};
  const tabela = document.getElementById("tabelaContestacao");

  let html = "<thead><tr><th>Categoria</th>" + jogadores.map((n) => `<th>${n}</th>`).join("") + "</tr></thead><tbody>";

  CATEGORIAS.forEach((categoria) => {
    html += `<tr><td>${categoria.label}</td>`;
    jogadores.forEach((nome) => {
      const resposta = (respostas[nome] && respostas[nome][categoria.id]) || "";
      const textoResposta = resposta.trim() || "(vazio)";
      const votos = (contestacoes[categoria.id] && contestacoes[categoria.id][nome]) || {};
      const numVotos = Object.keys(votos).length;

      html += '<td><div class="stop-resposta-celula">';
      html += `<span>${textoResposta}</span>`;

      if (nome === eu) {
        html += '<span class="stop-sua-resposta">(sua resposta)</span>';
      } else {
        const euContestei = !!votos[eu];
        html += `<button type="button" class="btn-contestar ${euContestei ? "contestada-por-mim" : ""}" data-categoria="${categoria.id}" data-autor="${nome}">${euContestei ? "Contestada ✓" : "Contestar"}</button>`;
        if (numVotos > 0) {
          html += `<span class="stop-contagem-contestacao">${numVotos} ${numVotos === 1 ? "contestação" : "contestações"}</span>`;
        }
      }

      html += "</div></td>";
    });
    html += "</tr>";
  });

  html += "</tbody>";
  tabela.innerHTML = html;

  tabela.querySelectorAll(".btn-contestar").forEach((btn) => {
    btn.addEventListener("click", () => {
      alternarContestacao(btn.dataset.categoria, btn.dataset.autor);
    });
  });
}

function alternarContestacao(categoriaId, nomeAutor) {
  if (!salaAtual) return;
  const eu = getUser();
  if (eu === nomeAutor) return; // não pode contestar a própria resposta

  const ref = refSala(JOGO, salaAtual.id).child(`contestacoes/${categoriaId}/${nomeAutor}/${eu}`);
  ref.once("value").then((snap) => {
    if (snap.exists()) {
      ref.remove();
    } else {
      ref.set(true);
    }
  });
}

function tickTimerContestacao(faseLocal) {
  if (faseLocal !== contestacaoTerminaEmAtual) return; // fase antiga, ignora

  const restante = contestacaoTerminaEmAtual - Date.now();
  const elTimer = document.getElementById("contestacaoTimer");

  if (restante <= 0) {
    elTimer.textContent = "0:00";
    elTimer.classList.add("urgente");
    pararTimer();
    setTimeout(tentarCalcularResultado, 2000 + Math.random() * 1500);
    return;
  }

  const segundosTotais = Math.ceil(restante / 1000);
  const min = Math.floor(segundosTotais / 60);
  const seg = segundosTotais % 60;
  elTimer.textContent = `${min}:${String(seg).padStart(2, "0")}`;
  elTimer.classList.toggle("urgente", segundosTotais <= 10);
}

/* ========================================================================
   CÁLCULO DO RESULTADO
   ======================================================================== */

// Só o cliente que conseguir "reivindicar" o cálculo (via transaction) é
// quem soma a pontuação — evita que dois jogadores computem ao mesmo tempo
// e contem os pontos em dobro.
function tentarCalcularResultado() {
  if (!salaAtual) return;
  const claimRef = refSala(JOGO, salaAtual.id).child("resultadoCalculado");

  claimRef.transaction(
    (atual) => {
      if (atual) return; // já foi (ou está sendo) calculado
      return true;
    },
    (erro, sucesso, snapshot) => {
      if (!sucesso || !snapshot.val()) return; // outro cliente já ganhou a corrida
      refSala(JOGO, salaAtual.id)
        .once("value")
        .then((snap) => {
          const sala = snap.val();
          if (sala) calcularEGravarResultado(sala);
        });
    }
  );
}

function normalizar(texto) {
  return (texto || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toUpperCase();
}

function calcularEGravarResultado(sala) {
  const letra = sala.letra;
  const jogadores = Object.keys(sala.jogadores || {});
  const respostas = sala.respostas || {};
  const contestacoes = sala.contestacoes || {};
  const outros = jogadores.length - 1;

  const porCategoria = {};
  const pontuacaoRodada = {};
  jogadores.forEach((nome) => (pontuacaoRodada[nome] = 0));

  CATEGORIAS.forEach((categoria) => {
    const valoresPorJogador = {};
    const contestadaPorJogador = {};
    jogadores.forEach((nome) => {
      const bruto = (respostas[nome] && respostas[nome][categoria.id]) || "";
      valoresPorJogador[nome] = normalizar(bruto);

      const votos = (contestacoes[categoria.id] && contestacoes[categoria.id][nome]) || {};
      const numVotos = Object.keys(votos).length;
      // maioria estrita dos OUTROS jogadores (sem contar o autor da resposta)
      contestadaPorJogador[nome] = outros > 0 && numVotos * 2 > outros;
    });

    const grupos = {};
    jogadores.forEach((nome) => {
      const valor = valoresPorJogador[nome];
      const comecaComLetra = valor.length > 0 && valor.charAt(0) === letra;
      const valido = comecaComLetra && !contestadaPorJogador[nome];
      if (!valido) return;
      if (!grupos[valor]) grupos[valor] = [];
      grupos[valor].push(nome);
    });

    const pontosDoJogador = {};
    Object.keys(grupos).forEach((valor) => {
      const membros = grupos[valor];
      const pontos = membros.length === 1 ? 10 : 5;
      membros.forEach((nome) => (pontosDoJogador[nome] = pontos));
    });

    porCategoria[categoria.id] = {};
    jogadores.forEach((nome) => {
      const pontos = pontosDoJogador[nome] || 0;
      porCategoria[categoria.id][nome] = {
        resposta: valoresPorJogador[nome],
        pontos,
        contestada: contestadaPorJogador[nome],
      };
      pontuacaoRodada[nome] += pontos;
    });
  });

  refSala(JOGO, salaAtual.id)
    .update({
      status: "resultado",
      resultado: { letra, porCategoria, pontuacaoRodada },
    })
    .then(() => {
      jogadores.forEach((nome) => {
        refSala(JOGO, salaAtual.id)
          .child(`pontuacaoTotal/${nome}`)
          .transaction((v) => (v || 0) + pontuacaoRodada[nome]);
      });
    });
}

function renderizarResultado(sala) {
  const resultado = sala.resultado;
  if (!resultado) return;

  document.getElementById("resultadoLetra").textContent = resultado.letra;

  const jogadores = Object.keys(sala.jogadores || {});
  const tabela = document.getElementById("tabelaResultado");

  let html = "<thead><tr><th>Categoria</th>" + jogadores.map((n) => `<th>${n}</th>`).join("") + "</tr></thead><tbody>";

  CATEGORIAS.forEach((categoria) => {
    html += `<tr><td>${categoria.label}</td>`;
    jogadores.forEach((nome) => {
      const info = (resultado.porCategoria[categoria.id] && resultado.porCategoria[categoria.id][nome]) || {
        resposta: "",
        pontos: 0,
      };
      const classe = info.pontos === 10 ? "stop-resposta-10" : info.pontos === 5 ? "stop-resposta-5" : "stop-resposta-0";
      const texto = info.resposta || "(vazio)";
      const tagContestada = info.contestada ? '<span class="stop-tag-contestada"> (contestada)</span>' : "";
      html += `<td class="${classe}">${texto}${tagContestada}<span class="stop-pontos">+${info.pontos}</span></td>`;
    });
    html += "</tr>";
  });

  html +=
    '<tr class="stop-total"><td>Total da rodada</td>' +
    jogadores.map((n) => `<td>${(resultado.pontuacaoRodada && resultado.pontuacaoRodada[n]) || 0}</td>`).join("") +
    "</tr></tbody>";

  tabela.innerHTML = html;

  const pontuacaoTotal = sala.pontuacaoTotal || {};
  document.getElementById("placarTotal").innerHTML = jogadores
    .map((n) => `<span>${n}: ${pontuacaoTotal[n] || 0}</span>`)
    .join("");
}

/* ========================================================================
   SAIR DA SALA
   ======================================================================== */

function sairDaSalaStop() {
  if (salaAtual) {
    const salaId = salaAtual.id;
    const eu = getUser();
    refSala(JOGO, salaId).off();
    pararTimer();
    refSala(JOGO, salaId)
      .child(`jogadores/${eu}`)
      .remove()
      .then(() => {
        refSala(JOGO, salaId)
          .child("jogadores")
          .once("value")
          .then((snap) => {
            if (!snap.exists()) {
              refSala(JOGO, salaId).remove();
            }
          });
      });
  }
  salaAtual = null;
  limparSalaLocal(JOGO);
  terminaEmRodadaAtual = null;
  contestacaoTerminaEmAtual = null;
  mostrarLobby();
}

document.getElementById("btnSairSalaEspera").addEventListener("click", sairDaSalaStop);
document.getElementById("btnSairSalaResultado").addEventListener("click", sairDaSalaStop);

/* ========================================================================
   INÍCIO
   ======================================================================== */

const salaSalva = lerSalaLocal(JOGO);
if (salaSalva) {
  salaAtual = { id: salaSalva };
  escutarSala(salaSalva);
} else {
  mostrarLobby();
}
