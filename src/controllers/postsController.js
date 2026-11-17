var postsModel = require("../models/postsModel");

function listarTodos(req, res) {
    var idUsuarioLogado = req.query.idUsuario;

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
    var idUsuario = req.params.idUsuario;

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
    var idPost = req.params.idPost;
    var idUsuarioLogado = req.query.idUsuario;

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
    var idUsuario = req.body.idUsuarioServer;
    var titulo = req.body.tituloServer;
    var descricao = req.body.descricaoServer;
    var dataLembranca = req.body.dataLembrancaServer;
    var categoria = req.body.categoriaServer;

    var foto = null;

    if (req.file != undefined) {
        foto = "/uploads/" + req.file.filename;
    }

    var mensagemErro = "";

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
    var idPost = req.params.idPost;
    var idUsuario = req.body.idUsuarioServer;
    var titulo = req.body.tituloServer;
    var descricao = req.body.descricaoServer;
    var dataLembranca = req.body.dataLembrancaServer;
    var categoria = req.body.categoriaServer;

    var removerFoto = false;

    if (req.body.removerFotoServer == "true") {
        removerFoto = true;
    }

    var novaFoto = null;

    if (req.file != undefined) {
        novaFoto = "/uploads/" + req.file.filename;
    }

    var mensagemErro = "";

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

            var fotoFinal = resultado[0].foto;

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
    var idPost = req.params.idPost;
    var idUsuario = req.body.idUsuarioServer;

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
    var idPost = req.params.idPost;
    var idUsuario = req.body.idUsuarioServer;
    var curtiu;

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
    var idPost = req.params.idPost;

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
    var idPost = req.params.idPost;
    var idUsuario = req.body.idUsuarioServer;
    var texto = req.body.textoServer;

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
    var idComentario = req.params.idComentario;
    var idUsuario = req.body.idUsuarioServer;

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

function buscarConfigCasal(req, res) {
    postsModel.buscarConfigCasal()
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
    var idUsuario = req.body.idUsuarioServer;
    var titulo = req.body.tituloServer;
    var texto = req.body.textoServer;
    var assinatura = req.body.assinaturaServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para editar!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 160) {
        res.status(400).json({ erro: "Informe um título de até 160 caracteres!" });
    } else if (texto == undefined || texto == "") {
        res.status(400).json({ erro: "Escreva o texto da declaração!" });
    } else if (assinatura == undefined || assinatura == "" || assinatura.length > 160) {
        res.status(400).json({ erro: "Informe uma assinatura de até 160 caracteres!" });
    } else {
        postsModel.atualizarSobreEla(titulo, texto, assinatura)
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

function atualizarMusicaCasal(req, res) {
    var idUsuario = req.body.idUsuarioServer;

    if (req.file == undefined) {
        res.status(400).json({ erro: "Escolha um arquivo de música!" });
        return;
    }

    var musicaUrl = "/uploads/" + req.file.filename;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para trocar a música!" });
        return;
    }

    var nomeOriginal = Buffer.from(req.file.originalname, "latin1").toString("utf8");

    var posicaoPonto = nomeOriginal.lastIndexOf(".");
    var musicaNome = nomeOriginal.substring(0, posicaoPonto);

    musicaNome = musicaNome.substring(0, 120);

    postsModel.atualizarMusicaCasal(musicaUrl, musicaNome)
        .then(function () {
            res.json({ musicaUrl: musicaUrl, musicaNome: musicaNome });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao salvar a música." });
        });
}

function listarSonhos(req, res) {
    postsModel.listarSonhos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os sonhos." });
        });
}

function adicionarSonho(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var titulo = req.body.tituloServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 180) {
        res.status(400).json({ erro: "Escreva um sonho de até 180 caracteres!" });
    } else {
        postsModel.adicionarSonho(idUsuario, titulo)
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
    var idSonho = req.params.idSonho;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um sonho!" });
        return;
    }

    postsModel.alternarSonho(idSonho)
        .then(function () {
            res.json({ id: idSonho });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao atualizar o sonho." });
        });
}

function removerSonho(req, res) {
    var idSonho = req.params.idSonho;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerSonho(idSonho)
        .then(function () {
            res.json({ id: idSonho });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao remover o sonho." });
        });
}

function listarLugares(req, res) {
    postsModel.listarLugares()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os lugares." });
        });
}

function adicionarLugar(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var nome = req.body.nomeServer;
    var tipo = req.body.tipoServer;
    var nota = req.body.notaServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (nome == undefined || nome == "" || nome.length > 120) {
        res.status(400).json({ erro: "Informe um destino de até 120 caracteres!" });
    } else if (tipo == undefined || tipo == "" || tipo.length > 60) {
        res.status(400).json({ erro: "Escolha o tipo de passeio!" });
    } else if (nota == undefined || nota == "" || nota.length > 255) {
        res.status(400).json({ erro: "Conte o que querem fazer lá (até 255 caracteres)!" });
    } else {
        postsModel.adicionarLugar(idUsuario, nome, tipo, nota)
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
    var idLugar = req.params.idLugar;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um lugar!" });
        return;
    }

    postsModel.alternarLugar(idLugar)
        .then(function () {
            res.json({ id: idLugar });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao atualizar o lugar." });
        });
}

function removerLugar(req, res) {
    var idLugar = req.params.idLugar;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerLugar(idLugar)
        .then(function () {
            res.json({ id: idLugar });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao remover o lugar." });
        });
}

function listarCapitulos(req, res) {
    postsModel.listarCapitulos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao listar os capítulos." });
        });
}

function adicionarCapitulo(req, res) {
    var idUsuario = req.body.idUsuarioServer;
    var etiqueta = req.body.etiquetaServer;
    var titulo = req.body.tituloServer;
    var descricao = req.body.descricaoServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (etiqueta == undefined || etiqueta == "" || etiqueta.length > 50) {
        res.status(400).json({ erro: "Informe uma etiqueta de até 50 caracteres!" });
    } else if (titulo == undefined || titulo == "" || titulo.length > 120) {
        res.status(400).json({ erro: "Informe um título de até 120 caracteres!" });
    } else if (descricao == undefined || descricao == "") {
        res.status(400).json({ erro: "Conte a história desse momento!" });
    } else {
        postsModel.adicionarCapitulo(idUsuario, etiqueta, titulo, descricao)
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
    var idCapitulo = req.params.idCapitulo;
    var idUsuario = req.body.idUsuarioServer;

    if (idUsuario == undefined) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerCapitulo(idCapitulo)
        .then(function () {
            res.json({ id: idCapitulo });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao remover o capítulo." });
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
    deletarComentario,
    buscarConfigCasal,
    atualizarSobreEla,
    atualizarMusicaCasal,
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
