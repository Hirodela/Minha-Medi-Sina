var database = require("../database/config");

function buscarKpis() {
    var instrucaoSql = `
        SELECT
            (SELECT COUNT(*) FROM post) AS totalPosts,
            (SELECT COUNT(*) FROM curtida) AS totalCurtidas,
            (SELECT COUNT(*) FROM comentario) AS totalComentarios,
            (SELECT COUNT(*) FROM sonho_casal) AS totalSonhos,
            (SELECT COUNT(*) FROM sonho_casal WHERE realizado = 1) AS sonhosRealizados,
            (SELECT COUNT(*) FROM lugar_casal) AS totalLugares,
            (SELECT COUNT(*) FROM lugar_casal WHERE visitado = 1) AS lugaresVisitados;
    `;
    return database.executar(instrucaoSql);
}

function buscarMetricasPorCategoria() {
    var instrucaoSql = `
        SELECT
            p.categoria,
            COUNT(*) AS totalPosts,
            SUM((SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = p.id)) AS totalCurtidas,
            SUM((SELECT COUNT(*) FROM comentario WHERE comentario.fk_post = p.id)) AS totalComentarios
        FROM post AS p
        GROUP BY p.categoria
        ORDER BY totalPosts DESC, p.categoria;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKpis,
    buscarMetricasPorCategoria
};
