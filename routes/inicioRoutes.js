
const express = require("express");
const router = express.Router();

const {
  pegarConteudoInicio
} = require("../services/inicioService");

router.get("/", async (req, res) => {
  try {
    const conteudoInicio = await pegarConteudoInicio();

    res.render("index", {
      title: "Ionos Dessalinização",
      conteudoInicio
    });
  } catch (error) {
    console.error("Erro ao carregar a página inicial:", error);

    res.status(500).send(
      "Não foi possível carregar a página inicial."
    );
  }
});

module.exports = router;
