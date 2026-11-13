var coresGraficos = ["#7b2948", "#d35d85", "#f0b8c8", "#a33d64", "#e795ae", "#fbd9cf"];

function plural(quantidade, singular, pluralTexto) {
    return quantidade + " " + (quantidade == 1 ? singular : pluralTexto);
}

function mostrarGraficoVazio(idCanvas, texto) {
    var area = document.getElementById(idCanvas).parentElement;

    area.innerHTML =
        '<div class="grafico-vazio">' +
            "<span>♡</span>" +
            "<p>" + escaparHtml(texto) + "</p>" +
        "</div>";
}

function mostrarIndicadores(metricas) {
    document.getElementById("indicador-total-posts").textContent = metricas.totalPosts;
    document.getElementById("indicador-total-curtidas").textContent = metricas.totalCurtidas;
    document.getElementById("indicador-total-comentarios").textContent = metricas.totalComentarios;
    document.getElementById("indicador-categoria-favorita").textContent = metricas.categoriaFavorita || "—";

    if (metricas.totalPosts > 0) {
        var media = (Number(metricas.totalCurtidas) + Number(metricas.totalComentarios)) / metricas.totalPosts;

        document.getElementById("indicador-legenda-posts").textContent =
            "Média de " + media.toFixed(1).replace(".", ",") + " interações/post";
    }

    if (metricas.categoriaFavorita) {
        document.getElementById("indicador-legenda-categoria").textContent =
            plural(metricas.categorias[0].totalPosts, "publicação neste tema", "publicações neste tema");
    }
}

function encurtarNome(nome) {
    return nome.length > 18 ? nome.substring(0, 18) + "..." : nome;
}

function mostrarMetas(metricas) {
    var percentualSonhos = metricas.totalSonhos > 0 ? (metricas.sonhosRealizados / metricas.totalSonhos) * 100 : 0;
    var percentualLugares = metricas.totalLugares > 0 ? (metricas.lugaresVisitados / metricas.totalLugares) * 100 : 0;

    document.getElementById("texto-meta-sonhos").textContent =
        metricas.sonhosRealizados + " de " + plural(metricas.totalSonhos, "realizado", "realizados");
    document.getElementById("barra-meta-sonhos").style.width = percentualSonhos + "%";

    document.getElementById("texto-meta-lugares").textContent =
        metricas.lugaresVisitados + " de " + plural(metricas.totalLugares, "destino visitado", "destinos visitados");
    document.getElementById("barra-meta-lugares").style.width = percentualLugares + "%";
}

function mostrarGraficos(metricas) {
    var categorias = metricas.categorias;

    if (typeof Chart == "undefined") {
        mostrarGraficoVazio("grafico-categorias", "Não foi possível carregar a biblioteca de gráficos. Verifique a internet.");
        mostrarGraficoVazio("grafico-engajamento", "Não foi possível carregar a biblioteca de gráficos. Verifique a internet.");
        return;
    }

    if (categorias.length == 0) {
        mostrarGraficoVazio("grafico-categorias", "Publiquem o primeiro post para ver a distribuição por categoria.");
        mostrarGraficoVazio("grafico-engajamento", "As curtidas e os comentários do mural aparecerão aqui.");
        return;
    }

    var nomes = [];
    var posts = [];
    var curtidas = [];
    var comentarios = [];

    for (var i = 0; i < categorias.length; i++) {
        nomes.push(categorias[i].categoria);
        posts.push(categorias[i].totalPosts);
        curtidas.push(categorias[i].totalCurtidas);
        comentarios.push(categorias[i].totalComentarios);
    }

    Chart.defaults.font.family = "Poppins, sans-serif";
    Chart.defaults.color = "#6b5560";

    document.getElementById("resumo-grafico-categorias").textContent = plural(categorias.length, "tema ativo", "temas ativos");
    document.getElementById("resumo-grafico-engajamento").textContent =
        plural(Number(metricas.totalCurtidas) + Number(metricas.totalComentarios), "interação total", "interações totais");

    var eixos = {
        x: {
            grid: { display: false },
            ticks: {
                maxRotation: 20,
                minRotation: 20,
                callback: function (valor) {
                    return encurtarNome(this.getLabelForValue(valor));
                }
            }
        },
        y: { beginAtZero: true, ticks: { precision: 0 }, grid: { color: "#f4cfda" } }
    };

    new Chart(document.getElementById("grafico-categorias"), {
        type: "bar",
        data: {
            labels: nomes,
            datasets: [{
                label: "Posts",
                data: posts,
                backgroundColor: coresGraficos,
                borderRadius: 8,
                maxBarThickness: 48
            }]
        },
        options: {
            maintainAspectRatio: false,
            scales: eixos,
            plugins: {
                legend: { display: false }
            }
        }
    });

    new Chart(document.getElementById("grafico-engajamento"), {
        type: "bar",
        data: {
            labels: nomes,
            datasets: [
                { label: "Curtidas ❤️", data: curtidas, backgroundColor: "#b8466f", borderRadius: 8, maxBarThickness: 34 },
                { label: "Comentários 💬", data: comentarios, backgroundColor: "#f0b8c8", borderRadius: 8, maxBarThickness: 34 }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: eixos,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: { usePointStyle: true, pointStyle: "circle" }
                }
            }
        }
    });
}

document.addEventListener("DOMContentLoaded", function () {
    var usuario = usuarioLogado();

    if (!usuario) {
        return;
    }

    requisicao("/dashboard/metricas")
        .then(function (metricas) {
            mostrarIndicadores(metricas);
            mostrarMetas(metricas);
            mostrarGraficos(metricas);
        })
        .catch(function (erro) {
            mostrarGraficoVazio("grafico-categorias", erro.message);
            mostrarGraficoVazio("grafico-engajamento", erro.message);
        });
});
