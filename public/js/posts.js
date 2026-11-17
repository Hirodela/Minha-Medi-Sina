function mostrarListaPosts(posts, comBotoes){
    div_posts.innerHTML = ``;

    for(let i = 0; i < posts.length; i++){
        let post = posts[i];

        let descricao = post.descricao;
        if(descricao.length > 160){
            descricao = descricao.substring(0, 160) + '...';
        }

        let partes = post.dataLembranca.split('-');
        let data = `${partes[2]}/${partes[1]}/${partes[0]}`;

        let foto = ``;
        if(post.foto != null && post.foto != ''){
            foto = `<img class="post-foto" src="${post.foto}" alt="${post.titulo}" onerror="this.hidden = true">`;
        }
        else{
            foto = `<div class="foto-ilustrativa foto-ilustrativa-1"></div>`;
        }

        let classeCurtir = 'botao-curtir';
        if(post.curtiu > 0){
            classeCurtir = 'botao-curtir curtido';
        }

        let botoes = ``;
        if(comBotoes == true){
            botoes = `
                <div class="post-acoes">
                    <a class="botao" href="nova-lembranca.html?id=${post.id}">Editar</a>
                    <button class="botao" onclick="excluirPost(${post.id})">✕ Excluir</button>
                </div>
            `;
        }

        div_posts.innerHTML += `
            <article class="card post-card">
                ${foto}
                <div class="card-corpo">
                    <div class="card-detalhes">
                        <span class="etiqueta">${post.categoria}</span>
                        <span>${data}</span>
                    </div>
                    <h3><a href="lembranca.html?id=${post.id}">${post.titulo}</a></h3>
                    <p>${descricao}</p>
                    <p class="texto-suave post-autor">Por ${post.autor}</p>
                    <div class="barra-social">
                        <div class="botoes-sociais">
                            <button class="${classeCurtir}" id="botao_curtir_${post.id}" onclick="curtir(${post.id})" title="Curtir">
                                <span class="icone-curtir">❤️</span> <span id="span_curtidas_${post.id}">${post.totalCurtidas}</span>
                            </button>
                            <button class="botao-comentarios" onclick="window.location = 'lembranca.html?id=${post.id}'" title="Ver comentários">
                                💬 <span>${post.totalComentarios}</span>
                            </button>
                        </div>
                        <a href="lembranca.html?id=${post.id}">Ler mais →</a>
                    </div>
                    ${botoes}
                </div>
            </article>
        `;
    }
}

function curtir(idPost){
    if(sessionStorage.ID_USUARIO == undefined){
        alert('Entre na sua conta para curtir ♡');
        window.location = 'login.html';
    }
    else{
        fetch(`/posts/${idPost}/curtir`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(resultado){
                    let botao = document.getElementById(`botao_curtir_${idPost}`);
                    let total = document.getElementById(`span_curtidas_${idPost}`);

                    total.innerHTML = resultado.totalCurtidas;

                    if(resultado.curtiu == true){
                        botao.className = 'botao-curtir curtido';
                    }
                    else{
                        botao.className = 'botao-curtir';
                    }
                });
            }
            else{
                resposta.json().then(function(dados){
                    alert(dados.erro);
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}

function carregarComentarios(idPost){
    let lista = document.getElementById(`div_lista_comentarios_${idPost}`);
    let total = document.getElementById(`span_comentarios_${idPost}`);

    fetch(`/posts/${idPost}/comentarios`)
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(comentarios){
                total.innerHTML = comentarios.length;
                lista.innerHTML = ``;

                if(comentarios.length == 0){
                    lista.innerHTML = `<p class="texto-suave">Nenhum comentário ainda. Seja a primeira pessoa a comentar ♡</p>`;
                }
                else{
                    for(let i = 0; i < comentarios.length; i++){
                        let comentario = comentarios[i];

                        let botaoExcluir = ``;
                        if(sessionStorage.ID_USUARIO == comentario.idUsuario){
                            botaoExcluir = `<button class="comentario-excluir" onclick="excluirComentario(${comentario.id}, ${idPost})" title="Excluir comentário">&times;</button>`;
                        }

                        lista.innerHTML += `
                            <div class="comentario">
                                <div class="comentario-cabecalho">
                                    <span class="comentario-autor">${comentario.autor}</span>
                                    <span>
                                        <span class="comentario-data">${comentario.dataComentario}</span>
                                        ${botaoExcluir}
                                    </span>
                                </div>
                                ${comentario.texto}
                            </div>
                        `;
                    }
                }
            });
        }
        else{
            resposta.json().then(function(dados){
                lista.innerHTML = `<p class="texto-suave">${dados.erro}</p>`;
            });
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function comentar(idPost){
    let campo = document.getElementById(`input_comentario_${idPost}`);
    let texto = campo.value;

    if(sessionStorage.ID_USUARIO == undefined){
        alert('Entre na sua conta para comentar ♡');
        window.location = 'login.html';
    }
    else if(texto == ''){
        alert('Escreva um comentário!');
    }
    else{
        fetch(`/posts/${idPost}/comentarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                textoServer: texto
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                campo.value = '';
                carregarComentarios(idPost);
            }
            else{
                resposta.json().then(function(dados){
                    alert(dados.erro);
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}

function excluirComentario(idComentario, idPost){
    if(confirm('Excluir este comentário?') == true){
        fetch(`/posts/comentarios/${idComentario}`, {
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
                carregarComentarios(idPost);
            }
            else{
                resposta.json().then(function(dados){
                    alert(dados.erro);
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}