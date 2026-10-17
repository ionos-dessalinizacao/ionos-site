
const express = require("express");
const multer = require("multer");
const router = express.Router();

// ==========================================
// UPLOAD DE IMAGENS
// ==========================================

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new Error("Apenas arquivos de imagem são permitidos.")
      );
    }

    cb(null, true);
  }
});

// Trata erros do Multer antes de chamar o controller.
function uploadImagem(req, res, next) {
  upload.single("imagem")(req, res, (error) => {
    if (error) {
      const mensagem = error instanceof multer.MulterError
        ? error.code === "LIMIT_FILE_SIZE"
          ? "A imagem deve ter no máximo 5 MB."
          : "Erro ao receber o arquivo de imagem."
        : error.message || "Erro ao enviar a imagem.";

      return res.status(400).json({
        sucesso: false,
        erro: mensagem
      });
    }

    next();
  });
}

// ==========================================
// SERVICES
// ==========================================

const {
  pegarConfiguracoes,
  ativarNoticias,
  desativarNoticias,
  ativarAplicacoes,
  desativarAplicacoes
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
} = require("../controllers/noticiasController");


const {
  pegarConteudoInicio,
  salvarConteudoInicio
} = require("../services/inicioService");


// ==========================================
// AUTENTICAÇÃO
// ==========================================

function verificarLogin(req, res, next) {
  if (!req.session || !req.session.usuario) {
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
    const configuracoes = await pegarConfiguracoes();

    return res.render("admin/index", {
      title: "Painel Administrativo",
      configuracoes
    });
  } catch (error) {
    console.error("Erro ao carregar painel:", error);
    return res.status(500).send(
      "Erro ao carregar o painel administrativo."
    );
  }
});

// ==========================================
// OUTRAS PÁGINAS ADMINISTRATIVAS
// ==========================================

router.get("/inicio", async (req, res) => {
  try {
    const [configuracoes, conteudoInicio] = await Promise.all([
      pegarConfiguracoes(),
      pegarConteudoInicio()
    ]);

    res.render("admin/inicio", {
      title: "Administrar Início",
      configuracoes,
      conteudoInicio,
      salvo: req.query.salvo === "1"
    });
  } catch (error) {
    console.error("Erro ao carregar a administração do início:", error);

    res.status(500).send(
      "Não foi possível carregar a administração da página inicial."
    );
  }
});

router.get("/equipe", (req, res) => {
  res.render("admin/equipe", {
    title: "Administrar Equipe"
  });
});

router.get("/aplicacoes", (req, res) => {
  res.render("admin/aplicacoes", {
    title: "Administrar Aplicações"
  });
});

router.get("/sobre", (req, res) => {
  res.render("admin/sobre", {
    title: "Administrar Sobre Nós"
  });
});

router.get("/contato", (req, res) => {
  res.render("admin/contato", {
    title: "Administrar Contato"
  });
});

// ==========================================
// LISTAR NOTÍCIAS NO PAINEL
// ==========================================

router.get("/noticias", async (req, res) => {
  try {
    const [noticias, configuracoes] = await Promise.all([
      pegarTodasNoticias(),
      pegarConfiguracoes()
    ]);

    return res.render("admin/noticias", {
      title: "Administrar Notícias",
      noticias,
      configuracoes
    });
  } catch (error) {
    console.error("Erro ao carregar notícias:", error);

    return res.status(500).send(
      "Erro ao carregar as notícias."
    );
  }
});

// ==========================================
// CRUD DE NOTÍCIAS
// ==========================================

router.post("/noticias", uploadImagem, criar);

router.put("/noticias/:id", uploadImagem, atualizar);

router.delete("/noticias/:id", deletar);

router.patch("/noticias/:id/arquivar", arquivar);

router.patch("/noticias/:id/desarquivar", desarquivar);

// ==========================================
// ATIVAR / DESATIVAR NOTÍCIAS
// ==========================================

router.post("/noticias/ativar", async (req, res) => {
  try {
    await ativarNoticias();

    return res.json({
      sucesso: true,
      mensagem: "Seção de notícias ativada."
    });
  } catch (error) {
    console.error("Erro ao ativar notícias:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao ativar a seção de notícias."
    });
  }
});

router.post("/noticias/desativar", async (req, res) => {
  try {
    await desativarNoticias();

    return res.json({
      sucesso: true,
      mensagem: "Seção de notícias desativada."
    });
  } catch (error) {
    console.error("Erro ao desativar notícias:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao desativar a seção de notícias."
    });
  }
});

// ==========================================
// ATIVAR / DESATIVAR APLICAÇÕES
// ==========================================

router.post("/aplicacoes/ativar", async (req, res) => {
  try {
    await ativarAplicacoes();

    return res.json({
      sucesso: true,
      mensagem: "Seção de aplicações ativada."
    });
  } catch (error) {
    console.error("Erro ao ativar aplicações:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao ativar a seção de aplicações."
    });
  }
});

router.post("/aplicacoes/desativar", async (req, res) => {
  try {
    await desativarAplicacoes();

    return res.json({
      sucesso: true,
      mensagem: "Seção de aplicações desativada."
    });
  } catch (error) {
    console.error("Erro ao desativar aplicações:", error);

    return res.status(500).json({
      sucesso: false,
      erro: "Erro ao desativar a seção de aplicações."
    });
  }
});

// ==========================================
// EXPORTAÇÃO
// ==========================================
router.post("/inicio/salvar", async (req, res) => {
  try {
    await salvarConteudoInicio(req.body);

    res.redirect("/admin/inicio?salvo=1");
  } catch (error) {
    console.error("Erro ao salvar o conteúdo da página inicial:", error);

    res.status(500).send(
      "Não foi possível salvar o conteúdo da página inicial."
    );
  }
});

module.exports = router;
