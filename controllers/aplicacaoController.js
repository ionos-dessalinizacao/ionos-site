const {

  pegarAplicacoes,
  criarAplicacao,
  atualizarAplicacao,
  deletarAplicacao

} = require("../services/aplicacaoService");

// ==========================================
// LISTAR APLICAÇÕES
// ==========================================

async function listarAplicacoes(req, res) {

  try {

    const aplicacoes =
      await pegarAplicacoes();

    res.render(
      "aplicacoes",
      {
        title: "Aplicações | Ionos",
        aplicacoes
      }
    );

  } catch (error) {

    console.error(
      "Erro ao listar aplicações:",
      error
    );

    res
      .status(500)
      .send(
        "Erro ao carregar aplicações."
      );
  }
}

// ==========================================
// CRIAR
// ==========================================

async function criar(req, res) {

  try {

    const {
      titulo,
      descricao,
      imagemUrl,
      ordem
    } = req.body;

    if (
      !titulo ||
      !descricao
    ) {

      return res
        .status(400)
        .json({
          erro:
            "Título e descrição são obrigatórios."
        });
    }

    const aplicacao =
      await criarAplicacao({
        titulo,
        descricao,
        imagemUrl,
        ordem
      });

    res.status(201).json({

      sucesso: true,

      mensagem:
        "Aplicação criada com sucesso.",

      aplicacao

    });

  } catch (error) {

    console.error(
      "Erro ao criar aplicação:",
      error
    );

    res.status(500).json({

      erro:
        "Erro ao criar aplicação."

    });
  }
}

// ==========================================
// ATUALIZAR
// ==========================================

async function atualizar(req, res) {

  try {

    const { id } =
      req.params;

    const {
      titulo,
      descricao,
      imagemUrl,
      ordem
    } = req.body;

    if (
      !titulo ||
      !descricao
    ) {

      return res
        .status(400)
        .json({
          erro:
            "Título e descrição são obrigatórios."
        });
    }

    const aplicacao =
      await atualizarAplicacao(
        id,
        {
          titulo,
          descricao,
          imagemUrl,
          ordem
        }
      );

    res.json({

      sucesso: true,

      mensagem:
        "Aplicação atualizada com sucesso.",

      aplicacao

    });

  } catch (error) {

    console.error(
      "Erro ao atualizar aplicação:",
      error
    );

    res.status(500).json({

      erro:
        "Erro ao atualizar aplicação."

    });
  }
}

// ==========================================
// DELETAR
// ==========================================

async function deletar(req, res) {

  try {

    const { id } =
      req.params;

    await deletarAplicacao(id);

    res.json({

      sucesso: true,

      mensagem:
        "Aplicação excluída com sucesso."

    });

  } catch (error) {

    console.error(
      "Erro ao deletar aplicação:",
      error
    );

    res.status(500).json({

      erro:
        "Erro ao excluir aplicação."

    });
  }
}

// ==========================================
// EXPORTAR
// ==========================================

module.exports = {

  listarAplicacoes,

  criar,

  atualizar,

  deletar

};