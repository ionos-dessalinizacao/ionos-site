const {
  pegarConfiguracoes
} = require("../services/configService");


async function carregarConfiguracoes(
  req,
  res,
  next
) {

  try {

    const configuracoes =
      await pegarConfiguracoes();


    // Disponibiliza para todos os EJS
    res.locals.configuracoes =
      configuracoes;


    next();

  } catch (error) {

    console.error(
      "Erro ao carregar configurações:",
      error
    );


    next(error);

  }

}


module.exports = carregarConfiguracoes;

