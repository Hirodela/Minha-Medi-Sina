let express = require("express");
let router = express.Router();

let casalController = require("../controllers/casalController");
let upload = require("../config/upload");

router.get("/config", function (req, res) {
    casalController.buscarConfig(req, res);
});

router.put("/sobre-ela", function (req, res) {
    casalController.atualizarSobreEla(req, res);
});

router.post("/musica", upload.musica.single("musica"), function (req, res) {
    casalController.atualizarMusica(req, res);
});

module.exports = router;
