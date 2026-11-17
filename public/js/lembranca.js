let idPost = Number(window.location.search.replace('?id=', ''));

function carregarPost(){
    let url = `/posts/${idPost}`;

    if(sessionStorage.ID_USUARIO != undefined){
        url = `/posts/${idPost}?idUsuario=${sessionStorage.ID_USUARIO}`;
    }

    fetch(url)
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(post){
                mostrarPost(post);
            });
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function mostrarPost(post){
    let descricao = post.descricao.replaceAll('\n', '<br>');

    let partes = post.dataLembranca.split('-');
    let data = `${partes[2]}/${partes[1]}/${partes[0]}`;

    let foto = `<div class="foto-ilustrativa foto-ilustrativa-1 detalhe-sem-foto"></div>`;
    if(post.foto != null){
        foto = `<img class="detalhe-foto" src="${post.foto}" alt="${post.titulo}">`;
    }

    let classeCurtir = 'botao-curtir';
    if(post.curtiu > 0){
        classeCurtir = 'botao-curtir curtido';
    }

    let botaoEditar = ``;
    if(sessionStorage.ID_USUARIO == post.idUsuario){
        botaoEditar = `<a class="botao" href="nova-lembranca.html?id=${post.id}">Editar post</a>`;
    }

    article_post.innerHTML = `
        <div class="card-detalhes-artigo">
            <span class="etiqueta">${post.categoria}</span>
            <span class="texto-suave">${data}</span>
        </div>
        <h1>${post.titulo}</h1>
        <p class="texto-suave post-autor">Publicado por ${post.autor}</p>
        ${foto}
        <p class="artigo-paragrafo">${descricao}</p>
        <div class="caixa artigo-interacoes">
            <div class="barra-social">
                <div class="botoes-sociais">
                    <button class="${classeCurtir}" id="botao_curtir_${post.id}" onclick="curtir(${post.id})">
                        <span class="icone-curtir">❤️</span> <span id="span_curtidas_${post.id}">${post.totalCurtidas}</span>
                    </button>
                    <button class="botao-comentarios">
                        💬 <span id="span_comentarios_${post.id}">${post.totalComentarios}</span>
                    </button>
                </div>
            </div>
            <div class="comentarios-gaveta">
                <div class="comentarios-lista" id="div_lista_comentarios_${post.id}"></div>
                <div class="comentario-formulario">
                    <input type="text" id="input_comentario_${post.id}" placeholder="Escreva um comentário carinhoso..." maxlength="500">
                    <button onclick="comentar(${post.id})">Enviar</button>
                </div>
            </div>
        </div>
        <div class="linha-botoes margem-topo-24">
            <a class="botao" href="publicacoes.html">← Voltar ao feed</a>
            ${botaoEditar}
        </div>
    `;

    carregarComentarios(post.id);
}