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

// ==========================================
// PÁGINA DE NOTÍCIAS
// ==========================================

async function listarNoticias(req, res) {

  try {

    const configuracoes =
      await pegarConfiguracoes();

    // Notícias desativadas
    if (!configuracoes.noticiasAtivas) {

      return res.redirect("/");

    }

    const noticias =
      await pegarNoticias();

    res.render("noticias", {
      title: "Notícias | Ionos",
      noticias
    });

  } catch (error) {

    console.error(error);

    res.status(500).send(
      "Erro ao carregar notícias."
    );

  }

}

// ==========================================
// API - CRIAR
// ==========================================

async function criar(req, res) {

  try {

    const {
      titulo,
      descricao,
      imagemUrl
    } = req.body;

    if (!titulo || !descricao) {

      return res.status(400).json({
        erro: "Título e descrição são obrigatórios."
      });

    }

    const noticia = await criarNoticia(
      titulo,
      descricao,
      imagemUrl
    );

    res.json({
      sucesso: true,
      noticia
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao criar notícia."
    });

  }

}


// ==========================================
// API - DELETAR
// ==========================================

async function deletar(req, res) {

  try {

    await deletarNoticia(
      req.params.id
    );

    res.json({
      sucesso: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao deletar notícia."
    });

  }

}


// ==========================================
// API - ATUALIZAR
// ==========================================

async function atualizar(req, res) {

  try {

    const {
      titulo,
      descricao,
      imagemUrl
    } = req.body;

    await atualizarNoticia(
      req.params.id,
      titulo,
      descricao,
      imagemUrl
    );

    res.json({
      sucesso: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao atualizar notícia."
    });

  }

}


// ==========================================
// ARQUIVAR
// ==========================================

async function arquivar(req, res) {

  try {

    await arquivarNoticia(
      req.params.id
    );

    res.json({
      sucesso: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao arquivar notícia."
    });

  }

}


// ==========================================
// DESARQUIVAR
// ==========================================

async function desarquivar(req, res) {

  try {

    await desarquivarNoticia(
      req.params.id
    );

    res.json({
      sucesso: true
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      erro: "Erro ao desarquivar notícia."
    });

  }

}


module.exports = {
  listarNoticias,
  criar,
  deletar,
  atualizar,
  arquivar,
  desarquivar
};