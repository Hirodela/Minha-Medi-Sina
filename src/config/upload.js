const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

const diretorio = 'public/uploads/';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, diretorio)
  },

  filename: (req, file, cb) => {
    const extensaoArquivo = path.extname(file.originalname).toLowerCase();

    const novoNomeArquivo = crypto
      .randomBytes(16)
      .toString('hex');

    cb(null, `${novoNomeArquivo}${extensaoArquivo}`)
  }
});

function filtrarExtensoes(extensoes, mensagem) {
  return (req, file, cb) => {
    const extensaoArquivo = path.extname(file.originalname).toLowerCase();

    if (extensoes.includes(extensaoArquivo)) {
      cb(null, true)
    } else {
      cb(new Error(mensagem))
    }
  }
}

const imagem = multer({
  storage,
  fileFilter: filtrarExtensoes(['.jpg', '.jpeg', '.png', '.webp'], 'Envie uma imagem JPG, PNG ou WEBP!'),
  limits: { fileSize: 5 * 1024 * 1024 }
});

const musica = multer({
  storage,
  fileFilter: filtrarExtensoes(['.mp3', '.wav', '.ogg', '.m4a'], 'Envie uma música MP3, WAV, OGG ou M4A!'),
  limits: { fileSize: 20 * 1024 * 1024 }
});


module.exports = { imagem, musica };