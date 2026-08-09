// Mostra um aviso no menu principal quando o jogador tem convites
// pendentes em qualquer um dos jogos 1x1 (Forca, Velha, Batalha Naval).
// O Stop não entra aqui porque não usa convite — é sala aberta.
const JOGOS_COM_CONVITE = [
  { id: "forca", nome: "Forca", href: "forca.html" },
  { id: "velha", nome: "Jogo da Velha", href: "velha.html" },
  { id: "batalha", nome: "Batalha Naval", href: "batalha.html" },
];

const contagemConvitesPorJogo = {};

JOGOS_COM_CONVITE.forEach((jogo) => {
  escutarConvites(jogo.id, (convites) => {
    contagemConvitesPorJogo[jogo.id] = Object.keys(convites).length;
    renderizarAvisoConvites();
  });
});

function renderizarAvisoConvites() {
  const painel = document.getElementById("painelConvitesPendentes");
  const lista = document.getElementById("listaConvitesPendentesResumo");
  const comConvite = JOGOS_COM_CONVITE.filter((jogo) => contagemConvitesPorJogo[jogo.id] > 0);

  if (!comConvite.length) {
    painel.style.display = "none";
    return;
  }

  painel.style.display = "block";
  lista.innerHTML = comConvite
    .map(
      (jogo) =>
        `<a class="btn btn-primary" href="${jogo.href}">${jogo.nome} (${contagemConvitesPorJogo[jogo.id]}) →</a>`
    )
    .join("");
}
