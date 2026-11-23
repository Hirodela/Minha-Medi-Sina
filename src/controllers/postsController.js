let postsModel = require("../models/postsModel");

function listarTodos(req, res) {
    let idUsuarioLogado = req.query.idUsuario;

    if (idUsuarioLogado == undefined) {
        idUsuarioLogado = 0;
    }

    postsModel.listarTodos(idUsuarioLogado)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os posts." });
        });
}

function listarPorUsuario(req, res) {
    let idUsuario = req.params.idUsuario;

    postsModel.listarPorUsuario(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os posts do usuário." });
        });
}

function buscarPorId(req, res) {
    let idPost = req.params.idPost;
    let idUsuarioLogado = req.query.idUsuario;

    if (idUsuarioLogado == undefined) {
        idUsuarioLogado = 0;
    }

    postsModel.buscarPorId(idPost, idUsuarioLogado)
        .then(function (resultado) {
            if (resultado.length == 1) {
                res.json(resultado[0]);
            } else {
                res.status(404).json({ erro: "Post não encontrado!" });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao buscar o post." });
        });
}

function publicar(req, res) {
    let idUsuario = req.body.idUsuarioServer;
    let titulo = req.body.tituloServer;
    let descricao = req.body.descricaoServer;
    let dataLembranca = req.body.dataLembrancaServer;
    let categoria = req.body.categoriaServer;

    let foto = null;

    if (req.file != undefined) {
        foto = "/uploads/" + req.file.filename;
    }

    let mensagemErro = "";

    if (idUsuario == undefined) {
        mensagemErro = "Você precisa entrar na sua conta para publicar!";
    } else if (titulo == undefined || titulo == "" || titulo.length > 120) {
        mensagemErro = "Informe um título de até 120 caracteres!";
    } else if (descricao == undefined || descricao == "") {
        mensagemErro = "Escreva a mensagem do post!";
    } else if (dataLembranca == undefined || dataLembranca.length != 10) {
        mensagemErro = "Informe a data do momento!";
    } else if (categoria != "Fotografias" && categoria != "Mensagens" && categoria != "Datas especiais" && categoria != "Momentos engraçados") {
        mensagemErro = "Escolha uma categoria válida!";
    }

    if (mensagemErro != "") {
        res.status(400).json({ erro: mensagemErro });
        return;
    }

    postsModel.publicar(idUsuario, titulo, descricao, dataLembranca, categoria, foto)
        .then(function (resultado) {
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao publicar o post." });
        });
}

function editar(req, res) {
    let idPost = req.params.idPost;
    let idUsuario = req.body.idUsuarioServer;
    let titulo = req.body.tituloServer;
    let descricao = req.body.descricaoServer;
    let dataLembranca = req.body.dataLembrancaServer;
    let categoria = req.body.categoriaServer;

    let removerFoto = false;

    if (req.body.removerFotoServer == "true") {
        removerFoto = true;
    }

    let novaFoto = null;

    if (req.file != undefined) {
        novaFoto = "/uploads/" + req.file.filename;
    }

    let mensagemErro = "";

    if (idUsuario == undefined) {
        mensagemErro = "Você precisa entrar na sua conta para publicar!";
    } else if (titulo == undefined || titulo == "" || titulo.length > 120) {
        mensagemErro = "Informe um título de até 120 caracteres!";
    } else if (descricao == undefined || descricao == "") {
        mensagemErro = "Escreva a mensagem do post!";
    } else if (dataLembranca == undefined || dataLembranca.length != 10) {
        mensagemErro = "Informe a data do momento!";
    } else if (categoria != "Fotografias" && categoria != "Mensagens" && categoria != "Datas especiais" && categoria != "Momentos engraçados") {
        mensagemErro = "Escolha uma categoria válida!";
    }

    if (mensagemErro != "") {
        res.status(400).json({ erro: mensagemErro });
        return;
    }

    postsModel.buscarPorId(idPost, idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).json({ erro: "Post não encontrado!" });
                return;
            }

            if (resultado[0].idUsuario != idUsuario) {
                res.status(403).json({ erro: "Você só pode editar os seus próprios posts!" });
                return;
            }

            let fotoFinal = resultado[0].foto;

            if (novaFoto != null) {
                fotoFinal = novaFoto;
            } else if (removerFoto == true) {
                fotoFinal = null;
            }

            return postsModel.editar(idPost, idUsuario, titulo, descricao, dataLembranca, categoria, fotoFinal)
                .then(function () {
                    res.json({ id: idPost });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao editar o post." });
        });
}

function deletar(req, res) {
    let idPost = req.params.idPost;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Dados insuficientes para excluir o post!" });
        return;
    }

    postsModel.buscarPorId(idPost, idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).json({ erro: "Post não encontrado!" });
                return;
            }

            if (resultado[0].idUsuario != idUsuario) {
                res.status(403).json({ erro: "Você só pode excluir os seus próprios posts!" });
                return;
            }

            return postsModel.deletar(idPost)
                .then(function () {
                    res.json({ id: idPost });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao excluir o post." });
        });
}

function alternarCurtida(req, res) {
    let idPost = req.params.idPost;
    let idUsuario = req.body.idUsuarioServer;
    let curtiu;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para curtir!" });
        return;
    }

    postsModel.verificarCurtida(idUsuario, idPost)
        .then(function (resultado) {
            if (resultado.length > 0) {
                curtiu = false;
                return postsModel.removerCurtida(idUsuario, idPost);
            } else {
                curtiu = true;
                return postsModel.adicionarCurtida(idUsuario, idPost);
            }
        })
        .then(function () {
            return postsModel.contarCurtidasPost(idPost);
        })
        .then(function (resultado) {
            res.json({ curtiu: curtiu, totalCurtidas: resultado[0].totalCurtidas });
        })
        .catch(function (erro) {
            if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                res.status(404).json({ erro: "Post ou usuário não encontrado!" });
            } else {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao curtir o post." });
            }
        });
}

function listarComentarios(req, res) {
    let idPost = req.params.idPost;

    postsModel.listarComentarios(idPost)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os comentários." });
        });
}

function comentar(req, res) {
    let idPost = req.params.idPost;
    let idUsuario = req.body.idUsuarioServer;
    let texto = req.body.textoServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para comentar!" });
    } else if (texto == undefined || texto == "" || texto.length > 500) {
        res.status(400).json({ erro: "Escreva um comentário de até 500 caracteres!" });
    } else {
        postsModel.adicionarComentario(idUsuario, idPost, texto)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                if (erro.code == "ER_NO_REFERENCED_ROW_2") {
                    res.status(404).json({ erro: "Post ou usuário não encontrado!" });
                } else {
                    console.log(erro);
                    res.status(500).json({ erro: "Houve um erro ao comentar." });
                }
            });
    }
}

function deletarComentario(req, res) {
    let idComentario = req.params.idComentario;
    let idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Dados insuficientes para excluir o comentário!" });
        return;
    }

    postsModel.removerComentario(idComentario, idUsuario)
        .then(function (resultado) {
            if (resultado.affectedRows == 0) {
                res.status(403).json({ erro: "Você só pode excluir os seus próprios comentários!" });
            } else {
                res.json({ id: idComentario });
            }
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao excluir o comentário." });
        });
}

module.exports = {
    listarTodos,
    listarPorUsuario,
    buscarPorId,
    publicar,
    editar,
    deletar,
    alternarCurtida,
    listarComentarios,
    comentar,
    deletarComentario
};
