// Funções genéricas de lobby (convites e salas) usadas pelo modo Online
// da Forca, do Jogo da Velha e da Batalha Naval.
//
// Estrutura no Realtime Database:
//   convites/{jogo}/{nomeConvidado}/{conviteId} = { de, salaId, criadoEm }
//   salas/{jogo}/{salaId} = { ...estado específico do jogo... }

function outrosNomes() {
  const eu = getUser();
  return NAMES.filter((n) => n !== eu);
}

function refSala(jogo, salaId) {
  return db.ref(`salas/${jogo}/${salaId}`);
}

function refConvitesDe(jogo, nome) {
  return db.ref(`convites/${jogo}/${nome}`);
}

// Cria a sala com os dados iniciais fornecidos e envia um convite para o
// oponente. Retorna o salaId (via callback, já que é assíncrono).
//
// Guarda o conviteParaNome/conviteId na própria sala pra sairDaSala
// conseguir limpar o convite pendente caso o convite seja cancelado antes
// de ser aceito (senão fica um convite "fantasma" apontando pra uma sala
// que não existe mais).
function criarSalaEConvidar(jogo, paraNome, dadosIniciais, callback) {
  const novaSalaRef = db.ref(`salas/${jogo}`).push();
  const salaId = novaSalaRef.key;

  novaSalaRef.set(dadosIniciais).then(() => {
    const conviteRef = refConvitesDe(jogo, paraNome).push();
    conviteRef
      .set({
        de: getUser(),
        salaId,
        criadoEm: firebase.database.ServerValue.TIMESTAMP,
      })
      .then(() => {
        novaSalaRef.update({ conviteParaNome: paraNome, conviteId: conviteRef.key });
      });
    callback(salaId);
  });
}

function escutarConvites(jogo, callback) {
  const eu = getUser();
  refConvitesDe(jogo, eu).on("value", (snap) => {
    callback(snap.val() || {});
  });
}

function pararDeEscutarConvites(jogo) {
  const eu = getUser();
  refConvitesDe(jogo, eu).off();
}

function removerConvite(jogo, conviteId) {
  const eu = getUser();
  refConvitesDe(jogo, eu).child(conviteId).remove();
}

function recusarConvite(jogo, conviteId, salaId) {
  removerConvite(jogo, conviteId);
  refSala(jogo, salaId).remove();
}

function cancelarSala(jogo, salaId) {
  refSala(jogo, salaId).remove();
}

function sairDaSala(jogo, salaId) {
  const salaRef = refSala(jogo, salaId);
  salaRef.off();

  // Se a sala ainda tinha um convite pendente (ninguém aceitou ainda),
  // apaga o convite também — senão ele fica pendente pra sempre, apontando
  // pra uma sala que não existe mais.
  salaRef.once("value").then((snap) => {
    const sala = snap.val();
    if (sala && sala.conviteParaNome && sala.conviteId) {
      db.ref(`convites/${jogo}/${sala.conviteParaNome}/${sala.conviteId}`).remove();
    }
    salaRef.remove();
  });

  limparSalaLocal(jogo);
}

// Guarda qual sala cada jogo está usando no localStorage, para o jogador
// conseguir voltar pra partida em andamento se recarregar a página (ex:
// trocar de aba no celular, atualizar o navegador).
function salvarSalaLocal(jogo, salaId) {
  localStorage.setItem(`ff_sala_${jogo}`, salaId);
}

function lerSalaLocal(jogo) {
  return localStorage.getItem(`ff_sala_${jogo}`);
}

function limparSalaLocal(jogo) {
  localStorage.removeItem(`ff_sala_${jogo}`);
}
