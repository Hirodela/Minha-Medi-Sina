let ambiente_processo = 'desenvolvimento';
// let ambiente_processo = 'producao';

let caminho_env = ambiente_processo === 'producao' ? '.env' : '.env.dev';

require("dotenv").config({ path: caminho_env });

let express = require("express");
let cors = require("cors");
let path = require("path");

let PORTA_APP = process.env.APP_PORT;
let HOST_APP = process.env.APP_HOST;

let app = express();

let usuarioRouter = require("./src/routes/usuario");
let postsRouter = require("./src/routes/posts");
let historiaRouter = require("./src/routes/historia");
let casalRouter = require("./src/routes/casal");
let dashboardRouter = require("./src/routes/dashboard");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use(cors());

app.use("/usuarios", usuarioRouter);
app.use("/posts", postsRouter);
app.use("/historia", historiaRouter);
app.use("/casal", casalRouter);
app.use("/dashboard", dashboardRouter);

app.use(function (erro, req, res, next) {
    if (erro.code == "LIMIT_FILE_SIZE") {
        res.status(400).json({ erro: "O arquivo é grande demais!" });
    } else {
        res.status(400).json({ erro: erro.message });
    }
});

app.listen(PORTA_APP, function () {
    console.log(`
    Minha Medi Sina ♡
    Servidor rodando! Acesse: http://${HOST_APP}:${PORTA_APP}
    `);
});
