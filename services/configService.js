const { db } = require("../config/firebase");

// ==========================================
// PEGAR CONFIGURAÇÕES DO SITE
// ==========================================

async function pegarConfiguracoes() {

  const doc = await db
    .collection("configuracoes")
    .doc("site")
    .get();

  // Se o documento ainda não existir,
  // cria as configurações padrão
  if (!doc.exists) {

    const configuracoesPadrao = {
      noticiasAtivas: true,
      aplicacoesAtivas: true
    };

    await db
      .collection("configuracoes")
      .doc("site")
      .set(configuracoesPadrao);

    return configuracoesPadrao;
  }

  return doc.data();
}


// ==========================================
// ATUALIZAR CONFIGURAÇÕES
// ==========================================

async function atualizarConfiguracoes(dados) {

  await db
    .collection("configuracoes")
    .doc("site")
    .set(dados, {
      merge: true
    });

}


// ==========================================
// ATIVAR NOTÍCIAS
// ==========================================

async function ativarNoticias() {

  await atualizarConfiguracoes({
    noticiasAtivas: true
  });

}


// ==========================================
// DESATIVAR NOTÍCIAS
// ==========================================

async function desativarNoticias() {

  await atualizarConfiguracoes({
    noticiasAtivas: false
  });

}


// ==========================================
// ATIVAR APLICAÇÕES
// ==========================================

async function ativarAplicacoes() {

  await atualizarConfiguracoes({
    aplicacoesAtivas: true
  });

}


// ==========================================
// DESATIVAR APLICAÇÕES
// ==========================================

async function desativarAplicacoes() {

  await atualizarConfiguracoes({
    aplicacoesAtivas: false
  });

}


// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
  pegarConfiguracoes,
  atualizarConfiguracoes,
  ativarNoticias,
  desativarNoticias,
  ativarAplicacoes,
  desativarAplicacoes
};