let database = require("../database/config");

function buscarConfig() {
    let instrucaoSql = `
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

function atualizarSobreEla(titulo, texto, assinatura) {
    let instrucaoSql = `
        UPDATE config_casal
        SET sobre_titulo = ?, sobre_texto = ?, sobre_assinatura = ?
        WHERE id = 1;
    `;
    return database.executar(instrucaoSql, [titulo, texto, assinatura]);
}

function atualizarMusica(musicaUrl, musicaNome) {
    let instrucaoSql = `
        UPDATE config_casal SET musica_url = ?, musica_nome = ? WHERE id = 1;
    `;
    return database.executar(instrucaoSql, [musicaUrl, musicaNome]);
}

module.exports = {
    buscarConfig,
    atualizarSobreEla,
    atualizarMusica
};
