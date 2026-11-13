var postsModel = require("../models/postsModel");
var upload = require("../config/upload");

var categoriasValidas = ["Fotografias", "Mensagens", "Datas especiais", "Momentos engraçados"];

function responderErro(res, erro, acao) {
    console.log(erro);
    console.log("\nHouve um erro ao " + acao + "! Erro: ", erro.sqlMessage || erro.message);
    res.status(500).json({ erro: erro.sqlMessage || "Houve um erro ao " + acao + "." });
}

function textoLimpo(valor) {
    return String(valor || "").trim();
}

function dataValida(data) {
    return /^\d{4}-\d{2}-\d{2}$/.test(data) && !isNaN(new Date(data).getTime());
}

function validarPost(idUsuario, titulo, descricao, dataLembranca, categoria) {
    if (!idUsuario) {
        return "Você precisa entrar na sua conta para publicar!";
    } else if (titulo.length == 0 || titulo.length > 120) {
        return "Informe um título de até 120 caracteres!";
    } else if (descricao.length == 0) {
        return "Escreva a mensagem do post!";
    } else if (!dataValida(dataLembranca)) {
        return "Informe a data do momento!";
    } else if (!categoriasValidas.includes(categoria)) {
        return "Escolha uma categoria válida!";
    }
    return "";
}

function caminhoArquivoEnviado(req) {
    return req.file ? "/uploads/" + req.file.filename : null;
}

function listarTodos(req, res) {
    var idUsuarioLogado = Number(req.query.idUsuario) || 0;

    postsModel.listarTodos(idUsuarioLogado)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os posts");
        });
}

function listarPorUsuario(req, res) {
    var idUsuario = Number(req.params.idUsuario);

    if (!idUsuario) {
        res.status(400).json({ erro: "O id do usuário está indefinido!" });
        return;
    }

    postsModel.listarPorUsuario(idUsuario)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os posts do usuário");
        });
}

function buscarPorId(req, res) {
    var idPost = Number(req.params.idPost);
    var idUsuarioLogado = Number(req.query.idUsuario) || 0;

    if (!idPost) {
        res.status(400).json({ erro: "O id do post é inválido!" });
        return;
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
            responderErro(res, erro, "buscar o post");
        });
}

function publicar(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var titulo = textoLimpo(req.body.tituloServer);
    var descricao = textoLimpo(req.body.descricaoServer);
    var dataLembranca = textoLimpo(req.body.dataLembrancaServer);
    var categoria = textoLimpo(req.body.categoriaServer);
    var foto = caminhoArquivoEnviado(req);

    var mensagemErro = validarPost(idUsuario, titulo, descricao, dataLembranca, categoria);

    if (mensagemErro != "") {
        upload.apagarArquivo(foto);
        res.status(400).json({ erro: mensagemErro });
        return;
    }

    postsModel.publicar(idUsuario, titulo, descricao, dataLembranca, categoria, foto)
        .then(function (resultado) {
            res.status(201).json({ id: resultado.insertId });
        })
        .catch(function (erro) {
            upload.apagarArquivo(foto);
            responderErro(res, erro, "publicar o post");
        });
}

function editar(req, res) {
    var idPost = Number(req.params.idPost);
    var idUsuario = Number(req.body.idUsuarioServer);
    var titulo = textoLimpo(req.body.tituloServer);
    var descricao = textoLimpo(req.body.descricaoServer);
    var dataLembranca = textoLimpo(req.body.dataLembrancaServer);
    var categoria = textoLimpo(req.body.categoriaServer);
    var removerFoto = req.body.removerFotoServer == "true";
    var novaFoto = caminhoArquivoEnviado(req);

    var mensagemErro = validarPost(idUsuario, titulo, descricao, dataLembranca, categoria);

    if (mensagemErro != "") {
        upload.apagarArquivo(novaFoto);
        res.status(400).json({ erro: mensagemErro });
        return;
    }

    postsModel.buscarPorId(idPost, idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                upload.apagarArquivo(novaFoto);
                res.status(404).json({ erro: "Post não encontrado!" });
                return;
            }

            if (resultado[0].idUsuario != idUsuario) {
                upload.apagarArquivo(novaFoto);
                res.status(403).json({ erro: "Você só pode editar os seus próprios posts!" });
                return;
            }

            var fotoAntiga = resultado[0].foto;
            var fotoFinal = fotoAntiga;

            if (novaFoto) {
                fotoFinal = novaFoto;
            } else if (removerFoto) {
                fotoFinal = null;
            }

            return postsModel.editar(idPost, idUsuario, titulo, descricao, dataLembranca, categoria, fotoFinal)
                .then(function () {
                    if (fotoFinal != fotoAntiga) {
                        upload.apagarArquivo(fotoAntiga);
                    }
                    res.json({ id: idPost });
                });
        })
        .catch(function (erro) {
            upload.apagarArquivo(novaFoto);
            responderErro(res, erro, "editar o post");
        });
}

