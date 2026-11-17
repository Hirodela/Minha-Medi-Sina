function carregarDashboard(){
    fetch('/dashboard/metricas')
    .then(function(resposta){
        if(resposta.ok){
            resposta.json().then(function(metricas){
                mostrarIndicadores(metricas);
                mostrarMetas(metricas);
                mostrarGraficos(metricas);
            });
        }
    })
    .catch(function(erro){
        console.log(erro);
    });
}

function mostrarIndicadores(metricas){
    b_total_posts.innerHTML = metricas.totalPosts;
    b_total_curtidas.innerHTML = metricas.totalCurtidas;
    b_total_comentarios.innerHTML = metricas.totalComentarios;

    if(metricas.totalPosts > 0){
        let interacoes = metricas.totalCurtidas + metricas.totalComentarios;
        let media = interacoes / metricas.totalPosts;

        span_legenda_posts.innerHTML = `Média de ${media.toFixed(1)} interações/post`;
    }

    if(metricas.categoriaFavorita == null){
        b_categoria_favorita.innerHTML = `—`;
    }
    else{
        let qtd = metricas.categorias[0].totalPosts;

        b_categoria_favorita.innerHTML = metricas.categoriaFavorita;

        if(qtd == 1){
            span_legenda_categoria.innerHTML = `${qtd} publicação neste tema`;
        }
        else{
            span_legenda_categoria.innerHTML = `${qtd} publicações neste tema`;
        }
    }
}

function mostrarMetas(metricas){
    let porcentagemSonhos = 0;
    let porcentagemLugares = 0;

    if(metricas.totalSonhos > 0){
        porcentagemSonhos = (metricas.sonhosRealizados / metricas.totalSonhos) * 100;
    }

    if(metricas.totalLugares > 0){
        porcentagemLugares = (metricas.lugaresVisitados / metricas.totalLugares) * 100;
    }

    if(metricas.totalSonhos == 1){
        b_meta_sonhos.innerHTML = `${metricas.sonhosRealizados} de ${metricas.totalSonhos} realizado`;
    }
    else{
        b_meta_sonhos.innerHTML = `${metricas.sonhosRealizados} de ${metricas.totalSonhos} realizados`;
    }

    if(metricas.totalLugares == 1){
        b_meta_lugares.innerHTML = `${metricas.lugaresVisitados} de ${metricas.totalLugares} destino visitado`;
    }
    else{
        b_meta_lugares.innerHTML = `${metricas.lugaresVisitados} de ${metricas.totalLugares} destinos visitados`;
    }

    div_barra_sonhos.style.width = `${porcentagemSonhos}%`;
    div_barra_lugares.style.width = `${porcentagemLugares}%`;
}

function mostrarGraficos(metricas){
    let categorias = metricas.categorias;

    let nomes = [];
    let posts = [];
    let curtidas = [];
    let comentarios = [];

    for(let i = 0; i < categorias.length; i++){
        nomes.push(categorias[i].categoria);
        posts.push(categorias[i].totalPosts);
        curtidas.push(categorias[i].totalCurtidas);
        comentarios.push(categorias[i].totalComentarios);
    }

    let interacoes = metricas.totalCurtidas + metricas.totalComentarios;

    if(categorias.length == 1){
        span_resumo_categorias.innerHTML = `1 tema ativo`;
    }
    else{
        span_resumo_categorias.innerHTML = `${categorias.length} temas ativos`;
    }

    if(interacoes == 1){
        span_resumo_engajamento.innerHTML = `1 interação total`;
    }
    else{
        span_resumo_engajamento.innerHTML = `${interacoes} interações totais`;
    }

    new Chart(canvas_categorias, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [{
                label: 'Posts',
                data: posts,
                backgroundColor: ['#7b2948', '#d35d85', '#f0b8c8', '#a33d64', '#e795ae', '#fbd9cf'],
                borderRadius: 8,
                maxBarThickness: 48
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });

    new Chart(canvas_engajamento, {
        type: 'bar',
        data: {
            labels: nomes,
            datasets: [
                {
                    label: 'Curtidas ❤️',
                    data: curtidas,
                    backgroundColor: '#b8466f',
                    borderRadius: 8,
                    maxBarThickness: 34
                },
                {
                    label: 'Comentários 💬',
                    data: comentarios,
                    backgroundColor: '#f0b8c8',
                    borderRadius: 8,
                    maxBarThickness: 34
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0
                    }
                }
            },
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}