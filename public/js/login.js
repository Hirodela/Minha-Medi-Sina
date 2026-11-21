function entrar(){
    let email = input_email.value;
    let senha = input_senha.value;

    if(email == '' || senha == ''){
        mostrarMensagem('Informe o e-mail e a senha!', 'erro');
    }
    else{
        fetch('/usuarios/autenticar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                emailServer: email,
                senhaServer: senha
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(usuario){
                    sessionStorage.ID_USUARIO = usuario.id;
                    sessionStorage.NOME_USUARIO = usuario.nome;
                    sessionStorage.ADMIN_USUARIO = usuario.ehAdmin;

                    if(usuario.fotoPerfil == null){
                        sessionStorage.FOTO_USUARIO = '';
                    }
                    else{
                        sessionStorage.FOTO_USUARIO = usuario.fotoPerfil;
                    }

                    mostrarMensagem('Login realizado! Entrando...', 'sucesso');

                    setTimeout(function(){
                        window.location = 'dashboard.html';
                    }, 700);
                });
            }
            else{
                resposta.json().then(function(dados){
                    mostrarMensagem(dados.erro, 'erro');
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}