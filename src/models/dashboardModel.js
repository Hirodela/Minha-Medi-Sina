let database = require("../database/config");

function buscarKpis() {
    let instrucaoSql = `
        SELECT * FROM vw_dashboard_kpis;
    `;
    return database.executar(instrucaoSql);
}

function buscarMetricasPorCategoria() {
    let instrucaoSql = `
        SELECT * FROM vw_metricas_categoria
        ORDER BY totalPosts DESC, categoria;
    `;
    return database.executar(instrucaoSql);
}

module.exports = {
    buscarKpis,
    buscarMetricasPorCategoria
};
