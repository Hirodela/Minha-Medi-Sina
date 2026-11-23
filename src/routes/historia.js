let express = require("express");
let router = express.Router();

let historiaController = require("../controllers/historiaController");

router.get("/capitulos", function (req, res) {
    historiaController.listarCapitulos(req, res);
});

router.post("/capitulos", function (req, res) {
    historiaController.adicionarCapitulo(req, res);
});

router.delete("/capitulos/:idCapitulo", function (req, res) {
    historiaController.removerCapitulo(req, res);
});

router.get("/sonhos", function (req, res) {
    historiaController.listarSonhos(req, res);
});

router.post("/sonhos", function (req, res) {
    historiaController.adicionarSonho(req, res);
});

router.put("/sonhos/:idSonho/alternar", function (req, res) {
    historiaController.alternarSonho(req, res);
});

router.delete("/sonhos/:idSonho", function (req, res) {
    historiaController.removerSonho(req, res);
});

router.get("/lugares", function (req, res) {
    historiaController.listarLugares(req, res);
});

router.post("/lugares", function (req, res) {
    historiaController.adicionarLugar(req, res);
});

router.put("/lugares/:idLugar/alternar", function (req, res) {
    historiaController.alternarLugar(req, res);
});

router.delete("/lugares/:idLugar", function (req, res) {
    historiaController.removerLugar(req, res);
});

module.exports = router;
