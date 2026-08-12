const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.render("aplicacoes", {
    title: "Aplicações | Ionos"
  });

});

module.exports = router;