function deletar(req, res) {
    var idPost = Number(req.params.idPost);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idPost || !idUsuario) {
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
                    upload.apagarArquivo(resultado[0].foto);
                    res.json({ id: idPost });
                });
        })
        .catch(function (erro) {
            responderErro(res, erro, "excluir o post");
        });
}

function alternarCurtida(req, res) {
    var idPost = Number(req.params.idPost);
    var idUsuario = Number(req.body.idUsuarioServer);
    var curtiu;

    if (!idPost || !idUsuario) {
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
                responderErro(res, erro, "curtir o post");
            }
        });
}

function listarComentarios(req, res) {
    var idPost = Number(req.params.idPost);

    postsModel.listarComentarios(idPost)
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os comentários");
        });
}

function comentar(req, res) {
    var idPost = Number(req.params.idPost);
    var idUsuario = Number(req.body.idUsuarioServer);
    var texto = textoLimpo(req.body.textoServer);

    if (!idPost || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para comentar!" });
    } else if (texto.length == 0 || texto.length > 500) {
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
                    responderErro(res, erro, "comentar");
                }
            });
    }
}

function deletarComentario(req, res) {
    var idComentario = Number(req.params.idComentario);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idComentario || !idUsuario) {
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
            responderErro(res, erro, "excluir o comentário");
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
            responderErro(res, erro, "buscar as configurações");
        });
}

function atualizarSobreEla(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var titulo = textoLimpo(req.body.tituloServer);
    var texto = textoLimpo(req.body.textoServer);
    var assinatura = textoLimpo(req.body.assinaturaServer);

    if (!idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para editar!" });
    } else if (titulo.length == 0 || titulo.length > 160) {
        res.status(400).json({ erro: "Informe um título de até 160 caracteres!" });
    } else if (texto.length == 0) {
        res.status(400).json({ erro: "Escreva o texto da declaração!" });
    } else if (assinatura.length == 0 || assinatura.length > 160) {
        res.status(400).json({ erro: "Informe uma assinatura de até 160 caracteres!" });
    } else {
        postsModel.atualizarSobreEla(titulo, texto, assinatura)
            .then(function () {
                res.json({ sobreTitulo: titulo, sobreTexto: texto, sobreAssinatura: assinatura });
            })
            .catch(function (erro) {
                responderErro(res, erro, "salvar a declaração");
            });
    }
}

function atualizarMusicaCasal(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var musicaUrl = caminhoArquivoEnviado(req);

    if (!musicaUrl) {
        res.status(400).json({ erro: "Escolha um arquivo de música!" });
        return;
    }

    if (!idUsuario) {
        upload.apagarArquivo(musicaUrl);
        res.status(400).json({ erro: "Você precisa entrar na sua conta para trocar a música!" });
        return;
    }

    var nomeOriginal = Buffer.from(req.file.originalname, "latin1").toString("utf8");
    var musicaNome = nomeOriginal.replace(/\.[^.]+$/, "").substring(0, 120);
    var musicaAntiga;

    postsModel.buscarConfigCasal()
        .then(function (resultado) {
            musicaAntiga = resultado.length > 0 ? resultado[0].musicaUrl : null;
            return postsModel.atualizarMusicaCasal(musicaUrl, musicaNome);
        })
        .then(function () {
            upload.apagarArquivo(musicaAntiga);
            res.json({ musicaUrl: musicaUrl, musicaNome: musicaNome });
        })
        .catch(function (erro) {
            upload.apagarArquivo(musicaUrl);
            responderErro(res, erro, "salvar a música");
        });
}

function listarQualidades(req, res) {
    postsModel.listarQualidades()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar as qualidades");
        });
}

function adicionarQualidade(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var icone = textoLimpo(req.body.iconeServer) || "💖";
    var titulo = textoLimpo(req.body.tituloServer);
    var descricao = textoLimpo(req.body.descricaoServer);

    if (!idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (icone.length > 20) {
        res.status(400).json({ erro: "Ícone inválido!" });
    } else if (titulo.length == 0 || titulo.length > 120) {
        res.status(400).json({ erro: "Informe um título de até 120 caracteres!" });
    } else if (descricao.length == 0 || descricao.length > 300) {
        res.status(400).json({ erro: "Escreva uma descrição de até 300 caracteres!" });
    } else {
        postsModel.adicionarQualidade(idUsuario, icone, titulo, descricao)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                responderErro(res, erro, "adicionar a qualidade");
            });
    }
}

function removerQualidade(req, res) {
    var idQualidade = Number(req.params.idQualidade);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idQualidade || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerQualidade(idQualidade)
        .then(function () {
            res.json({ id: idQualidade });
        })
        .catch(function (erro) {
            responderErro(res, erro, "remover a qualidade");
        });
}

