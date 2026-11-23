let casalModel = require("../models/casalModel");

function buscarConfig(req, res) {
    casalModel.buscarConfig()
        .then(function (resultado) {
            if (resultado.length == 1) {
                res.json(resultado[0]);
            } else {
                res.status(404).json({ erro: "As configurações do casal não foram cadastradas no banco!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao buscar as configurações." });
        });
}

function atualizarSobreEla(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let titulo = req.body.tituloServer;
    let texto = req.body.textoServer;
    let assinatura = req.body.assinaturaServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para editar!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 160) {
        res.status(400).json({ erro: "Informe um título de até 160 caracteres!" });
    } else if (texto == undefined || texto == "") {
        res.status(400).json({ erro: "Escreva o texto da declaração!" });
    } else if (assinatura == undefined || assinatura == "" || assinatura.length > 160) {
        res.status(400).json({ erro: "Informe uma assinatura de até 160 caracteres!" });
    } else {
        casalModel.atualizarSobreEla(titulo, texto, assinatura)
            .then(function () {
                res.json({
                    sobreTitulo: titulo,
                    sobreTexto: texto,
                    sobreAssinatura: assinatura
                });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao salvar a declaração." });
            });
    }
}

function atualizarMusica(req, res) {
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para trocar a música!" });
    } else if (req.file == undefined) {
        res.status(400).json({ erro: "Escolha um arquivo de música!" });
    } else {
        let musicaUrl = "/uploads/" + req.file.filename;

        let nomeOriginal = Buffer.from(req.file.originalname, "latin1").toString("utf8");
        let posicaoPonto = nomeOriginal.lastIndexOf(".");
        let musicaNome = nomeOriginal.substring(0, posicaoPonto).substring(0, 120);

        casalModel.atualizarMusica(musicaUrl, musicaNome)
            .then(function () {
                res.json({ musicaUrl: musicaUrl, musicaNome: musicaNome });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao salvar a música." });
            });
    }
}

module.exports = {
    buscarConfig,
    atualizarSobreEla,
    atualizarMusica
};
