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

app.listen(PORTA_APP, function () {
    console.log(`
    Minha Medi Sina ♡
    Servidor rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
    `);
});
