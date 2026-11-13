var database = require("../database/config");

function autenticar(email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> Se aqui der erro de 'Error: connect ECONNREFUSED',\n \t\t >> verifique suas credenciais de acesso ao banco\n \t\t >> e se o servidor de seu BD está rodando corretamente. \n\n function autenticar(): ", email);

    var instrucaoSql = `
        SELECT id, nome, email, foto_perfil AS fotoPerfil, DATE_FORMAT(dt_cadastro, '%d/%m/%Y') AS dtCadastro
        FROM usuario
        WHERE email = ? AND senha = ?;
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [email, senha]);
}

function cadastrar(nome, email, senha) {
    console.log("ACESSEI O USUARIO MODEL \n \n\t\t >> function cadastrar():", nome, email);

    var instrucaoSql = `
        INSERT INTO usuario (nome, email, senha) VALUES (?, ?, ?);
    `;
    console.log("Executando a instrução SQL: \n" + instrucaoSql);
    return database.executar(instrucaoSql, [nome, email, senha]);
}

function buscarPorId(idUsuario) {
    var instrucaoSql = `
        SELECT id, nome, email, foto_perfil AS fotoPerfil, DATE_FORMAT(dt_cadastro, '%d/%m/%Y') AS dtCadastro
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
