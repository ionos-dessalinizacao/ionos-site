const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {

  res.render("equipe", {
    title: "Equipe | Ionos"
  });

});

module.exports = router;