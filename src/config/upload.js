var multer = require("multer");
var path = require("path");
var fs = require("fs");

var pastaUploads = path.join(__dirname, "..", "..", "public", "uploads");

if (!fs.existsSync(pastaUploads)) {
    fs.mkdirSync(pastaUploads, { recursive: true });
}

var extensoesImagem = [".jpg", ".jpeg", ".png", ".webp"];
var extensoesMusica = [".mp3", ".wav", ".ogg", ".m4a"];

function criarNomeArquivo(req, file, cb) {
    var extensao = path.extname(file.originalname).toLowerCase();
    var numeroAleatorio = Math.round(Math.random() * 1000000000);
    cb(null, Date.now() + "-" + numeroAleatorio + extensao);
}

function arquivoInvalido(mensagem) {
    var erro = new Error(mensagem);
    erro.arquivoInvalido = true;
    return erro;
}

function filtroImagem(req, file, cb) {
    var extensao = path.extname(file.originalname).toLowerCase();

    if (extensoesImagem.includes(extensao) && file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(arquivoInvalido("Envie uma imagem JPG, PNG ou WEBP!"));
    }
}

function filtroMusica(req, file, cb) {
    var extensao = path.extname(file.originalname).toLowerCase();

    if (extensoesMusica.includes(extensao)) {
        cb(null, true);
    } else {
        cb(arquivoInvalido("Envie uma música MP3, WAV, OGG ou M4A!"));
    }
}

var armazenamento = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, pastaUploads);
    },
    filename: criarNomeArquivo
});

var imagem = multer({
    storage: armazenamento,
    fileFilter: filtroImagem,
    limits: { fileSize: 5 * 1024 * 1024 }
});

var musica = multer({
    storage: armazenamento,
    fileFilter: filtroMusica,
    limits: { fileSize: 20 * 1024 * 1024 }
});

function apagarArquivo(caminho) {
    if (!caminho || !caminho.startsWith("/uploads/")) {
        return;
    }

    var arquivo = path.join(pastaUploads, path.basename(caminho));

    fs.unlink(arquivo, function () { });
}

module.exports = {
    imagem,
    musica,
    apagarArquivo
};
