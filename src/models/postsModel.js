var database = require("../database/config");

function listarTodos(idUsuarioLogado) {
    var instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        ORDER BY dataLembranca DESC, id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuarioLogado]);
}

function listarPorUsuario(idUsuario) {
    var instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        WHERE idUsuario = ?
        ORDER BY dataLembranca DESC, id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuario, idUsuario]);
}

function buscarPorId(idPost, idUsuarioLogado) {
    var instrucaoSql = `
        SELECT vw_post_completo.*,
               (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = vw_post_completo.id AND curtida.fk_usuario = ?) AS curtiu
        FROM vw_post_completo
        WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idUsuarioLogado, idPost]);
}

function publicar(idUsuario, titulo, descricao, dataLembranca, categoria, foto) {
    var instrucaoSql = `
        INSERT INTO post (fk_usuario, titulo, descricao, data_lembranca, categoria, foto)
        VALUES (?, ?, ?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, titulo, descricao, dataLembranca, categoria, foto]);
}

function editar(idPost, idUsuario, titulo, descricao, dataLembranca, categoria, foto) {
    var instrucaoSql = `
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
    var instrucaoSql = `
        SELECT fk_usuario FROM curtida WHERE fk_usuario = ? AND fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function adicionarCurtida(idUsuario, idPost) {
    var instrucaoSql = `
        INSERT INTO curtida (fk_usuario, fk_post) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function removerCurtida(idUsuario, idPost) {
    var instrucaoSql = `
        DELETE FROM curtida WHERE fk_usuario = ? AND fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost]);
}

function contarCurtidasPost(idPost) {
    var instrucaoSql = `
        SELECT COUNT(*) AS totalCurtidas FROM curtida WHERE fk_post = ?;
    `;
    return database.executar(instrucaoSql, [idPost]);
}

function listarComentarios(idPost) {
    var instrucaoSql = `
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
    var instrucaoSql = `
        INSERT INTO comentario (fk_usuario, fk_post, texto) VALUES (?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, idPost, texto]);
}

function removerComentario(idComentario, idUsuario) {
    var instrucaoSql = `
        DELETE FROM comentario WHERE id = ? AND fk_usuario = ?;
    `;
    return database.executar(instrucaoSql, [idComentario, idUsuario]);
}

function buscarConfigCasal() {
    var instrucaoSql = `
        SELECT
            sobre_titulo AS sobreTitulo,
            sobre_texto AS sobreTexto,
            sobre_assinatura AS sobreAssinatura,
            musica_url AS musicaUrl,
            musica_nome AS musicaNome
        FROM config_casal
        WHERE id = 1;
    `;
    return database.executar(instrucaoSql);
}

function atualizarMusicaCasal(musicaUrl, musicaNome) {
    var instrucaoSql = `
        UPDATE config_casal SET musica_url = ?, musica_nome = ? WHERE id = 1;
    `;
    return database.executar(instrucaoSql, [musicaUrl, musicaNome]);
}

function atualizarSobreEla(titulo, texto, assinatura) {
    var instrucaoSql = `
        UPDATE config_casal
        SET sobre_titulo = ?, sobre_texto = ?, sobre_assinatura = ?
        WHERE id = 1;
    `;
    return database.executar(instrucaoSql, [titulo, texto, assinatura]);
}

function listarSonhos() {
    var instrucaoSql = `
        SELECT id, titulo, realizado
        FROM sonho_casal
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarSonho(idUsuario, titulo) {
    var instrucaoSql = `
        INSERT INTO sonho_casal (fk_usuario, titulo) VALUES (?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, titulo]);
}

function alternarSonho(idSonho) {
    var instrucaoSql = `
        UPDATE sonho_casal SET realizado = NOT realizado WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idSonho]);
}

function removerSonho(idSonho) {
    var instrucaoSql = `
        DELETE FROM sonho_casal WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idSonho]);
}

function listarLugares() {
    var instrucaoSql = `
        SELECT id, nome, tipo, nota, visitado
        FROM lugar_casal
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarLugar(idUsuario, nome, tipo, nota) {
    var instrucaoSql = `
        INSERT INTO lugar_casal (fk_usuario, nome, tipo, nota) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, nome, tipo, nota]);
}

function alternarLugar(idLugar) {
    var instrucaoSql = `
        UPDATE lugar_casal SET visitado = NOT visitado WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idLugar]);
}

function removerLugar(idLugar) {
    var instrucaoSql = `
        DELETE FROM lugar_casal WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idLugar]);
}

function listarCapitulos() {
    var instrucaoSql = `
        SELECT id, etiqueta, titulo, descricao
        FROM capitulo_historia
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarCapitulo(idUsuario, etiqueta, titulo, descricao) {
    var instrucaoSql = `
        INSERT INTO capitulo_historia (fk_usuario, etiqueta, titulo, descricao) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, etiqueta, titulo, descricao]);
}

function removerCapitulo(idCapitulo) {
    var instrucaoSql = `
        DELETE FROM capitulo_historia WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idCapitulo]);
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
    removerComentario,
    buscarConfigCasal,
    atualizarMusicaCasal,
    atualizarSobreEla,
    listarSonhos,
    adicionarSonho,
    alternarSonho,
    removerSonho,
    listarLugares,
    adicionarLugar,
    alternarLugar,
    removerLugar,
    listarCapitulos,
    adicionarCapitulo,
    removerCapitulo
};
