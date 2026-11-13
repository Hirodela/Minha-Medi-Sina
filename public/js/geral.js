function usuarioLogado() {
    if (!sessionStorage.ID_USUARIO) {
        return null;
    }

    return {
        id: Number(sessionStorage.ID_USUARIO),
        nome: sessionStorage.NOME_USUARIO,
        email: sessionStorage.EMAIL_USUARIO,
        fotoPerfil: sessionStorage.FOTO_USUARIO || null,
        dtCadastro: sessionStorage.DATA_CADASTRO || ""
    };
}

function guardarUsuario(usuario) {
    sessionStorage.ID_USUARIO = usuario.id;
    sessionStorage.NOME_USUARIO = usuario.nome;
    sessionStorage.EMAIL_USUARIO = usuario.email;
    sessionStorage.FOTO_USUARIO = usuario.fotoPerfil || "";
    sessionStorage.DATA_CADASTRO = usuario.dtCadastro || "";
}

function sair() {
    sessionStorage.clear();
    window.location = "index.html";
}

function exigirLogin(mensagem) {
    var usuario = usuarioLogado();

    if (!usuario) {
        alert(mensagem || "Entre na sua conta para continuar ♡");
        window.location = "login.html";
    }

    return usuario;
}

function requisicao(url, opcoes) {
    return fetch(url, opcoes)
        .then(function (resposta) {
            return resposta.text().then(function (texto) {
                var dados = null;

                try {
                    dados = texto ? JSON.parse(texto) : null;
                } catch (erro) {
                    dados = texto;
                }

                if (!resposta.ok) {
                    var mensagem = "Não foi possível concluir a ação.";

                    if (dados && dados.erro) {
                        mensagem = dados.erro;
                    } else if (typeof dados == "string" && dados != "" && dados.length < 200) {
                        mensagem = dados;
                    }

                    throw new Error(mensagem);
                }

                return dados;
            });
        });
}

function enviarJson(url, metodo, corpo) {
    return requisicao(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(corpo || {})
    });
}

function escaparHtml(texto) {
    return String(texto == null ? "" : texto)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function formatarData(dataIso) {
    var partes = String(dataIso || "").split("-");

    if (partes.length != 3) {
        return "";
    }

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function dataDeHoje() {
    var hoje = new Date();
    var mes = String(hoje.getMonth() + 1).padStart(2, "0");
    var dia = String(hoje.getDate()).padStart(2, "0");

    return hoje.getFullYear() + "-" + mes + "-" + dia;
}

function mostrarMensagem(idElemento, texto, tipo) {
    var elemento = document.getElementById(idElemento);

    if (elemento) {
        elemento.textContent = texto;
        elemento.className = "mensagem-formulario " + (tipo || "");
    }
}

function aplicarAvatar(elemento, nome, foto) {
    if (foto) {
        elemento.style.backgroundImage = "url('" + encodeURI(foto) + "')";
        elemento.textContent = "";
    } else {
        elemento.style.backgroundImage = "";
        elemento.textContent = nome ? nome.trim().charAt(0).toUpperCase() + "♡" : "♡";
    }
}

function atualizarCabecalho() {
    var usuario = usuarioLogado();
    var acoes = document.getElementById("acoes-navegacao");

    if (!usuario) {
        return;
    }

    if (acoes) {
        acoes.innerHTML =
            '<a class="botao botao-principal" href="dashboard.html">Olá, ' + escaparHtml(usuario.nome) + " ♡</a>" +
            '<a class="avatar" href="perfil.html" title="Meu perfil"></a>';
    }

    var nomes = document.querySelectorAll(".nome-usuario-logado");
    for (var i = 0; i < nomes.length; i++) {
        nomes[i].textContent = usuario.nome;
    }

    var avatares = document.querySelectorAll(".avatar");
    for (var j = 0; j < avatares.length; j++) {
        aplicarAvatar(avatares[j], usuario.nome, usuario.fotoPerfil);
    }
}

function protegerPainel() {
    if (document.querySelector(".painel") && !usuarioLogado()) {
        window.location = "login.html";
    }
}

protegerPainel();
document.addEventListener("DOMContentLoaded", atualizarCabecalho);
