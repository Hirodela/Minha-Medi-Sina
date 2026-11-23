let express = require("express");
let router = express.Router();

let postsController = require("../controllers/postsController");
let upload = require("../config/upload");

router.delete("/comentarios/:idComentario", function (req, res) {
    postsController.deletarComentario(req, res);
});

router.get("/", function (req, res) {
    postsController.listarTodos(req, res);
});

router.get("/usuario/:idUsuario", function (req, res) {
    postsController.listarPorUsuario(req, res);
});

router.post("/", upload.imagem.single("foto"), function (req, res) {
    postsController.publicar(req, res);
});

router.get("/:idPost", function (req, res) {
    postsController.buscarPorId(req, res);
});

router.put("/:idPost", upload.imagem.single("foto"), function (req, res) {
    postsController.editar(req, res);
});

router.delete("/:idPost", function (req, res) {
    postsController.deletar(req, res);
});

router.post("/:idPost/curtir", function (req, res) {
    postsController.alternarCurtida(req, res);
});

router.get("/:idPost/comentarios", function (req, res) {
    postsController.listarComentarios(req, res);
});

router.post("/:idPost/comentarios", function (req, res) {
    postsController.comentar(req, res);
});

module.exports = router;
