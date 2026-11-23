let multer = require("multer");
let path = require("path");
let crypto = require("crypto");

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },

    filename: function (req, file, cb) {
        let extensao = path.extname(file.originalname).toLowerCase();
        let novoNome = crypto.randomBytes(16).toString("hex");

        cb(null, novoNome + extensao);
    }
});

function filtrarExtensoes(extensoes, mensagem) {
    return function (req, file, cb) {
        let extensao = path.extname(file.originalname).toLowerCase();

        if (extensoes.includes(extensao)) {
            cb(null, true);
        } else {
            cb(new Error(mensagem));
        }
    };
}

let imagem = multer({
    storage: storage,
    fileFilter: filtrarExtensoes([".jpg", ".jpeg", ".png", ".webp"], "Envie uma imagem JPG, PNG ou WEBP!"),
    limits: { fileSize: 5 * 1024 * 1024 }
});

let musica = multer({
    storage: storage,
    fileFilter: filtrarExtensoes([".mp3", ".wav", ".ogg", ".m4a"], "Envie uma música MP3, WAV, OGG ou M4A!"),
    limits: { fileSize: 20 * 1024 * 1024 }
});

module.exports = {
    imagem,
    musica
};
