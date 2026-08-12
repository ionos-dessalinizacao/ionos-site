const express = require("express");

const router = express.Router();


// ==========================================
// SERVICES
// ==========================================

const {
  pegarConfiguracoes,
  ativarNoticias,
  desativarNoticias
} = require("../services/configService");


const {
  pegarTodasNoticias
} = require("../services/noticiaService");


// ==========================================
// CONTROLLER DE NOTÍCIAS
// ==========================================

const {
  criar,
  deletar,
  atualizar,
  arquivar,
  desarquivar
} = require("../controllers/noticiaController");


// ==========================================
// MIDDLEWARE DE AUTENTICAÇÃO
// ==========================================

function verificarLogin(req, res, next) {

  if (!req.session.usuario) {

    return res.redirect("/login");

  }

  next();

}

router.use(verificarLogin);


// ==========================================
// PAINEL PRINCIPAL
// ==========================================

router.get("/", async (req, res) => {

  try {

    const configuracoes =
      await pegarConfiguracoes();

    res.render("admin/index", {

      title: "Painel Administrativo",

      configuracoes

    });

  } catch (error) {

    console.error(
      "Erro ao carregar painel administrativo:",
      error
    );

    res.status(500).send(
      "Erro ao carregar o painel administrativo."
    );

  }

});


// ==========================================
// INÍCIO
// ==========================================

router.get("/inicio", (req, res) => {

  res.render("admin/inicio", {

    title: "Administrar Início"

  });

});


// ==========================================
// EQUIPE
// ==========================================

router.get("/equipe", (req, res) => {

  res.render("admin/equipe", {

    title: "Administrar Equipe"

  });

});


// ==========================================
// APLICAÇÕES
// ==========================================

router.get("/aplicacoes", (req, res) => {

  res.render("admin/aplicacoes", {

    title: "Administrar Aplicações"

  });

});


// ==========================================
// NOTÍCIAS — PÁGINA ADMIN
// ==========================================

router.get("/noticias", async (req, res) => {

  try {

    // Admin precisa receber TODAS as notícias,
    // inclusive as arquivadas.

    const noticias =
      await pegarTodasNoticias();

    const configuracoes =
      await pegarConfiguracoes();


    res.render("admin/noticias", {

      title: "Administrar Notícias",

      noticias,

      configuracoes

    });

  } catch (error) {

    console.error(
      "Erro ao carregar notícias:",
      error
    );

    res.status(500).send(
      "Erro ao carregar as notícias."
    );

  }

});


// ==========================================
// CRIAR NOTÍCIA
// POST /admin/noticias
// ==========================================

router.post(
  "/noticias",
  criar
);


// ==========================================
// ATUALIZAR NOTÍCIA
// PUT /admin/noticias/:id
// ==========================================

router.put(
  "/noticias/:id",
  atualizar
);


// ==========================================
// DELETAR NOTÍCIA
// DELETE /admin/noticias/:id
// ==========================================

router.delete(
  "/noticias/:id",
  deletar
);


// ==========================================
// ARQUIVAR NOTÍCIA
// PATCH /admin/noticias/:id/arquivar
// ==========================================

router.patch(
  "/noticias/:id/arquivar",
  arquivar
);


// ==========================================
// DESARQUIVAR NOTÍCIA
// PATCH /admin/noticias/:id/desarquivar
// ==========================================

router.patch(
  "/noticias/:id/desarquivar",
  desarquivar
);


// ==========================================
// ATIVAR NOTÍCIAS
// ==========================================

router.post(
  "/noticias/ativar",
  async (req, res) => {

    try {

      await ativarNoticias();

      return res.json({

        sucesso: true,

        mensagem:
          "Seção de notícias ativada."

      });

    } catch (error) {

      console.error(
        "Erro ao ativar notícias:",
        error
      );

      return res.status(500).json({

        sucesso: false,

        mensagem:
          "Erro ao ativar a seção de notícias."

      });

    }

  }
);


// ==========================================
// DESATIVAR NOTÍCIAS
// ==========================================

router.post(
  "/noticias/desativar",
  async (req, res) => {

    try {

      await desativarNoticias();

      return res.json({

        sucesso: true,

        mensagem:
          "Seção de notícias desativada."

      });

    } catch (error) {

      console.error(
        "Erro ao desativar notícias:",
        error
      );

      return res.status(500).json({

        sucesso: false,

        mensagem:
          "Erro ao desativar a seção de notícias."

      });

    }

  }
);


// ==========================================
// SOBRE
// ==========================================

router.get("/sobre", (req, res) => {

  res.render("admin/sobre", {

    title: "Administrar Sobre Nós"

  });

});


// ==========================================
// CONTATO
// ==========================================

router.get("/contato", (req, res) => {

  res.render("admin/contato", {

    title: "Administrar Contato"

  });

});


// ==========================================
// EXPORTAÇÃO
// ==========================================

module.exports = router;
