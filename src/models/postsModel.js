var database = require("../database/config");

var selecaoPosts = `
    SELECT
        p.id,
        p.fk_usuario AS idUsuario,
        u.nome AS autor,
        u.foto_perfil AS fotoAutor,
        p.titulo,
        p.descricao,
        DATE_FORMAT(p.data_lembranca, '%Y-%m-%d') AS dataLembranca,
        p.categoria,
        p.foto,
        (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = p.id) AS totalCurtidas,
        (SELECT COUNT(*) FROM comentario WHERE comentario.fk_post = p.id) AS totalComentarios,
        (SELECT COUNT(*) FROM curtida WHERE curtida.fk_post = p.id AND curtida.fk_usuario = ?) AS curtiu
    FROM post AS p
    JOIN usuario AS u ON u.id = p.fk_usuario
`;

function listarTodos(idUsuarioLogado) {
    var instrucaoSql = selecaoPosts + `
        ORDER BY p.data_lembranca DESC, p.id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuarioLogado]);
}

function listarPorUsuario(idUsuario) {
    var instrucaoSql = selecaoPosts + `
        WHERE p.fk_usuario = ?
        ORDER BY p.data_lembranca DESC, p.id DESC;
    `;
    return database.executar(instrucaoSql, [idUsuario, idUsuario]);
}

function buscarPorId(idPost, idUsuarioLogado) {
    var instrucaoSql = selecaoPosts + `
        WHERE p.id = ?;
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
        SELECT id FROM curtida WHERE fk_usuario = ? AND fk_post = ?;
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
        SELECT
            c.id,
            c.fk_usuario AS idUsuario,
            u.nome AS autor,
            c.texto,
            DATE_FORMAT(c.dt_comentario, '%d/%m/%Y %H:%i') AS dataComentario
        FROM comentario AS c
        JOIN usuario AS u ON u.id = c.fk_usuario
        WHERE c.fk_post = ?
        ORDER BY c.dt_comentario, c.id;
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
            DATE_FORMAT(data_inicio_amor, '%Y-%m-%d') AS dataInicioAmor,
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

function listarQualidades() {
    var instrucaoSql = `
        SELECT id, fk_usuario AS idUsuario, icone, titulo, descricao
        FROM qualidade_giovana
        ORDER BY id;
    `;
    return database.executar(instrucaoSql);
}

function adicionarQualidade(idUsuario, icone, titulo, descricao) {
    var instrucaoSql = `
        INSERT INTO qualidade_giovana (fk_usuario, icone, titulo, descricao) VALUES (?, ?, ?, ?);
    `;
    return database.executar(instrucaoSql, [idUsuario, icone, titulo, descricao]);
}

function removerQualidade(idQualidade) {
    var instrucaoSql = `
        DELETE FROM qualidade_giovana WHERE id = ?;
    `;
    return database.executar(instrucaoSql, [idQualidade]);
}

function listarSonhos() {
    var instrucaoSql = `
        SELECT id, fk_usuario AS idUsuario, titulo, realizado
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
        SELECT id, fk_usuario AS idUsuario, nome, tipo, nota, visitado
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
        SELECT id, fk_usuario AS idUsuario, etiqueta, titulo, descricao
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
    listarCapitulos,
    adicionarCapitulo,
    removerCapitulo,
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
    listarQualidades,
    adicionarQualidade,
    removerQualidade,
    listarSonhos,
    adicionarSonho,
    alternarSonho,
    removerSonho,
    listarLugares,
    adicionarLugar,
    alternarLugar,
    removerLugar
};
