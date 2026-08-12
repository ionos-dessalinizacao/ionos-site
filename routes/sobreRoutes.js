const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.render("sobre", {
    title: "Sobre Nós | Ionos"
  });

});

module.exports = router;