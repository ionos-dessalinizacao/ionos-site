const {
  pegarConfiguracoes
} = require("../services/configService");

// ==========================================
// CONFIGURAÇÕES DO SITE
// ==========================================

async function carregarConfiguracoes(req, res, next) {

  try {

    const configuracoes = await pegarConfiguracoes();

    // Disponibiliza para todos os EJS
    res.locals.configuracoes = configuracoes;

    next();

  } catch (error) {

    console.error(
      "Erro ao carregar configurações do site:",
      error
    );

    // Configuração padrão para não quebrar o site
    res.locals.configuracoes = {
      noticiasAtivas: true
    };

    next();

  }

}

module.exports = carregarConfiguracoes;