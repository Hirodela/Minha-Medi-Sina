var database = require("../database/config");

function buscarKpis() {
    var instrucaoSql = `
        SELECT * FROM vw_dashboard_kpis;
    `;
    return database.executar(instrucaoSql);
}

function buscarMetricasPorCategoria() {
    var instrucaoSql = `
        SELECT * FROM vw_metricas_categoria
        ORDER BY totalPosts DESC, categoria;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKpis,
    buscarMetricasPorCategoria
};
