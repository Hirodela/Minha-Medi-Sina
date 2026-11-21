var usuarioModel = require("../models/usuarioModel");

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined || email == "") {
        res.status(400).json({ erro: "Seu e-mail está indefinido!" });
    } else if (senha == undefined || senha == "") {
        res.status(400).json({ erro: "Sua senha está indefinida!" });
    } else {
        usuarioModel.autenticar(email, senha)
            .then(function (resultadoAutenticar) {
                if (resultadoAutenticar.length == 1) {
                    res.json({
                        id: resultadoAutenticar[0].id,
                        nome: resultadoAutenticar[0].nome,
                        fotoPerfil: resultadoAutenticar[0].fotoPerfil,
                        ehAdmin: resultadoAutenticar[0].ehAdmin == 1
                    });
                } else if (resultadoAutenticar.length == 0) {
                    res.status(403).json({ erro: "E-mail e/ou senha inválidos!" });
                } else {
                    res.status(403).json({ erro: "Mais de um usuário com o mesmo login e senha!" });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao realizar o login." });
            });
    }
}

function cadastrar(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (nome == undefined || nome.trim().length < 2) {
        res.status(400).json({ erro: "Informe seu nome (mínimo 2 caracteres)!" });
    } else if (email == undefined || email.includes("@") == false || email.includes(".") == false) {
        res.status(400).json({ erro: "Informe um e-mail válido!" });
    } else if (senha == undefined || senhaForte(senha) == false) {
        res.status(400).json({ erro: "A senha deve ter no mínimo 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial!" });
    } else {
        usuarioModel.cadastrar(nome, email, senha)
            .then(function (resultado) {
                res.json(resultado);
            })
            .catch(function (erro) {
                console.log(erro);

                if (erro.code == "ER_DUP_ENTRY") {
                    res.status(409).json({ erro: "Este e-mail já está cadastrado!" });
                } else {
                    res.status(500).json({ erro: "Houve um erro ao realizar o cadastro." });
                }
            });
    }
}

function senhaForte(senha) {
    var simbolos = "!@#$%^&*(),.?\":{}|<>";

    var temMaiuscula = false;
    var temMinuscula = false;
    var temNumero = false;
    var temSimbolo = false;

    for (var i = 0; i < senha.length; i++) {
        var letra = senha[i];

        if (letra >= "A" && letra <= "Z") {
            temMaiuscula = true;
        } else if (letra >= "a" && letra <= "z") {
            temMinuscula = true;
        } else if (letra >= "0" && letra <= "9") {
            temNumero = true;
        } else if (simbolos.includes(letra)) {
            temSimbolo = true;
        }
    }

    if (senha.length >= 8 && temMaiuscula && temMinuscula && temNumero && temSimbolo) {
        return true;
    } else {
        return false;
    }
}

function atualizarPerfil(req, res) {
    var idUsuario = req.params.idUsuario;
    var nome = req.body.nomeServer;

    if (nome == undefined || nome.trim().length < 2) {
        res.status(400).json({ erro: "Informe seu nome (mínimo 2 caracteres)!" });
    } else if (nome.trim().length > 80) {
        res.status(400).json({ erro: "O nome pode ter no máximo 80 caracteres!" });
    } else {
        nome = nome.trim();

        usuarioModel.atualizarNome(idUsuario, nome)
            .then(function (resultado) {
                if (resultado.affectedRows == 0) {
                    res.status(404).json({ erro: "Usuário não encontrado!" });
                } else {
                    res.json({ nome: nome });
                }
            })
            .catch(function (erro) {
                console.log(erro);
                res.status(500).json({ erro: "Houve um erro ao atualizar o perfil." });
            });
    }
}

function atualizarFotoPerfil(req, res) {
    var idUsuario = req.params.idUsuario;

    if (req.file == undefined) {
        res.status(400).json({ erro: "Escolha uma imagem para a foto de perfil!" });
        return;
    }

    var novaFoto = "/uploads/" + req.file.filename;

    usuarioModel.buscarPorId(idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).json({ erro: "Usuário não encontrado!" });
                return;
            }

            return usuarioModel.atualizarFotoPerfil(idUsuario, novaFoto)
                .then(function () {
                    res.json({ fotoPerfil: novaFoto });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao salvar a foto de perfil." });
        });
}

function removerFotoPerfil(req, res) {
    var idUsuario = req.params.idUsuario;

    usuarioModel.buscarPorId(idUsuario)
        .then(function (resultado) {
            if (resultado.length == 0) {
                res.status(404).json({ erro: "Usuário não encontrado!" });
                return;
            }

            return usuarioModel.atualizarFotoPerfil(idUsuario, null)
                .then(function () {
                    res.json({ fotoPerfil: null });
                });
        })
        .catch(function (erro) {
            console.log(erro);
            res.status(500).json({ erro: "Houve um erro ao remover a foto de perfil." });
        });
}

module.exports = {
    autenticar,
    cadastrar,
    atualizarPerfil,
    atualizarFotoPerfil,
    removerFotoPerfil
}
