let express = require("express");
let router = express.Router();

let usuarioController = require("../controllers/usuarioController");
let upload = require("../config/upload");

router.post("/cadastrar", function (req, res) {
    usuarioController.cadastrar(req, res);
});

router.post("/autenticar", function (req, res) {
    usuarioController.autenticar(req, res);
});

router.put("/:idUsuario", function (req, res) {
    usuarioController.atualizarPerfil(req, res);
});

router.post("/:idUsuario/foto", upload.imagem.single("foto"), function (req, res) {
    usuarioController.atualizarFotoPerfil(req, res);
});

router.delete("/:idUsuario/foto", function (req, res) {
    usuarioController.removerFotoPerfil(req, res);
});

module.exports = router;