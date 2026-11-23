let historiaModel = require("../models/historiaModel");

function listarCapitulos(req, res) {
    historiaModel.listarCapitulos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os capítulos." });
        });
}

function adicionarCapitulo(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let etiqueta = req.body.etiquetaServer;
    let titulo = req.body.tituloServer;
    let descricao = req.body.descricaoServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (etiqueta == undefined || etiqueta == "" || etiqueta.length > 50) {
        res.status(400).json({ erro: "Informe uma etiqueta de até 50 caracteres!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 120) {
        res.status(400).json({ erro: "Informe um título de até 120 caracteres!" });
    } else if (descricao == undefined || descricao == "") {
        res.status(400).json({ erro: "Conte a história desse momento!" });
    } else {
        historiaModel.adicionarCapitulo(idUsuario, etiqueta, titulo, descricao)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao adicionar o capítulo." });
            });
    }
}

function removerCapitulo(req, res) {
    let idCapitulo = req.params.idCapitulo;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
    } else {
        historiaModel.removerCapitulo(idCapitulo)
            .then(function () {
                res.json({ id: idCapitulo });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao remover o capítulo." });
            });
    }
}

function listarSonhos(req, res) {
    historiaModel.listarSonhos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os sonhos." });
        });
}

function adicionarSonho(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let titulo = req.body.tituloServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 180) {
        res.status(400).json({ erro: "Escreva um sonho de até 180 caracteres!" });
    } else {
        historiaModel.adicionarSonho(idUsuario, titulo)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao adicionar o sonho." });
            });
    }
}

function alternarSonho(req, res) {
    let idSonho = req.params.idSonho;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um sonho!" });
    } else {
        historiaModel.alternarSonho(idSonho)
            .then(function () {
                res.json({ id: idSonho });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao atualizar o sonho." });
            });
    }
}

function removerSonho(req, res) {
    let idSonho = req.params.idSonho;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
    } else {
        historiaModel.removerSonho(idSonho)
            .then(function () {
                res.json({ id: idSonho });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao remover o sonho." });
            });
    }
}

function listarLugares(req, res) {
    historiaModel.listarLugares()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os lugares." });
        });
}

function adicionarLugar(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let nome = req.body.nomeServer;
    let tipo = req.body.tipoServer;
    let nota = req.body.notaServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (nome == undefined || nome == "" || nome.length > 120) {
        res.status(400).json({ erro: "Informe um destino de até 120 caracteres!" });
    } else if (tipo == undefined || tipo == "" || tipo.length > 60) {
        res.status(400).json({ erro: "Escolha o tipo de passeio!" });
    } else if (nota == undefined || nota == "" || nota.length > 255) {
        res.status(400).json({ erro: "Conte o que querem fazer lá (até 255 caracteres)!" });
    } else {
        historiaModel.adicionarLugar(idUsuario, nome, tipo, nota)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao adicionar o lugar." });
            });
    }
}

function alternarLugar(req, res) {
    let idLugar = req.params.idLugar;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um lugar!" });
    } else {
        historiaModel.alternarLugar(idLugar)
            .then(function () {
                res.json({ id: idLugar });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao atualizar o lugar." });
            });
    }
}

function removerLugar(req, res) {
    let idLugar = req.params.idLugar;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
    } else {
        historiaModel.removerLugar(idLugar)
            .then(function () {
                res.json({ id: idLugar });
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao remover o lugar." });
            });
    }
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
