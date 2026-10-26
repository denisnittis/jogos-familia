// Service worker mínimo, só para o site poder ser instalado na tela inicial.
// Ele NÃO guarda nada em cache: tudo vem sempre da internet, para o celular
// pegar as atualizações na hora. Se estiver sem internet, mostra um aviso.
self.addEventListener("install", function () {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function (event) {
  if (event.request.mode !== "navigate") return;
  event.respondWith(
    fetch(event.request).catch(function () {
      return new Response(
        '<!doctype html><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">' +
          '<title>Sem internet</title>' +
          '<body style="font-family:sans-serif;text-align:center;padding:40px;background:#6a3093;color:#fff">' +
          "<h2>Sem internet 📶</h2><p>Os Jogos da Família precisam de internet. Conecte e tente de novo.</p>" +
          '<button onclick="location.reload()" style="font-size:1.1rem;padding:10px 20px;border-radius:10px;border:0">Tentar de novo</button>',
        { headers: { "Content-Type": "text/html; charset=utf-8" } }
      );
    })
  );
});
