const {
  db
} = require("../config/firebase");

const {
  FieldValue
} = require("firebase-admin/firestore");

// ==========================================
// CRIAR
// ==========================================

async function criarNoticia(
  titulo,
  descricao,
  imagemUrl
) {

  const noticia = {

    titulo,
    descricao,
    imagemUrl: imagemUrl || "",

    data: FieldValue.serverTimestamp(),

    arquivada: false

  };

  const docRef = await db
    .collection("noticias")
    .add(noticia);

  return {
    id: docRef.id,
    ...noticia
  };
}


// ==========================================
// LISTAR
// ==========================================

async function pegarNoticias() {

  const snapshot = await db
    .collection("noticias")
    .where("arquivada", "==", false)
    .orderBy("data", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// ==========================================
// LISTAR TODAS
// ADMIN
// ==========================================

async function pegarTodasNoticias() {

  const snapshot = await db
    .collection("noticias")
    .orderBy("data", "desc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

}


// ==========================================
// DELETAR
// ==========================================

async function deletarNoticia(id) {

  await db
    .collection("noticias")
    .doc(id)
    .delete();

}


// ==========================================
// ATUALIZAR
// ==========================================

async function atualizarNoticia(
  id,
  titulo,
  descricao,
  imagemUrl
) {

  const dados = {
    titulo,
    descricao
  };

  if (imagemUrl !== undefined) {
    dados.imagemUrl = imagemUrl;
  }

  await db
    .collection("noticias")
    .doc(id)
    .update(dados);

}


// ==========================================
// ARQUIVAR
// ==========================================

async function arquivarNoticia(id) {

  await db
    .collection("noticias")
    .doc(id)
    .update({
      arquivada: true
    });

}


// ==========================================
// DESARQUIVAR
// ==========================================

async function desarquivarNoticia(id) {

  await db
    .collection("noticias")
    .doc(id)
    .update({
      arquivada: false
    });

}


module.exports = {
  criarNoticia,
  pegarNoticias,
  pegarTodasNoticias,
  deletarNoticia,
  atualizarNoticia,
  arquivarNoticia,
  desarquivarNoticia
};