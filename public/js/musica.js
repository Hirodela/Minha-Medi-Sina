let temMusica = false;

function definirMusica(endereco, nome){
    temMusica = true;
    audio_musica.src = endereco;

    span_titulo_musica.innerHTML = `🎶 ${nome}`;
    span_status_musica.innerHTML = `Clique para tocar ♡`;
}

function carregarMusica(){
    fetch('/casal/config')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(config){
                if(config.musicaUrl != null && config.musicaUrl != ''){
                    definirMusica(config.musicaUrl, config.musicaNome);
                }
            });
        }
        else{
            span_status_musica.innerHTML = `Não foi possível carregar a música`;
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function tocarOuPausar(){
    if(temMusica == false){
        span_status_musica.innerHTML = `Clique em 🎵 para escolher um .mp3`;
    }
    else if(audio_musica.paused == true){
        audio_musica.play();
    }
    else{
        audio_musica.pause();
    }
}

function musicaTocando(){
    div_player.className = 'player-musica tocando';
    botao_tocar.innerHTML = `⏸`;
    span_status_musica.innerHTML = `Tocando agora ♡`;
}

function musicaPausada(){
    div_player.className = 'player-musica';
    botao_tocar.innerHTML = `▶`;
    span_status_musica.innerHTML = `Pausada`;
}

function musicaComErro(){
    temMusica = false;
    span_titulo_musica.innerHTML = `🎶 Nossa Música ♡`;
    span_status_musica.innerHTML = `Arquivo não encontrado: clique em 🎵`;
}

function escolherMusica(){
    if(sessionStorage.ID_USUARIO == undefined){
        alert('Entre na sua conta para escolher a nossa música ♡');
        window.location = 'login.html';
    }
    else{
        input_musica.click();
    }
}

function enviarMusica(){
    if(input_musica.files.length > 0){
        let dados = new FormData();
        dados.append('idUsuarioServer', sessionStorage.ID_USUARIO);
        dados.append('musica', input_musica.files[0]);

        audio_musica.pause();
        span_status_musica.innerHTML = `Enviando a música...`;

        fetch('/casal/musica', {
            method: 'POST',
            body: dados
        })
        .then(function(resposta){
            if(resposta.ok){
                resposta.json().then(function(resultado){
                    definirMusica(resultado.musicaUrl, resultado.musicaNome);
                    tocarOuPausar();
                });
            }
            else{
                resposta.json().then(function(dados){
                    span_status_musica.innerHTML = dados.erro;
                });
            }
        })
        .catch(function(erro){
            console.log(erro);
        });

        input_musica.value = '';
    }
}