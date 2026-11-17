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

            var categoriaFavorita = null;

            if (categorias.length > 0) {
                categoriaFavorita = categorias[0].categoria;
            }

            res.json({
                totalPosts: kpis.totalPosts,
                totalCurtidas: kpis.totalCurtidas,
                totalComentarios: kpis.totalComentarios,
                categoriaFavorita: categoriaFavorita,
                totalSonhos: kpis.totalSonhos,
                sonhosRealizados: kpis.sonhosRealizados,
                totalLugares: kpis.totalLugares,
                lugaresVisitados: kpis.lugaresVisitados,
                categorias: categorias
            });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao buscar as métricas." });
        });
}

module.exports = {
    obterMetricas
};
