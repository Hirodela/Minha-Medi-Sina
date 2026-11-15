function cadastrar(evento) {
    evento.preventDefault();

    var nome = document.getElementById("input-nome").value.trim();
    var email = document.getElementById("input-email").value.trim();
    var senha = document.getElementById("input-senha").value;

    if (nome.length < 2) {
        mostrarMensagem("mensagem-formulario", "Informe seu nome (mínimo 2 caracteres)!", "erro");
        return;
    }

    enviarJson("/usuarios/cadastrar", "POST", {
        nomeServer: nome,
        emailServer: email,
        senhaServer: senha
    })
        .then(function () {
            mostrarMensagem("mensagem-formulario", "Conta criada com sucesso! Indo para o login...", "sucesso");

            setTimeout(function () {
                window.location = "login.html";
            }, 1400);
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });
}
