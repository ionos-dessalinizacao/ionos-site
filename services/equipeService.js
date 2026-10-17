const { db } = require("../config/firebase");

const membrosRef = db.collection("membros");

// Retorna o documento com seu ID.
async function pegarMembroPorId(id) {
  const doc = await membrosRef.doc(id).get();

  if (!doc.exists) {
    return null;
  }

  return {
    id: doc.id,
    ...doc.data()
  };
}

// Lista todos os membros, inclusive os arquivados.
async function pegarMembros() {
  const snapshot = await membrosRef
    .orderBy("ordem", "asc")
    .get();

  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

// Lista apenas os membros publicados.
async function pegarMembrosPublicados() {
  const membros = await pegarMembros();

  return membros.filter(
    membro => membro.arquivada !== true
  );
}

// Cria um membro.
async function criarMembro(dados) {
  const agora = new Date();

  const novoMembro = {
    nome: dados.nome,
    cargo: dados.cargo,
    descricao: dados.descricao || "",
    tipo: dados.tipo,
    ordem: Number(dados.ordem) || 0,

    imagemUrl: dados.imagemUrl || "",
    imagemPublicId: dados.imagemPublicId || "",

    arquivada: false,
    criadoEm: agora,
    atualizadoEm: agora
  };

  const docRef = await membrosRef.add(novoMembro);

  return {
    id: docRef.id,
    ...novoMembro
  };
}

// Atualiza somente os dados recebidos.
async function atualizarMembro(id, dados) {
  const atualizacao = {
    nome: dados.nome,
    cargo: dados.cargo,
    descricao: dados.descricao || "",
    tipo: dados.tipo,
    ordem: Number(dados.ordem) || 0,
    atualizadoEm: new Date()
  };

  // Só altera os dados da imagem se foram fornecidos.
  if (dados.imagemUrl !== undefined) {
    atualizacao.imagemUrl = dados.imagemUrl;
  }

  if (dados.imagemPublicId !== undefined) {
    atualizacao.imagemPublicId = dados.imagemPublicId;
  }

  await membrosRef.doc(id).update(atualizacao);

  return pegarMembroPorId(id);
}

// Arquiva sem excluir os dados.
async function arquivarMembro(id) {
  await membrosRef.doc(id).update({
    arquivada: true,
    atualizadoEm: new Date()
  });

  return pegarMembroPorId(id);
}

// Restaura um membro arquivado.
async function desarquivarMembro(id) {
  await membrosRef.doc(id).update({
    arquivada: false,
    atualizadoEm: new Date()
  });

  return pegarMembroPorId(id);
}

// Exclui definitivamente o documento.
async function deletarMembro(id) {
  await membrosRef.doc(id).delete();
  return true;
}

module.exports = {
  criarMembro,
  pegarMembros,
  pegarMembrosPublicados,
  pegarMembroPorId,
  atualizarMembro,
  arquivarMembro,
  desarquivarMembro,
  deletarMembro
};