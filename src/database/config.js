let mysql = require("mysql2");

let mySqlConfig = {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT
};

function executar(instrucaoSql, valores) {
    return new Promise(function (resolve, reject) {
        let conexao = mysql.createConnection(mySqlConfig);
        conexao.connect();
        conexao.query(instrucaoSql, valores, function (erro, resultados) {
            conexao.end();
            if (erro) {
                reject(erro);
            } else {
                resolve(resultados);
            }
        });
        conexao.on("error", function (erro) {
            console.log("ERRO NO MySQL SERVER: ", erro.message);
        });
    });
}

module.exports = {
    executar
};
