var mysql = require("mysql2");

var conexoes = mysql.createPool({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
});

function executar(instrucaoSql, valores) {
    return new Promise(function (resolve, reject) {
        conexoes.query(instrucaoSql, valores || [], function (erro, resultados) {
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });
    });
}

module.exports = {
    executar
};
