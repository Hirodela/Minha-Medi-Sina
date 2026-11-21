let tituloCarta = '';
let textoCarta = '';
let assinaturaCarta = '';

function mostrarBotaoEditar(){
    if(usuarioEhAdmin()){
        botao_editar_carta.hidden = false;
    }
}

function carregarCarta(){
    fetch('/posts/config/casal')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(carta){
                mostrarCarta(carta);
            });
        }
        else{
            resposta.json().then(function(dados){
                console.log(dados.erro);
            });
        }
    })
    .catch(function(erro){
    });
}

function mostrarCarta(carta){
    tituloCarta = carta.sobreTitulo;
    textoCarta = carta.sobreTexto;
    assinaturaCarta = carta.sobreAssinatura;

    let paragrafos = textoCarta.split('\n');

    div_paragrafos.innerHTML = ``;

    for(let i = 0; i < paragrafos.length; i++){
        if(paragrafos[i] != ''){
            div_paragrafos.innerHTML += `<p>${paragrafos[i]}</p>`;
        }
    }

    h2_titulo_carta.innerHTML = tituloCarta;
    div_assinatura.innerHTML = assinaturaCarta;
}

function editarCarta(){
    input_titulo.value = tituloCarta;
    input_texto.value = textoCarta;
    input_assinatura.value = assinaturaCarta;

    div_carta.hidden = true;
    div_editar_carta.hidden = false;
}

function fecharEdicaoCarta(){
    div_editar_carta.hidden = true;
    div_carta.hidden = false;
}

function salvarCarta(){
    let titulo = input_titulo.value;
    let texto = input_texto.value;
    let assinatura = input_assinatura.value;

    if(titulo == '' || texto == '' || assinatura == ''){
        alert('Preencha todos os campos!');
    }
    else{
        fetch('/posts/config/sobre-ela', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                idUsuarioServer: sessionStorage.ID_USUARIO,
                tituloServer: titulo,
                textoServer: texto,
                assinaturaServer: assinatura
            })
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(carta){
                    mostrarCarta(carta);
                    fecharEdicaoCarta();
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