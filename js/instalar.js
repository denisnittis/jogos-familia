// Popup "Instalar" para colocar o site na tela inicial do celular.
// - Android/Chrome: usa o pedido de instalação do navegador (beforeinstallprompt).
// - iPhone/iPad: o Safari não tem esse pedido, então mostra o passo a passo.
// Não aparece se o site já estiver instalado, nem por 7 dias depois do "Agora não".
(function () {
  const CHAVE = "instalar-dispensado";
  const ESPERA = 7 * 24 * 60 * 60 * 1000;

  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("sw.js").catch(function () {});
  }

  const instalado =
    window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  if (instalado) return;

  function dispensadoRecente() {
    try {
      const t = parseInt(localStorage.getItem(CHAVE) || "0", 10);
      return Date.now() - t < ESPERA;
    } catch (e) {
      return false;
    }
  }

  function dispensar() {
    try {
      localStorage.setItem(CHAVE, String(Date.now()));
    } catch (e) {}
  }

  const ua = navigator.userAgent;
  const ehIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  function mostrarPopup(conteudoHtml, aoInstalar) {
    if (document.getElementById("popupInstalar")) return;
    const fundo = document.createElement("div");
    fundo.className = "instalar-fundo";
    fundo.id = "popupInstalar";
    fundo.innerHTML =
      '<div class="instalar-card" role="dialog" aria-labelledby="instalarTitulo">' +
      '<img src="icones/icone-192.png" alt="" class="instalar-icone" />' +
      '<h3 id="instalarTitulo">Instalar os Jogos da Família?</h3>' +
      conteudoHtml +
      '<div class="instalar-botoes">' +
      (aoInstalar ? '<button class="btn btn-primary" id="btnInstalar">📲 Instalar</button>' : "") +
      '<button class="btn btn-secondary" id="btnAgoraNao">' + (aoInstalar ? "Agora não" : "Entendi") + "</button>" +
      "</div></div>";
    document.body.appendChild(fundo);

    function fechar() {
      fundo.remove();
    }
    document.getElementById("btnAgoraNao").addEventListener("click", function () {
      dispensar();
      fechar();
    });
    if (aoInstalar) {
      document.getElementById("btnInstalar").addEventListener("click", function () {
        fechar();
        aoInstalar();
      });
    }
  }

  window.addEventListener("appinstalled", function () {
    dispensar();
    const p = document.getElementById("popupInstalar");
    if (p) p.remove();
  });

  if (dispensadoRecente()) return;

  if (ehIOS) {
    window.addEventListener("load", function () {
      mostrarPopup(
        "<p>Coloque um atalho na tela inicial para abrir os jogos como um aplicativo:</p>" +
          '<ol class="instalar-passos">' +
          "<li>Toque em <b>Compartilhar</b> " +
          '<svg class="instalar-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12M7 8l5-5 5 5M5 12v8h14v-8" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          " (na barra do Safari)</li>" +
          "<li>Escolha <b>Adicionar à Tela de Início</b></li>" +
          "<li>Toque em <b>Adicionar</b></li>" +
          "</ol>",
        null
      );
    });
    return;
  }

  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    const pedido = e;
    mostrarPopup("<p>Coloque um atalho na tela inicial para abrir os jogos como um aplicativo.</p>", function () {
      pedido.prompt();
      pedido.userChoice.then(function (escolha) {
        if (escolha.outcome !== "accepted") dispensar();
      });
    });
  });
})();
