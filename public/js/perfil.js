function mostrarPerfil(){
    let nome = sessionStorage.NOME_USUARIO;
    let foto = sessionStorage.FOTO_USUARIO;

    validarSessao();

    input_nome.value = nome;
    h3_nome.innerHTML = nome;

    if(foto == ''){
        botao_remover_foto.hidden = true;
        span_avatar_grande.style.backgroundImage = '';
        span_avatar_grande.innerHTML = `${nome[0].toUpperCase()}♡`;
    }
    else{
        botao_remover_foto.hidden = false;
        span_avatar_grande.style.backgroundImage = `url('${foto}')`;
        span_avatar_grande.innerHTML = '';
    }
}

function salvarPerfil(){
    let nome = input_nome.value;

    if(nome == ''){
        mostrarMensagem('Informe seu nome!', 'erro');
    }
    else{
        fetch(`/usuarios/${sessionStorage.ID_USUARIO}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nomeServer: nome
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(resultado){
                    sessionStorage.NOME_USUARIO = resultado.nome;
                    mostrarPerfil();
                    mostrarMensagem('Perfil atualizado com sucesso!', 'sucesso');
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

function escolherFotoPerfil(){
    input_foto.click();
}

function enviarFotoPerfil(){
    if(input_foto.files.length > 0){
        let dados = new FormData();
        dados.append('foto', input_foto.files[0]);

        fetch(`/usuarios/${sessionStorage.ID_USUARIO}/foto`, {
            method: 'POST',
            body: dados
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(resultado){
                    sessionStorage.FOTO_USUARIO = resultado.fotoPerfil;
                    mostrarPerfil();
                    mostrarMensagem('Foto de perfil atualizada!', 'sucesso');
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

        input_foto.value = '';
    }
}

function removerFotoPerfil(){
    if(confirm('Remover a sua foto de perfil?') == true){
        fetch(`/usuarios/${sessionStorage.ID_USUARIO}/foto`, {
            method: 'DELETE'
        })
        .then(function(resposta){
            if(resposta.ok){
                sessionStorage.FOTO_USUARIO = '';
                mostrarPerfil();
                mostrarMensagem('Foto de perfil removida.', 'sucesso');
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