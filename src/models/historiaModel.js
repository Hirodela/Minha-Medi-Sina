let database = require("../database/config");

function listarCapitulos() {
    let instrucaoSql = `
        SELECT id, etiqueta, titulo, descricao
        FROM capitulo_historia
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarCapitulo(idUsuario, etiqueta, titulo, descricao) {
    let instrucaoSql = `
        INSERT INTO capitulo_historia (fk_usuario, etiqueta, titulo, descricao) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, etiqueta, titulo, descricao]);
}

function removerCapitulo(idCapitulo) {
    let instrucaoSql = `
        DELETE FROM capitulo_historia WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idCapitulo]);
}

function listarSonhos() {
    let instrucaoSql = `
        SELECT id, titulo, realizado
        FROM sonho_casal
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarSonho(idUsuario, titulo) {
    let instrucaoSql = `
        INSERT INTO sonho_casal (fk_usuario, titulo) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, titulo]);
}

function alternarSonho(idSonho) {
    let instrucaoSql = `
        UPDATE sonho_casal SET realizado = NOT realizado WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idSonho]);
}

function removerSonho(idSonho) {
    let instrucaoSql = `
        DELETE FROM sonho_casal WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idSonho]);
}

function listarLugares() {
    let instrucaoSql = `
        SELECT id, nome, tipo, nota, visitado
        FROM lugar_casal
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarLugar(idUsuario, nome, tipo, nota) {
    let instrucaoSql = `
        INSERT INTO lugar_casal (fk_usuario, nome, tipo, nota) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, nome, tipo, nota]);
}

function alternarLugar(idLugar) {
    let instrucaoSql = `
        UPDATE lugar_casal SET visitado = NOT visitado WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idLugar]);
}

function removerLugar(idLugar) {
    let instrucaoSql = `
        DELETE FROM lugar_casal WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idLugar]);
}

module.exports = {
    listarCapitulos,
    adicionarCapitulo,
    removerCapitulo,
    listarSonhos,
    adicionarSonho,
    alternarSonho,
    removerSonho,
    listarLugares,
    adicionarLugar,
    alternarLugar,
    removerLugar
};
