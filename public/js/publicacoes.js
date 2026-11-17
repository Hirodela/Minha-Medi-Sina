function mostrarPublicacaoRapida(){
    if(sessionStorage.ID_USUARIO != undefined){
        section_publicar.hidden = false;
        colocarDataDeHoje();
    }
}

function carregarFeed(){
    let url = '/posts';

    if(sessionStorage.ID_USUARIO != undefined){
        url = `/posts?idUsuario=${sessionStorage.ID_USUARIO}`;
    }

    fetch(url)
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(posts){
                mostrarListaPosts(posts, false);
            });
        }
        else{
            resposta.json().then(function(dados){
                console.log(dados.erro);
            });
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function publicarRapido(){
    let titulo = input_titulo.value;
    let descricao = input_descricao.value;
    let data = input_data.value;
    let categoria = select_categoria.value;

    if(titulo == '' || descricao == '' || data == ''){
        alert('Preencha todos os campos!');
    }
    else{
        fetch('/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                tituloServer: titulo,
                descricaoServer: descricao,
                dataLembrancaServer: data,
                categoriaServer: categoria
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                input_titulo.value = '';
                input_descricao.value = '';
                colocarDataDeHoje();
                carregarFeed();
            }
            else{
                resposta.json().then(function(dados){
                    alert(dados.erro);
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
            alert(erro.message);
        });
    }
}