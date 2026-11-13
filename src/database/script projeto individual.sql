CREATE DATABASE minha_medi_sina;
USE minha_medi_sina;

CREATE TABLE usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(80) NOT NULL,
    email VARCHAR(120) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    foto_perfil VARCHAR(255) NULL,
    dt_cadastro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE post (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    data_lembranca DATE NOT NULL,
    categoria VARCHAR(50) NOT NULL,
    foto VARCHAR(255) NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_post_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id) 
);

CREATE TABLE curtida (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    fk_post INT NOT NULL,
    dt_curtida DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_curtida_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    CONSTRAINT fk_curtida_post FOREIGN KEY (fk_post) REFERENCES post(id),
    UNIQUE KEY uk_usuario_post_curtida (fk_usuario, fk_post)
);

CREATE TABLE comentario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NOT NULL,
    fk_post INT NOT NULL,
    texto VARCHAR(500) NOT NULL,
    dt_comentario DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_comentario_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id),
    CONSTRAINT fk_comentario_post FOREIGN KEY (fk_post) REFERENCES post(id)
);

CREATE TABLE config_casal (
    id INT PRIMARY KEY DEFAULT 1,
    data_inicio_amor DATE NOT NULL,
    sobre_titulo VARCHAR(160) NOT NULL,
    sobre_texto TEXT NOT NULL,
    sobre_assinatura VARCHAR(160) NOT NULL,
    musica_url VARCHAR(255) NULL,
    musica_nome VARCHAR(120) NULL
);

CREATE TABLE qualidade_giovana (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NULL,
    icone VARCHAR(20) NOT NULL DEFAULT '💖',
    titulo VARCHAR(120) NOT NULL,
    descricao VARCHAR(300) NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_qualidade_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE sonho_casal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NULL,
    titulo VARCHAR(180) NOT NULL,
    realizado TINYINT(1) DEFAULT 0,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sonho_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE lugar_casal (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NULL,
    nome VARCHAR(120) NOT NULL,
    tipo VARCHAR(60) NOT NULL,
    nota VARCHAR(255) NOT NULL,
    visitado TINYINT(1) DEFAULT 0,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lugar_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

CREATE TABLE capitulo_historia (
    id INT PRIMARY KEY AUTO_INCREMENT,
    fk_usuario INT NULL,
    etiqueta VARCHAR(50) NOT NULL,
    titulo VARCHAR(120) NOT NULL,
    descricao TEXT NOT NULL,
    dt_criacao DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_capitulo_usuario FOREIGN KEY (fk_usuario) REFERENCES usuario(id)
);

INSERT INTO usuario (id, nome, email, senha) VALUES
(1, 'Giovana ♡', 'giovana@amor.com', '123456'),
(2, 'Seu Amor', 'amor@medisina.com', '123456');

INSERT INTO post (id, fk_usuario, titulo, descricao, data_lembranca, categoria, foto) VALUES
(1, 2, 'Um pôr do sol ao lado da Giovana', 'O céu mudou de cor naquele fim de tarde e eu só conseguia pensar na sorte que tenho de dividir a vida com você. Cada segundo ao seu lado vira meu lugar favorito no mundo.', '2026-02-14', 'Fotografias', NULL),
(2, 1, 'Nosso café, risadas e conversas sem hora para acabar', 'Não precisamos de roteiros mirabolantes. Uma mesa de canto, dois cafés quentinhos e o seu sorriso já transformam qualquer dia comum na minha memória preferida.', '2026-04-18', 'Momentos engraçados', NULL),
(3, 2, 'Para você ler sempre que sentir saudade', 'Giovana, você é a minha Medi Sina: a dose diária de paz, alegria e carinho que deixa tudo mais leve. Que este cantinho guarde para sempre tudo o que construímos juntos.', '2026-06-12', 'Mensagens', NULL),
(4, 2, 'O dia em que nossa história ganhou um novo capítulo', 'Uma data marcada no calendário e no coração. Desde o primeiro olhar até cada plano de futuro, tudo faz mais sentido porque é com você.', '2026-08-25', 'Datas especiais', NULL);

INSERT INTO curtida (id, fk_usuario, fk_post) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 1, 2),
(4, 2, 3),
(5, 1, 3),
(6, 1, 4);

INSERT INTO comentario (id, fk_usuario, fk_post, texto) VALUES
(1, 1, 1, 'Esse dia foi mágico! Quero repetir mil vezes com você ♡'),
(2, 2, 2, 'A melhor companhia do universo inteiro! Te amo, Gi!'),
(3, 1, 3, 'Você sempre sabe como fazer meu coração sorrir. Minha melhor escolha!');

INSERT INTO config_casal (id, data_inicio_amor, sobre_titulo, sobre_texto, sobre_assinatura) VALUES
(1, '2026-05-08', 'Quem é a Giovana pelos meus olhos ♡', 'Falar sobre a Giovana é falar sobre a pessoa que trouxe mais cor, calma e sentido para os meus dias. Ela tem aquele jeito único de transformar momentos simples em memórias inesquecíveis, sempre com um olhar doce, uma risada que contagia qualquer ambiente e um coração que não cabe no peito.\n\nAdmiro a força, a dedicação e a sensibilidade com que ela encara a vida. Estar ao lado dela me faz querer evoluir todos os dias, porque a Giovana inspira amor, parceria de verdade e a certeza de que encontrei a pessoa certa para dividir todos os sonhos.', 'Com todo o meu amor e admiração, sempre seu ♡');

INSERT INTO sonho_casal (id, fk_usuario, titulo, realizado) VALUES
(1, 2, 'Fazer uma viagem inesquecível só nós dois', 1),
(2, 1, 'Assistir ao pôr do sol em um lugar especial', 1),
(3, 2, 'Comemorar muitas datas especiais lado a lado', 1),
(4, 1, 'Conhecer um destino dos nossos sonhos juntos', 0),
(5, 2, 'Cozinhar um jantar romântico completo a dois', 0),
(6, 1, 'Construir um álbum cheio de memórias para o futuro', 0);

INSERT INTO lugar_casal (id, fk_usuario, nome, tipo, nota, visitado) VALUES
(1, 2, 'Campos do Jordão', '✈️ Viagem', 'Curtir o friozinho juntos, tomar chocolate quente e passear de mãos dadas.', 0),
(2, 1, 'Jantar à Luz de Velas', '🍝 Restaurante / Café', 'Conhecer um restaurante especial para comemorar mais um capítulo do nosso amor.', 0),
(3, 2, 'Praia ao Pôr do Sol', '🏖️ Praia / Natureza', 'Ver o sol se pôr no mar, caminhar na areia e guardar novas fotografias para o mural.', 0);
