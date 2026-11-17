function mostrarFormularios(){
    if(sessionStorage.ID_USUARIO != undefined){
        section_capitulo.hidden = false;
        div_adicionar_sonho.hidden = false;
        div_adicionar_lugar.hidden = false;
    }
}

function carregarCapitulos(){
    fetch('/posts/capitulos')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(capitulos){
                div_capitulos.innerHTML = ``;

                for(let i = 0; i < capitulos.length; i++){
                    let botaoExcluir = ``;

                    if(sessionStorage.ID_USUARIO != undefined){
                        botaoExcluir = `<button class="botao-excluir-capitulo" onclick="excluirCapitulo(${capitulos[i].id})">✕ Excluir</button>`;
                    }

                    div_capitulos.innerHTML += `
                        <article class="linha-do-tempo-item">
                            <div class="linha-do-tempo-cabecalho">
                                <span class="etiqueta">${capitulos[i].etiqueta}</span>
                                ${botaoExcluir}
                            </div>
                            <h3>${capitulos[i].titulo}</h3>
                            <p>${capitulos[i].descricao}</p>
                        </article>
                    `;
                }
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

function adicionarCapitulo(){
    let etiqueta = input_etiqueta.value;
    let titulo = input_titulo.value;
    let descricao = input_descricao.value;

    if(etiqueta == '' || titulo == '' || descricao == ''){
        mostrarMensagem('Preencha todos os campos!', 'erro');
    }
    else{
        fetch('/posts/capitulos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                etiquetaServer: etiqueta,
                tituloServer: titulo,
                descricaoServer: descricao
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                input_etiqueta.value = '';
                input_titulo.value = '';
                input_descricao.value = '';
                mostrarMensagem('Capítulo adicionado à nossa história!', 'sucesso');
                carregarCapitulos();
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

function excluirCapitulo(idCapitulo){
    if(confirm('Excluir este capítulo da linha do tempo?') == true){
        fetch(`/posts/capitulos/${idCapitulo}`, {
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
                carregarCapitulos();
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

function carregarSonhos(){
    fetch('/posts/sonhos')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(sonhos){
                let realizados = 0;
                let porcentagem = 0;

                div_sonhos.innerHTML = ``;

                for(let i = 0; i < sonhos.length; i++){
                    let botaoRemover = ``;

                    if(sessionStorage.ID_USUARIO != undefined){
                        botaoRemover = `<button class="comentario-excluir" onclick="removerSonho(${sonhos[i].id})" title="Remover sonho">&times;</button>`;
                    }

                    if(sonhos[i].realizado == 1){
                        realizados++;

                        div_sonhos.innerHTML += `
                            <div class="sonho-card realizado">
                                <label class="sonho-marcador">
                                    <input type="checkbox" onchange="alternarSonho(${sonhos[i].id}, 1)" checked>
                                    <span class="sonho-texto">${sonhos[i].titulo}</span>
                                </label>
                                <span class="sonho-situacao">Realizado ♡</span>
                                ${botaoRemover}
                            </div>
                        `;
                    }
                    else{
                        div_sonhos.innerHTML += `
                            <div class="sonho-card">
                                <label class="sonho-marcador">
                                    <input type="checkbox" onchange="alternarSonho(${sonhos[i].id}, 0)">
                                    <span class="sonho-texto">${sonhos[i].titulo}</span>
                                </label>
                                <span class="sonho-situacao">Em breve</span>
                                ${botaoRemover}
                            </div>
                        `;
                    }
                }

                if(sonhos.length > 0){
                    porcentagem = (realizados / sonhos.length) * 100;
                }

                span_progresso_sonhos.innerHTML = `${realizados} de ${sonhos.length} realizados`;
                div_barra_sonhos.style.width = `${porcentagem}%`;
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

function adicionarSonho(){
    let titulo = input_sonho.value;

    if(titulo == ''){
        alert('Escreva um sonho!');
    }
    else{
        fetch('/posts/sonhos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                tituloServer: titulo
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                input_sonho.value = '';
                carregarSonhos();
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

function alternarSonho(idSonho, realizado){
    if(sessionStorage.ID_USUARIO == undefined){
        alert('Entre na sua conta para marcar um sonho ♡');
        window.location = 'login.html';
    }
    else{
        fetch(`/posts/sonhos/${idSonho}/alternar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                if(realizado == 0){
                    soltarCoracoes();
                }
                carregarSonhos();
            }
            else{
                resposta.json().then(function(dados){
                    alert(dados.erro);
                    carregarSonhos();
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
            carregarSonhos();
        });
    }
}

function removerSonho(idSonho){
    if(confirm('Remover este sonho da lista?') == true){
        fetch(`/posts/sonhos/${idSonho}`, {
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
                carregarSonhos();
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

function soltarCoracoes(){
    let emojis = ['💖', '💕', '♥', '💗', '✨'];

    div_coracoes.innerHTML = ``;

    for(let i = 0; i < 14; i++){
        let posicao = Math.random() * 100;
        let atraso = Math.random() * 0.6;

        div_coracoes.innerHTML += `<span class="coracao-particula" style="left: ${posicao}vw; animation-delay: ${atraso}s">${emojis[i % 5]}</span>`;
    }

    setTimeout(function(){
        div_coracoes.innerHTML = ``;
    }, 3200);
}

function carregarLugares(){
    fetch('/posts/lugares')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(lugares){
                div_lugares.innerHTML = ``;

                for(let i = 0; i < lugares.length; i++){
                    let botaoRemover = ``;

                    if(sessionStorage.ID_USUARIO != undefined){
                        botaoRemover = `<button class="comentario-excluir" onclick="removerLugar(${lugares[i].id})" title="Remover lugar">&times;</button>`;
                    }

                    if(lugares[i].visitado == 1){
                        div_lugares.innerHTML += `
                            <div class="lugar-card visitado">
                                <div>
                                    <div class="lugar-card-topo">
                                        <span class="etiqueta">${lugares[i].tipo}</span>
                                        ${botaoRemover}
                                    </div>
                                    <h3>${lugares[i].nome}</h3>
                                    <p>${lugares[i].nota}</p>
                                </div>
                                <div class="lugar-card-rodape">
                                    <span class="texto-suave">Já fomos juntos ♡</span>
                                    <button class="lugar-botao-situacao" onclick="alternarLugar(${lugares[i].id})">✓ Visitado</button>
                                </div>
                            </div>
                        `;
                    }
                    else{
                        div_lugares.innerHTML += `
                            <div class="lugar-card">
                                <div>
                                    <div class="lugar-card-topo">
                                        <span class="etiqueta">${lugares[i].tipo}</span>
                                        ${botaoRemover}
                                    </div>
                                    <h3>${lugares[i].nome}</h3>
                                    <p>${lugares[i].nota}</p>
                                </div>
                                <div class="lugar-card-rodape">
                                    <span class="texto-suave">Ainda vamos conhecer</span>
                                    <button class="lugar-botao-situacao" onclick="alternarLugar(${lugares[i].id})">Marcar como visitado</button>
                                </div>
                            </div>
                        `;
                    }
                }
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

function adicionarLugar(){
    let nome = input_lugar.value;
    let tipo = select_tipo.value;
    let nota = input_nota.value;

    if(nome == '' || nota == ''){
        alert('Preencha todos os campos!');
    }
    else{
        fetch('/posts/lugares', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                nomeServer: nome,
                tipoServer: tipo,
                notaServer: nota
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                input_lugar.value = '';
                input_nota.value = '';
                carregarLugares();
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

function alternarLugar(idLugar){
    if(sessionStorage.ID_USUARIO == undefined){
        alert('Entre na sua conta para marcar um lugar ♡');
        window.location = 'login.html';
    }
    else{
        fetch(`/posts/lugares/${idLugar}/alternar`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                carregarLugares();
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

function removerLugar(idLugar){
    if(confirm('Remover este lugar da lista?') == true){
        fetch(`/posts/lugares/${idLugar}`, {
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
                carregarLugares();
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