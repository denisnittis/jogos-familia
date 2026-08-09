// Lista de usuários permitidos e senhas.
// Aviso: como este site é HTML/JS estático hospedado no GitHub Pages,
// isto NÃO é segurança de verdade — qualquer pessoa que abrir o código-fonte
// consegue ver as senhas. Serve só como uma "portinha" para a família.
// Para trocar uma senha, edite o valor correspondente abaixo.
const USERS = {
  daniel: "Daniel2026",
  debora: "Debora2026",
  denis: "Denis2026",
  diego: "Diego2026",
  danielle: "Danielle2026",
  denise: "Denise2026",
  giovanna: "Giovanna2026",
  murilo: "Murilo2026",
  fabiola: "Fabiola2026",
};

// Nomes "bonitos" (com maiúscula), na mesma ordem do select de login.
// Usado pelas telas de jogo online para montar a lista de oponentes.
const NAMES = [
  "Daniel",
  "Debora",
  "Denis",
  "Diego",
  "Danielle",
  "Denise",
  "Giovanna",
  "Murilo",
  "Fabiola",
];

const SESSION_KEY = "ff_user";

function checkLogin(username, password) {
  const key = (username || "").trim().toLowerCase();
  if (USERS[key] && USERS[key] === password) {
    localStorage.setItem(SESSION_KEY, username.trim());
    return true;
  }
  return false;
}

function getUser() {
  return localStorage.getItem(SESSION_KEY);
}

function requireLogin() {
  if (!getUser()) {
    window.location.href = "index.html";
  }
}

function logout() {
  localStorage.removeItem(SESSION_KEY);
  window.location.href = "index.html";
}
