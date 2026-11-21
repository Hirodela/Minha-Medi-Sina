function usuarioEhAdmin(){
    return sessionStorage.ADMIN_USUARIO == 'true';
}

function sair(){
    sessionStorage.clear();
    window.location = 'index.html';
}

function mostrarMensagem(texto, tipo){
    p_mensagem.innerHTML = texto;
    p_mensagem.className = `mensagem-formulario ${tipo}`;
}

function colocarDataDeHoje(){
    let hoje = new Date();
    let ano = hoje.getFullYear();
    let mes = hoje.getMonth() + 1;
    let dia = hoje.getDate();

    if(mes < 10){
        mes = `0${mes}`;
    }
    if(dia < 10){
        dia = `0${dia}`;
    }

    input_data.value = `${ano}-${mes}-${dia}`;
}

function atualizarCabecalho(){
    if(sessionStorage.ID_USUARIO != undefined){
        let nome = sessionStorage.NOME_USUARIO;
        let foto = sessionStorage.FOTO_USUARIO;

        if(foto == ''){
            div_acoes.innerHTML = `
                <a class="botao botao-principal" href="dashboard.html">Olá, ${nome} ♡</a>
                <a class="avatar" href="perfil.html" >${nome[0].toUpperCase()}♡</a>
            `;
        }
        else{
            div_acoes.innerHTML = `
                <a class="botao botao-principal" href="dashboard.html">Olá, ${nome} ♡</a>
                <a class="avatar" href="perfil.html" style="background-image: url('${foto}')"></a>
            `;
        }
    }
}

function validarSessao(){
    if(sessionStorage.ID_USUARIO == undefined){
        window.location = 'login.html';
    }
    else{
        let nome = sessionStorage.NOME_USUARIO;
        let foto = sessionStorage.FOTO_USUARIO;

        span_nome_usuario.innerHTML = nome;
        span_avatar.innerHTML = `${nome[0].toUpperCase()}♡`;
        span_avatar.style.backgroundImage = '';

        if(foto != ''){
            span_avatar.innerHTML = '';
            span_avatar.style.backgroundImage = `url('${foto}')`;
        }
    }
}