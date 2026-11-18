let idPostEmEdicao = Number(window.location.search.replace('?id=', ''));
let removerFotoAtual = false;

function carregarPagina(){
    if(idPostEmEdicao > 0){
        carregarPostParaEdicao();
    }
    else{
        colocarDataDeHoje();
    }
}

function carregarPostParaEdicao(){
    fetch(`/posts/${idPostEmEdicao}`)
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(post){
                document.title = 'Editar Post · Minha Medi Sina ♡';
                h1_titulo.innerHTML = `Editar Post`;
                botao_salvar.innerHTML = `Salvar alterações`;

                input_titulo.value = post.titulo;
                input_descricao.value = post.descricao;
                input_data.value = post.dataLembranca;
                select_categoria.value = post.categoria;

                if(post.foto != null && post.foto != ''){
                    mostrarPrevia(post.foto);
                }
            });
        }
        else{
            resposta.json().then(function(dados){
                mostrarMensagem(dados.erro, 'erro');
                botao_salvar.disabled = true;
            });
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function escolherFoto(){
    input_foto.click();
}

function mostrarPrevia(endereco){
    div_previa.innerHTML = `
        <img class="previa-upload-imagem" src="${endereco}" alt="Prévia da fotografia">
        <button class="botao botao-pequeno" onclick="removerFoto()">✕ Remover fotografia</button>
    `;
    div_previa.hidden = false;
    botao_foto.innerHTML = `Trocar fotografia`;
}

function fotoEscolhida(){
    let tamanhoMaximo = 5 * 1024 * 1024;

    if(input_foto.files.length > 0){
        if(input_foto.files[0].size > tamanhoMaximo){
            input_foto.value = '';
            mostrarMensagem('A fotografia pode ter no máximo 5 MB!', 'erro');
        }
        else{
            let endereco = URL.createObjectURL(input_foto.files[0]);
            mostrarPrevia(endereco);
            removerFotoAtual = false;
        }
    }
}

function removerFoto(){
    input_foto.value = '';
    div_previa.innerHTML = ``;
    div_previa.hidden = true;
    removerFotoAtual = true;
    botao_foto.innerHTML = `Adicionar fotografia`;
}

function salvarPost(){
    let titulo = input_titulo.value;
    let descricao = input_descricao.value;
    let data = input_data.value;
    let categoria = select_categoria.value;

    if(titulo == '' || descricao == '' || data == ''){
        mostrarMensagem('Preencha todos os campos!', 'erro');
    }
    else{
        let dados = new FormData();
        dados.append('idUsuarioServer', sessionStorage.ID_USUARIO);
        dados.append('tituloServer', titulo);
        dados.append('descricaoServer', descricao);
        dados.append('dataLembrancaServer', data);
        dados.append('categoriaServer', categoria);
        dados.append('removerFotoServer', removerFotoAtual);

        if(input_foto.files.length > 0){
            dados.append('foto', input_foto.files[0]);
        }

        let url = '/posts';
        let metodo = 'POST';

        if(idPostEmEdicao > 0){
            url = `/posts/${idPostEmEdicao}`;
            metodo = 'PUT';
        }

        botao_salvar.disabled = true;

        fetch(url, {
            method: metodo,
            body: dados
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(resultado){
                    mostrarMensagem('Post salvo com sucesso!', 'sucesso');

                    setTimeout(function(){
                        window.location = `lembranca.html?id=${resultado.id}`;
                    }, 800);
                });
            }
            else{
                resposta.json().then(function(dados){
                    botao_salvar.disabled = false;
                    mostrarMensagem(dados.erro, 'erro');
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });
    }
}