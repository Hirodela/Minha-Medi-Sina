function entrar(evento) {
    evento.preventDefault();

    var email = document.getElementById("input-email").value.trim();
    var senha = document.getElementById("input-senha").value;

    if (email == "" || senha == "") {
        mostrarMensagem("mensagem-formulario", "Informe o e-mail e a senha!", "erro");
        return;
    }

    enviarJson("/usuarios/autenticar", "POST", {
        emailServer: email,
        senhaServer: senha
    })
        .then(function (usuario) {
            guardarUsuario(usuario);
            mostrarMensagem("mensagem-formulario", "Login realizado! Entrando...", "sucesso");

            setTimeout(function () {
                window.location = "dashboard.html";
            }, 700);
        })
        .catch(function (erro) {
            mostrarMensagem("mensagem-formulario", erro.message, "erro");
        });
}

if (usuarioLogado()) {
    window.location = "dashboard.html";
}