function listarSonhos(req, res) {
    postsModel.listarSonhos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os sonhos");
        });
}

function adicionarSonho(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var titulo = textoLimpo(req.body.tituloServer);

    if (!idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (titulo.length == 0 || titulo.length > 180) {
        res.status(400).json({ erro: "Escreva um sonho de até 180 caracteres!" });
    } else {
        postsModel.adicionarSonho(idUsuario, titulo)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                responderErro(res, erro, "adicionar o sonho");
            });
    }
}

function alternarSonho(req, res) {
    var idSonho = Number(req.params.idSonho);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idSonho || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um sonho!" });
        return;
    }

    postsModel.alternarSonho(idSonho)
        .then(function () {
            res.json({ id: idSonho });
        })
        .catch(function (erro) {
            responderErro(res, erro, "atualizar o sonho");
        });
}

function removerSonho(req, res) {
    var idSonho = Number(req.params.idSonho);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idSonho || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerSonho(idSonho)
        .then(function () {
            res.json({ id: idSonho });
        })
        .catch(function (erro) {
            responderErro(res, erro, "remover o sonho");
        });
}

function listarLugares(req, res) {
    postsModel.listarLugares()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os lugares");
        });
}

function adicionarLugar(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var nome = textoLimpo(req.body.nomeServer);
    var tipo = textoLimpo(req.body.tipoServer);
    var nota = textoLimpo(req.body.notaServer);

    if (!idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (nome.length == 0 || nome.length > 120) {
        res.status(400).json({ erro: "Informe um destino de até 120 caracteres!" });
    } else if (tipo.length == 0 || tipo.length > 60) {
        res.status(400).json({ erro: "Escolha o tipo de passeio!" });
    } else if (nota.length == 0 || nota.length > 255) {
        res.status(400).json({ erro: "Conte o que querem fazer lá (até 255 caracteres)!" });
    } else {
        postsModel.adicionarLugar(idUsuario, nome, tipo, nota)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                responderErro(res, erro, "adicionar o lugar");
            });
    }
}

function alternarLugar(req, res) {
    var idLugar = Number(req.params.idLugar);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idLugar || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para marcar um lugar!" });
        return;
    }

    postsModel.alternarLugar(idLugar)
        .then(function () {
            res.json({ id: idLugar });
        })
        .catch(function (erro) {
            responderErro(res, erro, "atualizar o lugar");
        });
}

function removerLugar(req, res) {
    var idLugar = Number(req.params.idLugar);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idLugar || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerLugar(idLugar)
        .then(function () {
            res.json({ id: idLugar });
        })
        .catch(function (erro) {
            responderErro(res, erro, "remover o lugar");
        });
}

function listarCapitulos(req, res) {
    postsModel.listarCapitulos()
        .then(function (resultado) {
            res.json(resultado);
        })
        .catch(function (erro) {
            responderErro(res, erro, "listar os capítulos");
        });
}

function adicionarCapitulo(req, res) {
    var idUsuario = Number(req.body.idUsuarioServer);
    var etiqueta = textoLimpo(req.body.etiquetaServer);
    var titulo = textoLimpo(req.body.tituloServer);
    var descricao = textoLimpo(req.body.descricaoServer);

    if (!idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para adicionar!" });
    } else if (etiqueta.length == 0 || etiqueta.length > 50) {
        res.status(400).json({ erro: "Informe uma etiqueta de até 50 caracteres!" });
    } else if (titulo.length == 0 || titulo.length > 120) {
        res.status(400).json({ erro: "Informe um título de até 120 caracteres!" });
    } else if (descricao.length == 0) {
        res.status(400).json({ erro: "Conte a história desse momento!" });
    } else {
        postsModel.adicionarCapitulo(idUsuario, etiqueta, titulo, descricao)
            .then(function (resultado) {
                res.status(201).json({ id: resultado.insertId });
            })
            .catch(function (erro) {
                responderErro(res, erro, "adicionar o capítulo");
            });
    }
}

function removerCapitulo(req, res) {
    var idCapitulo = Number(req.params.idCapitulo);
    var idUsuario = Number(req.body.idUsuarioServer);

    if (!idCapitulo || !idUsuario) {
        res.status(400).json({ erro: "Você precisa entrar na sua conta para remover!" });
        return;
    }

    postsModel.removerCapitulo(idCapitulo)
        .then(function () {
            res.json({ id: idCapitulo });
        })
        .catch(function (erro) {
            responderErro(res, erro, "remover o capítulo");
        });
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
    alternarCurtida,
    listarComentarios,
    comentar,
    deletarComentario,
    buscarConfigCasal,
    atualizarSobreEla,
    atualizarMusicaCasal,
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
