let express = require("express");
let router = express.Router();

let dashboardController = require("../controllers/dashboardController");

router.get("/metricas", function (req, res) {
    dashboardController.obterMetricas(req, res);
});

module.exports = router;
