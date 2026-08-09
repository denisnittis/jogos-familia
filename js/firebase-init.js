// Inicializa o Firebase e autentica anonimamente (necessário para as regras
// do Realtime Database liberarem leitura/escrita). Veja FIREBASE_SETUP.md.
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const firebaseProntoPromise = firebase
  .auth()
  .signInAnonymously()
  .catch((erro) => {
    console.error("Falha ao autenticar no Firebase:", erro);
  });
