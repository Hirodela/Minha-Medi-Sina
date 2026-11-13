var usuarioModel = require("../models/usuarioModel");
var upload = require("../config/upload");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!email) {
        res.status(400).json({ erro: "Seu e-mail está indefinido!" });
    } else if (!senha) {
        res.status(400).json({ erro: "Sua senha está indefinida!" });
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    res.json({
                        id: resultadoAutenticar[0].id,
                        nome: resultadoAutenticar[0].nome,
                        email: resultadoAutenticar[0].email,
                        fotoPerfil: resultadoAutenticar[0].fotoPerfil || null,
                        dtCadastro: resultadoAutenticar[0].dtCadastro
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).json({ erro: "E-mail e/ou senha inválidos!" });
                } else {
                    res.status(403).json({ erro: "Mais de um usuário com o mesmo login e senha!" });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                res.status(500).json({ erro: erro.sqlMessage});
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (!nome || nome.trim().length < 2) {
        res.status(400).json({ erro: "Informe seu nome (mínimo 2 caracteres)!" });
    } else if (!email || !email.includes("@") || !email.includes(".com")) {
        res.status(400).json({ erro: "Informe um e-mail válido!" });
    } else if (!senha || senha.length < 8 || !/[A-Z]/.test(senha) || !/[a-z]/.test(senha) || !/[0-9]/.test(senha) || !/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
        res.status(400).json({ erro: "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial!"});
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);
                console.log(
                    "\nHouve um erro ao realizar o cadastro! Erro: ",
                    erro.sqlMessage
                );

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).json({ erro: "Este e-mail já está cadastrado!" });
                } else {
                    res.status(500).json({ erro: erro.sqlMessage });
                }
            });
    }
}

function atualizarPerfil(req, res) {
    var idUsuario = Number(req.params.idUsuario);
    var nome = req.body.nomeServer;

    if (!nome || nome.trim().length < 2) {
        res.status(400).json({ erro: "Informe seu nome (mínimo 2 caracteres)!" });
    } else if (nome.trim().length > 80) {
        res.status(400).json({ erro: "O nome pode ter no máximo 80 caracteres!" });
    } else {
        usuarioModel.atualizarNome(idUsuario, nome.trim())
            .then(function (resultado) {
                if (resultado.affectedRows == 0) {
                    res.status(404).json({ erro: "Usuário não encontrado!" });
                } else {
                    res.json({ nome: nome.trim() });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: erro.sqlMessage });
            });
    }
}

function trocarFotoPerfil(req, res, novaFoto) {
    var idUsuario = Number(req.params.idUsuario);

    usuarioModel.buscarPorId(idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                upload.apagarArquivo(novaFoto);
                res.status(404).json({ erro: "Usuário não encontrado!" });
                return;
            }

            var fotoAntiga = resultado[0].fotoPerfil;

            return usuarioModel.atualizarFotoPerfil(idUsuario, novaFoto)
                .then(function () {
                    upload.apagarArquivo(fotoAntiga);
                    res.json({ fotoPerfil: novaFoto });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            upload.apagarArquivo(novaFoto);
            res.status(500).json({ erro: erro.sqlMessage });
        });
}

function atualizarFotoPerfil(req, res) {
    if (!req.file) {
        res.status(400).json({ erro: "Escolha uma imagem para a foto de perfil!" });
    } else {
        trocarFotoPerfil(req, res, "/uploads/" + req.file.filename);
    }
}

function removerFotoPerfil(req, res) {
    trocarFotoPerfil(req, res, null);
}

module.exports = {
    autenticar,
    cadastrar,
    atualizarPerfil,
    atualizarFotoPerfil,
    removerFotoPerfil
}
