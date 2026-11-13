var express = require("express");
var router = express.Router();

var postsController = require("../controllers/postsController");
var upload = require("../config/upload");

router.get("/config/casal", function (req, res) {
    postsController.buscarConfigCasal(req, res);
});

router.put("/config/sobre-ela", function (req, res) {
    postsController.atualizarSobreEla(req, res);
});

router.post("/config/musica", upload.musica.single("musica"), function (req, res) {
    postsController.atualizarMusicaCasal(req, res);
});

router.get("/qualidades", function (req, res) {
    postsController.listarQualidades(req, res);
});

router.post("/qualidades", function (req, res) {
    postsController.adicionarQualidade(req, res);
});

router.delete("/qualidades/:idQualidade", function (req, res) {
    postsController.removerQualidade(req, res);
});

router.get("/sonhos", function (req, res) {
    postsController.listarSonhos(req, res);
});

router.post("/sonhos", function (req, res) {
    postsController.adicionarSonho(req, res);
});

router.put("/sonhos/:idSonho/alternar", function (req, res) {
    postsController.alternarSonho(req, res);
});

router.delete("/sonhos/:idSonho", function (req, res) {
    postsController.removerSonho(req, res);
});

router.get("/lugares", function (req, res) {
    postsController.listarLugares(req, res);
});

router.post("/lugares", function (req, res) {
    postsController.adicionarLugar(req, res);
});

router.put("/lugares/:idLugar/alternar", function (req, res) {
    postsController.alternarLugar(req, res);
});

router.delete("/lugares/:idLugar", function (req, res) {
    postsController.removerLugar(req, res);
});

router.get("/capitulos", function (req, res) {
    postsController.listarCapitulos(req, res);
});

router.post("/capitulos", function (req, res) {
    postsController.adicionarCapitulo(req, res);
});

router.delete("/capitulos/:idCapitulo", function (req, res) {
    postsController.removerCapitulo(req, res);
});

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
