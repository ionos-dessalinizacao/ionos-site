const express = require("express");
const router = express.Router();

const controller = require("../controllers/equipeController");
const uploadMembro = require("../middlewares/uploadMembro");

// Página pública.
router.get("/equipe", controller.paginaPublicaEquipe);

// Página administrativa.
router.get("/admin/equipe", controller.paginaAdminEquipe);

// Criar.
router.post(
  "/admin/equipe/criar",
  uploadMembro.single("imagem"),
  controller.criar
);

// Atualizar.
router.put(
  "/admin/equipe/:id",
  uploadMembro.single("imagem"),
  controller.atualizar
);

// Arquivar.
router.put(
  "/admin/equipe/:id/arquivar",
  controller.arquivar
);

// Restaurar.
router.put(
  "/admin/equipe/:id/desarquivar",
  controller.desarquivar
);

// Excluir.
router.delete(
  "/admin/equipe/:id",
  controller.deletar
);

module.exports = router;
