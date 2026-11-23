let database = require("../database/config");

function listarTodos(idUsuarioLogado) {
    let instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        ORDER BY dataLembranca DESC, id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuarioLogado]);
}

function listarPorUsuario(idUsuario) {
    let instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        WHERE idUsuario = ?
        ORDER BY dataLembranca DESC, id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuario, idUsuario]);
}

function buscarPorId(idPost, idUsuarioLogado) {
    let instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idUsuarioLogado, idPost]);
}

function publicar(idUsuario, titulo, descricao, dataLembranca, categoria, foto) {
    let instrucaoSql = `
        INSERT INTO post (fk_usuario, titulo, descricao, data_lembranca, categoria, foto)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, titulo, descricao, dataLembranca, categoria, foto]);
}

function editar(idPost, idUsuario, titulo, descricao, dataLembranca, categoria, foto) {
    let instrucaoSql = `
        UPDATE post
        SET titulo = ?, descricao = ?, data_lembranca = ?, categoria = ?, foto = ?
        WHERE id = ? AND fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [titulo, descricao, dataLembranca, categoria, foto, idPost, idUsuario]);
}

function deletar(idPost) {
    return database.executar("DELETE FROM curtida WHERE fk_post = ?;", [idPost])
        .then(function () {
            return database.executar("DELETE FROM comentario WHERE fk_post = ?;", [idPost]);
        })
        .then(function () {
            return database.executar("DELETE FROM post WHERE id = ?;", [idPost]);
        });
}

function verificarCurtida(idUsuario, idPost) {
    let instrucaoSql = `
        SELECT fk_usuario FROM curtida WHERE fk_usuario = ? AND fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function adicionarCurtida(idUsuario, idPost) {
    let instrucaoSql = `
        INSERT INTO curtida (fk_usuario, fk_post) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function removerCurtida(idUsuario, idPost) {
    let instrucaoSql = `
        DELETE FROM curtida WHERE fk_usuario = ? AND fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function contarCurtidasPost(idPost) {
    let instrucaoSql = `
        SELECT COUNT(*) AS totalCurtidas FROM curtida WHERE fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idPost]);
}

function listarComentarios(idPost) {
    let instrucaoSql = `
        SELECT comentario.id,
               comentario.fk_usuario AS idUsuario,
               usuario.nome AS autor,
               comentario.texto,
               DATE_FORMAT(comentario.dt_comentario, '%d/%m/%Y %H:%i') AS dataComentario
        FROM comentario
        JOIN usuario ON comentario.fk_usuario = usuario.id
        WHERE comentario.fk_post = ?
        ORDER BY comentario.id;
    `;
    return database.executar(instrucaoSql, [idPost]);
}

function adicionarComentario(idUsuario, idPost, texto) {
    let instrucaoSql = `
        INSERT INTO comentario (fk_usuario, fk_post, texto) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost, texto]);
}

function removerComentario(idComentario, idUsuario) {
    let instrucaoSql = `
        DELETE FROM comentario WHERE id = ? AND fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [idComentario, idUsuario]);
}

module.exports = {
    listarTodos,
    listarPorUsuario,
    buscarPorId,
    publicar,
    editar,
    deletar,
    verificarCurtida,
    adicionarCurtida,
    removerCurtida,
    contarCurtidasPost,
    listarComentarios,
    adicionarComentario,
    removerComentario
};
