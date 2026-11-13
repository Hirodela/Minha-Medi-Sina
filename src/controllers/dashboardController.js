var dashboardModel = require("../models/dashboardModel");

function obterMetricas(req, res) {
    var kpis;

    dashboardModel.buscarKpis()
        .then(function (resultadoKpis) {
            kpis = resultadoKpis[0];
            return dashboardModel.buscarMetricasPorCategoria();
        })
        .then(function (resultadoCategorias) {
            var categorias = [];

            for (var i = 0; i < resultadoCategorias.length; i++) {
                categorias.push({
                    categoria: resultadoCategorias[i].categoria,
                    totalPosts: Number(resultadoCategorias[i].totalPosts),
                    totalCurtidas: Number(resultadoCategorias[i].totalCurtidas),
                    totalComentarios: Number(resultadoCategorias[i].totalComentarios)
                });
            }

            res.json({
                totalPosts: kpis.totalPosts,
                totalCurtidas: kpis.totalCurtidas,
                totalComentarios: kpis.totalComentarios,
                categoriaFavorita: categorias.length > 0 ? categorias[0].categoria : null,
                totalSonhos: kpis.totalSonhos,
                sonhosRealizados: kpis.sonhosRealizados,
                totalLugares: kpis.totalLugares,
                lugaresVisitados: kpis.lugaresVisitados,
                categorias: categorias
            });
        })
        .catch(function (erro) {
            console.log(erro);
            console.log("\nHouve um erro ao buscar as métricas! Erro: ", erro.sqlMessage);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

module.exports = {
    obterMetricas
};
