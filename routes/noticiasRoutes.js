const express = require("express");

const {
  listarNoticias
} = require("../controllers/noticiaController");

const {
  pegarConfiguracoes
} = require("../services/configService");


const router = express.Router();


// ==================================================
// PÁGINA DE NOTÍCIAS
// GET /noticias
// ==================================================

router.get(
  "/",
  async (req, res) => {

    try {

      const configuracoes =
        await pegarConfiguracoes();


      // Se a seção estiver desativada
      if (!configuracoes.noticiasAtivas) {

       return res.redirect("/");

      }


      return listarNoticias(req, res);


    } catch (error) {

      console.error(
        "Erro ao verificar configurações de notícias:",
        error
      );


      res.status(500).send(
        "Erro ao carregar notícias."
      );

    }

  }
);


module.exports = router;

