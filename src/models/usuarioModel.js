let database = require("../database/config");

function autenticar(email, senha) {
    let instrucaoSql = `
        SELECT id, nome, foto_perfil AS fotoPerfil,
               (fk_admin IS NULL) AS ehAdmin
        FROM usuario
        WHERE email = ? AND senha = ?;
    `;
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    let instrucaoSql = `
        INSERT INTO usuario (nome, email, senha, fk_admin) VALUES (?, ?, ?, 1);
    `;
    return database.executar(instrucaoSql, [nome, email, senha]);
}
function buscarPorId(idUsuario) {
    let instrucaoSql = `
        SELECT id, nome, foto_perfil AS fotoPerfil
        FROM usuario
        WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario]);
}

function atualizarNome(idUsuario, nome) {
    let instrucaoSql = `
        UPDATE usuario SET nome = ? WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [nome, idUsuario]);
}

function atualizarFotoPerfil(idUsuario, fotoPerfil) {
    let instrucaoSql = `
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
