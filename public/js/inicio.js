let dataInicioAmor = new Date(2026, 4, 8);

function iniciarContador(){
    atualizarContador();
    setInterval(atualizarContador, 1000);
}

function atualizarContador(){
    let agora = new Date();
    let diferenca = agora - dataInicioAmor;

    let totalSegundos = Math.floor(diferenca / 1000);

    let dias = Math.floor(totalSegundos / 86400);
    let resto = totalSegundos - dias * 86400;

    let horas = Math.floor(resto / 3600);
    resto = resto - horas * 3600;

    let minutos = Math.floor(resto / 60);
    let segundos = resto - minutos * 60;

    if(horas < 10){
        horas = `0${horas}`;
    }
    if(minutos < 10){
        minutos = `0${minutos}`;
    }
    if(segundos < 10){
        segundos = `0${segundos}`;
    }

    b_dias.innerHTML = dias;
    b_horas.innerHTML = horas;
    b_minutos.innerHTML = minutos;
    b_segundos.innerHTML = segundos;
}