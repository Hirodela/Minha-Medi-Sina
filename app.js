var ambiente_processo = "desenvolvimento";

var caminho_env = ambiente_processo === "producao" ? ".env" : ".env.dev";

require("dotenv").config({ path: caminho_env });

var express = require("express");
var cors = require("cors");
var path = require("path");

var PORTA_APP = process.env.APP_PORT || 3333;
var HOST_APP = process.env.APP_HOST || "localhost";

var app = express();

var usuarioRouter = require("./src/routes/usuario");
var postsRouter = require("./src/routes/posts");
var dashboardRouter = require("./src/routes/dashboard");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/posts", postsRouter);
app.use("/dashboard", dashboardRouter);

// Erros de upload (tipo de arquivo inválido, arquivo grande demais) e outros erros inesperados
app.use(function (erro, req, res, next) {
    if (erro.arquivoInvalido) {
        res.status(400).json({ erro: erro.message });
    } else if (erro.code == "LIMIT_FILE_SIZE") {
        res.status(400).json({ erro: "O arquivo enviado é grande demais!" });
    } else if (erro.name == "MulterError") {
        res.status(400).json({ erro: "Não foi possível enviar o arquivo." });
    } else {
        console.log(erro);
        res.status(500).json({ erro: "Houve um erro inesperado no servidor." });
    }
});

app.listen(PORTA_APP, function () {
    console.log(`
    Minha Medi Sina ♡
    Servidor rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
    `);
});
