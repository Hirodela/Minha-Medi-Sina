function carregarMeusPosts(){
    fetch(`/posts/usuario/${sessionStorage.ID_USUARIO}`)
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(posts){
                mostrarListaPosts(posts, true);

                if(posts.length == 1){
                    span_total.innerHTML = `1 post publicado`;
                }
                else{
                    span_total.innerHTML = `${posts.length} posts publicados`;
                }
            });
        }
        else{
            resposta.json().then(function(dados){
                console.log(dados.erro);
            });
            span_total.innerHTML = `0 posts publicados`;
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function excluirPost(idPost){
    if(confirm('Tem certeza de que deseja excluir este post? As curtidas e os comentários dele também serão apagados.') == true){
        fetch(`/posts/${idPost}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                carregarMeusPosts();
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}