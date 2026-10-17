const { db } = require("../config/firebase");

// ==========================================
// PEGAR TODAS AS APLICAÇÕES
// ==========================================

async function pegarAplicacoes() {

  const snapshot =
    await db
      .collection("aplicacoes")
      .orderBy("ordem", "asc")
      .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// ==========================================
// PEGAR UMA APLICAÇÃO
// ==========================================

async function pegarAplicacao(id) {

  const doc =
    await db
      .collection("aplicacoes")
      .doc(id)
      .get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
}

// ==========================================
// CRIAR APLICAÇÃO
// ==========================================

async function criarAplicacao(dados) {

  const {

    titulo,
    descricao,
    imagemUrl,
    ordem

  } = dados;

  const aplicacao = {

    titulo: titulo.trim(),

    descricao: descricao.trim(),

    imagemUrl:
      imagemUrl || "",

    ordem:
      Number(ordem) || 0,

    criadaEm:
      new Date()

  };

  const docRef =
    await db
      .collection("aplicacoes")
      .add(aplicacao);

  return {
    id: docRef.id,
    ...aplicacao
  };
}

// ==========================================
// ATUALIZAR APLICAÇÃO
// ==========================================

async function atualizarAplicacao(
  id,
  dados
) {

  const {

    titulo,
    descricao,
    imagemUrl,
    ordem

  } = dados;

  const aplicacaoAtualizada = {

    titulo: titulo.trim(),

    descricao: descricao.trim(),

    imagemUrl:
      imagemUrl || "",

    ordem:
      Number(ordem) || 0,

    atualizadaEm:
      new Date()

  };

  await db
    .collection("aplicacoes")
    .doc(id)
    .update(aplicacaoAtualizada);

  return {
    id,
    ...aplicacaoAtualizada
  };
}

// ==========================================
// DELETAR APLICAÇÃO
// ==========================================

async function deletarAplicacao(id) {

  await db
    .collection("aplicacoes")
    .doc(id)
    .delete();
}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

  pegarAplicacoes,

  pegarAplicacao,

  criarAplicacao,

  atualizarAplicacao,

  deletarAplicacao

};