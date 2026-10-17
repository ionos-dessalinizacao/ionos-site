const {
  criarMembro,
  pegarMembros,
  pegarMembrosPublicados,
  pegarMembroPorId,
  atualizarMembro,
  arquivarMembro,
  desarquivarMembro,
  deletarMembro
} = require("../services/equipeService");

const {
  enviarImagemMembro,
  excluirImagemMembro
} = require("../utils/imagemMembro");

// Página administrativa.
async function paginaAdminEquipe(req, res) {
  try {
    const membros = await pegarMembros();

    return res.render("admin/equipe", {
      title: "Administrar Equipe",
      membros
    });
  } catch (error) {
    console.error("Erro ao carregar equipe:", error);

    return res.status(500).send(
      "Erro ao carregar a equipe."
    );
  }
}

// Página pública.
async function paginaPublicaEquipe(req, res) {
  try {
    const membros = await pegarMembrosPublicados();

    const fundadores = membros.filter(
      membro => membro.tipo === "fundador"
    );

    const equipe = membros.filter(
      membro => membro.tipo === "equipe"
    );

    return res.render("equipe", {
      fundadores,
      equipe
    });
  } catch (error) {
    console.error("Erro ao carregar equipe pública:", error);

    return res.status(500).send(
      "Erro ao carregar a página da equipe."
    );
  }
}

// Validação comum.
function validarDados(body, parcial = false) {
  const { nome, cargo, tipo } = body;

  if (!parcial || nome !== undefined) {
    if (typeof nome !== "string" || !nome.trim()) {
      return "O nome do membro é obrigatório.";
    }
  }

  if (!parcial || cargo !== undefined) {
    if (typeof cargo !== "string" || !cargo.trim()) {
      return "O cargo do membro é obrigatório.";
    }
  }

  if (!parcial || tipo !== undefined) {
    if (!["fundador", "equipe"].includes(tipo)) {
      return "O tipo deve ser fundador ou equipe.";
    }
  }

  return null;
}

function normalizarDados(body) {
  return {
    nome: body.nome.trim(),
    cargo: body.cargo.trim(),
    descricao:
      typeof body.descricao === "string"
        ? body.descricao.trim()
        : "",
    tipo: body.tipo,
    ordem:
      body.ordem !== undefined &&
      body.ordem !== "" &&
      Number.isFinite(Number(body.ordem))
        ? Number(body.ordem)
        : 0
  };
}

// Cria um membro.
async function criar(req, res) {
  let imagemEnviada = null;

  try {
    const erroValidacao = validarDados(req.body);

    if (erroValidacao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: erroValidacao
      });
    }

    if (!req.file) {
      return res.status(400).json({
        sucesso: false,
        mensagem: "Envie uma foto para o membro."
      });
    }

    imagemEnviada = await enviarImagemMembro(req.file);

    const membro = await criarMembro({
      ...normalizarDados(req.body),
      ...imagemEnviada
    });

    return res.status(201).json({
      sucesso: true,
      mensagem: "Membro cadastrado com sucesso.",
      membro
    });
  } catch (error) {
    // Se o Firestore falhar depois do upload,
    // tenta remover o arquivo que ficou sem registro.
    if (imagemEnviada?.imagemPublicId) {
      try {
        await excluirImagemMembro(
          imagemEnviada.imagemPublicId
        );
      } catch (erroImagem) {
        console.error(
          "Erro ao limpar imagem após falha:",
          erroImagem
        );
      }
    }

    console.error("Erro ao criar membro:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao cadastrar o membro."
    });
  }
}

// Atualiza um membro.
async function atualizar(req, res) {
  let novaImagem = null;

  try {
    const { id } = req.params;
    const existente = await pegarMembroPorId(id);

    if (!existente) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Membro não encontrado."
      });
    }

    const erroValidacao = validarDados(req.body);

    if (erroValidacao) {
      return res.status(400).json({
        sucesso: false,
        mensagem: erroValidacao
      });
    }

    const dados = normalizarDados(req.body);

    if (req.file) {
      novaImagem = await enviarImagemMembro(req.file);

      dados.imagemUrl = novaImagem.imagemUrl;
      dados.imagemPublicId = novaImagem.imagemPublicId;
    }

    // Primeiro salva a nova referência no Firestore.
    const atualizado = await atualizarMembro(id, dados);

    // Só então tenta excluir a imagem anterior.
    if (
      novaImagem &&
      existente.imagemPublicId &&
      existente.imagemPublicId !== novaImagem.imagemPublicId
    ) {
      try {
        await excluirImagemMembro(
          existente.imagemPublicId
        );
      } catch (erroImagem) {
        console.error(
          "A foto foi atualizada, mas a antiga não pôde ser excluída:",
          erroImagem
        );
      }
    }

    return res.json({
      sucesso: true,
      mensagem: "Membro atualizado com sucesso.",
      membro: atualizado
    });
  } catch (error) {
    // Ocorre, por exemplo, se o novo upload funcionar
    // mas a atualização do Firestore falhar.
    if (novaImagem?.imagemPublicId) {
      try {
        await excluirImagemMembro(novaImagem.imagemPublicId);
      } catch (erroImagem) {
        console.error("Erro ao limpar nova imagem:", erroImagem);
      }
    }

    console.error("Erro ao atualizar membro:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao atualizar o membro."
    });
  }
}

// Arquiva.
async function arquivar(req, res) {
  try {
    const { id } = req.params;
    const membro = await pegarMembroPorId(id);

    if (!membro) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Membro não encontrado."
      });
    }

    await arquivarMembro(id);

    return res.json({
      sucesso: true,
      mensagem: "Membro arquivado com sucesso."
    });
  } catch (error) {
    console.error("Erro ao arquivar:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao arquivar o membro."
    });
  }
}

// Desarquiva.
async function desarquivar(req, res) {
  try {
    const { id } = req.params;
    const membro = await pegarMembroPorId(id);

    if (!membro) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Membro não encontrado."
      });
    }

    await desarquivarMembro(id);

    return res.json({
      sucesso: true,
      mensagem: "Membro restaurado com sucesso."
    });
  } catch (error) {
    console.error("Erro ao desarquivar:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao restaurar o membro."
    });
  }
}

// Exclui o registro e sua foto.
async function deletar(req, res) {
  try {
    const { id } = req.params;
    const membro = await pegarMembroPorId(id);

    if (!membro) {
      return res.status(404).json({
        sucesso: false,
        mensagem: "Membro não encontrado."
      });
    }

    // Exclui primeiro a imagem. Se falhar, mantém o
    // documento para não perder a referência do arquivo.
    if (membro.imagemPublicId) {
      await excluirImagemMembro(membro.imagemPublicId);
    }

    await deletarMembro(id);

    return res.json({
      sucesso: true,
      mensagem: "Membro e imagem excluídos com sucesso."
    });
  } catch (error) {
    console.error("Erro ao excluir membro:", error);

    return res.status(500).json({
      sucesso: false,
      mensagem: "Erro ao excluir o membro."
    });
  }
}

module.exports = {
  paginaAdminEquipe,
  paginaPublicaEquipe,
  criar,
  atualizar,
  arquivar,
  desarquivar,
  deletar
};