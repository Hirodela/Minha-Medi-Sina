function cadastrar(){
    let nome = input_nome.value;
    let email = input_email.value;
    let senha = input_senha.value;

    if(nome == '' || email == '' || senha == ''){
        mostrarMensagem('Preencha todos os campos!', 'erro');
    }
    else if(nome.length < 2){
        mostrarMensagem('Informe seu nome (mínimo 2 caracteres)!', 'erro');
    }
    else{
        fetch('/usuarios/cadastrar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nomeServer: nome,
                emailServer: email,
                senhaServer: senha
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                mostrarMensagem('Conta criada com sucesso! Indo para o login...', 'sucesso');

                setTimeout(function(){
                    window.location = 'login.html';
                }, 1400);
            }
            else{
                resposta.json().then(function(dados){
                    mostrarMensagem(dados.erro, 'erro');
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
            mostrarMensagem(erro.message, 'erro');
        });
    }
}