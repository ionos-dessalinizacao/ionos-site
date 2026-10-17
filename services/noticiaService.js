
const { db } = require("../config/firebase");
const { FieldValue } = require("firebase-admin/firestore");

// ==========================================
// AUXILIAR: ORDENAR POR DATA
// ==========================================

function obterTempo(data) {
  if (!data) return 0;

  if (typeof data.toMillis === "function") {
    return data.toMillis();
  }

  if (typeof data.toDate === "function") {
    return data.toDate().getTime();
  }

  const tempo = new Date(data).getTime();
  return Number.isNaN(tempo) ? 0 : tempo;
}

function ordenarPorData(a, b) {
  return obterTempo(b.data) - obterTempo(a.data);
}

// ==========================================
// CRIAR NOTÍCIA
// ==========================================

async function criarNoticia(titulo, descricao, imagemUrl = "") {
  const noticia = {
    titulo,
    descricao,
    imagemUrl: imagemUrl || "",
    data: FieldValue.serverTimestamp(),
    arquivada: false
  };

  const docRef = await db.collection("noticias").add(noticia);

  return {
    id: docRef.id,
    ...noticia
  };
}

// ==========================================
// LISTAR NOTÍCIAS PUBLICADAS
// ==========================================

async function pegarNoticias() {
  const snapshot = await db.collection("noticias").get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    .filter((noticia) => noticia.arquivada !== true)
    .sort(ordenarPorData);
}

// ==========================================
// LISTAR TODAS AS NOTÍCIAS
// Inclui as arquivadas
// ==========================================

async function pegarTodasNoticias() {
  const snapshot = await db.collection("noticias").get();

  return snapshot.docs
    .map((doc) => ({
      id: doc.id,
      ...doc.data()
    }))
    .sort(ordenarPorData);
}

// ==========================================
// EXCLUIR NOTÍCIA
// ==========================================

async function deletarNoticia(id) {
  const ref = db.collection("noticias").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Notícia não encontrada.");
  }

  await ref.delete();
}

// ==========================================
// ATUALIZAR NOTÍCIA
// ==========================================

async function atualizarNoticia(id, titulo, descricao, imagemUrl) {
  const ref = db.collection("noticias").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Notícia não encontrada.");
  }

  const dados = {
    titulo,
    descricao
  };

  // Só altera a imagem se uma nova URL foi fornecida.
  if (imagemUrl !== undefined) {
    dados.imagemUrl = imagemUrl;
  }

  await ref.update(dados);
}

// ==========================================
// ARQUIVAR NOTÍCIA
// ==========================================

async function arquivarNoticia(id) {
  const ref = db.collection("noticias").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Notícia não encontrada.");
  }

  await ref.update({
    arquivada: true
  });
}

// ==========================================
// DESARQUIVAR NOTÍCIA
// ==========================================

async function desarquivarNoticia(id) {
  const ref = db.collection("noticias").doc(id);
  const doc = await ref.get();

  if (!doc.exists) {
    throw new Error("Notícia não encontrada.");
  }

  await ref.update({
    arquivada: false
  });
}

// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
  criarNoticia,
  pegarNoticias,
  pegarTodasNoticias,
  deletarNoticia,
  atualizarNoticia,
  arquivarNoticia,
  desarquivarNoticia
};
