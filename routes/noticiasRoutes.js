
const express = require("express");
const router = express.Router();

const {
  listarNoticias
} = require("../controllers/noticiasController");

router.get("/", listarNoticias);

module.exports = router;
