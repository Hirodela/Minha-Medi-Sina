var database = require("../database/config");

function autenticar(email, senha) {
    var instrucaoSql = `
        SELECT id, nome, foto_perfil AS fotoPerfil
        FROM usuario
        WHERE email = ? AND senha = ?;
    `;
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [nome, email, senha]);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT id, nome, foto_perfil AS fotoPerfil
        FROM usuario
        WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizarNome(idUsuario, nome) {
    var instrucaoSql = `
        UPDATE usuario SET nome = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [nome, idUsuario]);
}

function atualizarFotoPerfil(idUsuario, fotoPerfil) {
    var instrucaoSql = `
        UPDATE usuario SET foto_perfil = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [fotoPerfil, idUsuario]);
}

module.exports = {
    autenticar,
    cadastrar,
    buscarPorId,
    atualizarNome,
    atualizarFotoPerfil
};
