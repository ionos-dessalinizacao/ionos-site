
const {
  pegarNoticias,
  criarNoticia,
  deletarNoticia,
  atualizarNoticia,
  arquivarNoticia,
  desarquivarNoticia
} = require("../services/noticiaService");

const {
  pegarConfiguracoes
} = require("../services/configService");

const {
  enviarImagemArquivo
} = require("../services/cloudinaryService");

// ==========================================
// PÁGINA PÚBLICA DE NOTÍCIAS
// ==========================================

async function listarNoticias(req, res) {
  try {
    const configuracoes = await pegarConfiguracoes();

    if (!configuracoes || !configuracoes.noticiasAtivas) {
      return res.redirect("/");
    }

    const noticias = await pegarNoticias();

    return res.render("noticias", {
      title: "Notícias | Ionos",
      noticias
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);

    return res.status(500).send(
      "Erro ao carregar notícias."
    );
  }
}

// ==========================================
// CRIAR
// ==========================================

async function criar(req, res) {
  try {
    const { titulo, descricao } = req.body;

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof descricao !== "string" ||
      !descricao.trim()
    ) {
      return res.status(400).json({
        sucesso: false,
        erro: "Título e descrição são obrigatórios."
      });
    }

    let imagemUrl = "";

    if (req.file) {
      const resultado = await enviarImagemArquivo(
        req.file,
        "noticias"
      );

      imagemUrl = resultado.url;
    }

    const noticia = await criarNoticia(
      titulo.trim(),
      descricao.trim(),
      imagemUrl
    );

    return res.status(201).json({
      sucesso: true,
      mensagem: "Notícia criada com sucesso.",
      noticia
    });
  } catch (error) {
    console.error("Erro ao criar notícia:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao criar notícia."
    });
  }
}

// ==========================================
// ATUALIZAR
// ==========================================

async function atualizar(req, res) {
  try {
    const { titulo, descricao } = req.body;

    if (
      typeof titulo !== "string" ||
      !titulo.trim() ||
      typeof descricao !== "string" ||
      !descricao.trim()
    ) {
      return res.status(400).json({
        sucesso: false,
        erro: "Título e descrição são obrigatórios."
      });
    }

    let imagemUrl;

    if (req.file) {
      const resultado = await enviarImagemArquivo(
        req.file,
        "noticias"
      );

      imagemUrl = resultado.url;
    }

    await atualizarNoticia(
      req.params.id,
      titulo.trim(),
      descricao.trim(),
      imagemUrl
    );

    return res.json({
      sucesso: true,
      mensagem: "Notícia atualizada com sucesso."
    });
  } catch (error) {
    console.error("Erro ao atualizar notícia:", error);

    const naoEncontrada =
      error.message === "Notícia não encontrada.";

    return res.status(naoEncontrada ? 404 : 500).json({
      sucesso: false,
      erro: naoEncontrada
        ? error.message
        : "Erro ao atualizar notícia."
    });
  }
}

// ==========================================
// EXCLUIR
// ==========================================

async function deletar(req, res) {
  try {
    await deletarNoticia(req.params.id);

    return res.json({
      sucesso: true,
      mensagem: "Notícia excluída com sucesso."
    });
  } catch (error) {
    console.error("Erro ao excluir notícia:", error);

    const naoEncontrada =
      error.message === "Notícia não encontrada.";

    return res.status(naoEncontrada ? 404 : 500).json({
      sucesso: false,
      erro: naoEncontrada
        ? error.message
        : "Erro ao excluir notícia."
    });
  }
}

// ==========================================
// ARQUIVAR
// ==========================================

async function arquivar(req, res) {
  try {
    await arquivarNoticia(req.params.id);

    return res.json({
      sucesso: true,
      mensagem: "Notícia arquivada com sucesso."
    });
  } catch (error) {
    console.error("Erro ao arquivar notícia:", error);

    const naoEncontrada =
      error.message === "Notícia não encontrada.";

    return res.status(naoEncontrada ? 404 : 500).json({
      sucesso: false,
      erro: naoEncontrada
        ? error.message
        : "Erro ao arquivar notícia."
    });
  }
}

// ==========================================
// DESARQUIVAR
// ==========================================

async function desarquivar(req, res) {
  try {
    await desarquivarNoticia(req.params.id);

    return res.json({
      sucesso: true,
      mensagem: "Notícia desarquivada com sucesso."
    });
  } catch (error) {
    console.error("Erro ao desarquivar notícia:", error);

    const naoEncontrada =
      error.message === "Notícia não encontrada.";

    return res.status(naoEncontrada ? 404 : 500).json({
      sucesso: false,
      erro: naoEncontrada
        ? error.message
        : "Erro ao desarquivar notícia."
    });
  }
}

// ==========================================
// EXPORTAÇÕES
// ==========================================

module.exports = {
  listarNoticias,
  criar,
  atualizar,
  deletar,
  arquivar,
  desarquivar
};
