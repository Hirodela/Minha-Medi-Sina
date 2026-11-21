create database minha_medi_sina;
use minha_medi_sina;

create table usuario (
    id int not null auto_increment primary key,
    nome varchar(80) not null,
    email varchar(120) not null unique,
    senha varchar(100) not null,
    foto_perfil varchar(255),
    fk_admin int,
    foreign key (fk_admin) references usuario(id)
);

create table post (
    id int not null auto_increment primary key,
    titulo varchar(120) not null,
    descricao text not null,
    data_lembranca date not null,
    categoria varchar(50) not null,
    foto varchar(255),
    fk_usuario int not null,
    foreign key (fk_usuario) references usuario(id)
);

create table curtida (
    fk_usuario int not null,
    fk_post int not null,
    primary key (fk_usuario, fk_post),
    foreign key (fk_usuario) references usuario(id),
    foreign key (fk_post) references post(id)
);

create table comentario (
    id int not null auto_increment primary key,
    texto varchar(500) not null,
    dt_comentario datetime default current_timestamp,
    fk_usuario int not null,
    fk_post int not null,
    foreign key (fk_usuario) references usuario(id),
    foreign key (fk_post) references post(id)
);

create table config_casal (
    id int not null default 1 primary key,
    sobre_titulo varchar(160) not null,
    sobre_texto text not null,
    sobre_assinatura varchar(160) not null,
    musica_url varchar(255),
    musica_nome varchar(120)
);

create table sonho_casal (
    id int not null auto_increment primary key,
    titulo varchar(180) not null,
    realizado tinyint(1) default 0,
    fk_usuario int,
    foreign key (fk_usuario) references usuario(id)
);

create table lugar_casal (
    id int not null auto_increment primary key,
    nome varchar(120) not null,
    tipo varchar(60) not null,
    nota varchar(255) not null,
    visitado tinyint(1) default 0,
    fk_usuario int,
    foreign key (fk_usuario) references usuario(id)
);

create table capitulo_historia (
    id int not null auto_increment primary key,
    etiqueta varchar(50) not null,
    titulo varchar(120) not null,
    descricao text not null,
    fk_usuario int,
    foreign key (fk_usuario) references usuario(id)
);

insert into usuario values
(default, 'Giovana ♡', 'giovana@amor.com', '123456', null, null),
(default, 'Seu Amor', 'amor@medisina.com', '123456', null, null);

select usuario.id,
       usuario.nome,
       case
           when usuario.fk_admin is null then 'Admin'
           else 'Usuário'
       end as perfil,
       admin.nome as adminResponsavel
from usuario
left join usuario as admin
on usuario.fk_admin = admin.id;

insert into post values
(default, 'Um pôr do sol ao lado da Giovana', 'O céu mudou de cor naquele fim de tarde e eu só conseguia pensar na sorte que tenho de dividir a vida com você. Cada segundo ao seu lado vira meu lugar favorito no mundo.', '2026-02-14', 'Fotografias', null, 2),
(default, 'Nosso café, risadas e conversas sem hora para acabar', 'Não precisamos de roteiros mirabolantes. Uma mesa de canto, dois cafés quentinhos e o seu sorriso já transformam qualquer dia comum na minha memória preferida.', '2026-04-18', 'Momentos engraçados', null, 1),
(default, 'Para você ler sempre que sentir saudade', 'Giovana, você é a minha Medi Sina: a dose diária de paz, alegria e carinho que deixa tudo mais leve. Que este cantinho guarde para sempre tudo o que construímos juntos.', '2026-06-12', 'Mensagens', null, 2),
(default, 'O dia em que nossa história ganhou um novo capítulo', 'Uma data marcada no calendário e no coração. Desde o primeiro olhar até cada plano de futuro, tudo faz mais sentido porque é com você.', '2026-08-25', 'Datas especiais', null, 2);

insert into curtida values
(1, 1),
(2, 1),
(1, 2),
(2, 3),
(1, 3),
(1, 4);

insert into comentario values
(default, 'Esse dia foi mágico! Quero repetir mil vezes com você ♡', default, 1, 1),
(default, 'A melhor companhia do universo inteiro! Te amo, Gi!', default, 2, 2),
(default, 'Você sempre sabe como fazer meu coração sorrir. Minha melhor escolha!', default, 1, 3);

insert into config_casal values
(1, 'Quem é a Giovana pelos meus olhos ♡', 'Falar sobre a Giovana é falar sobre a pessoa que trouxe mais cor, calma e sentido para os meus dias. Ela tem aquele jeito único de transformar momentos simples em memórias inesquecíveis, sempre com um olhar doce, uma risada que contagia qualquer ambiente e um coração que não cabe no peito.
Admiro a força, a dedicação e a sensibilidade com que ela encara a vida. Estar ao lado dela me faz querer evoluir todos os dias, porque a Giovana inspira amor, parceria de verdade e a certeza de que encontrei a pessoa certa para dividir todos os sonhos.', 'Com todo o meu amor e admiração, sempre seu ♡', null, null);

insert into sonho_casal values
(default, 'Fazer uma viagem inesquecível só nós dois', 1, 2),
(default, 'Assistir ao pôr do sol em um lugar especial', 1, 1),
(default, 'Comemorar muitas datas especiais lado a lado', 1, 2),
(default, 'Conhecer um destino dos nossos sonhos juntos', 0, 1),
(default, 'Cozinhar um jantar romântico completo a dois', 0, 2),
(default, 'Construir um álbum cheio de memórias para o futuro', 0, 1);

insert into lugar_casal values
(default, 'Campos do Jordão', '✈️ Viagem', 'Curtir o friozinho juntos, tomar chocolate quente e passear de mãos dadas.', 0, 2),
(default, 'Jantar à Luz de Velas', '🍝 Restaurante / Café', 'Conhecer um restaurante especial para comemorar mais um capítulo do nosso amor.', 0, 1),
(default, 'Praia ao Pôr do Sol', '🏖️ Praia / Natureza', 'Ver o sol se pôr no mar, caminhar na areia e guardar novas fotografias para o mural.', 0, 2);

create view vw_post_completo as
select post.id,
       post.fk_usuario as idUsuario,
       usuario.nome as autor,
       post.titulo,
       post.descricao,
       date_format(post.data_lembranca, '%Y-%m-%d') as dataLembranca,
       post.categoria,
       post.foto,
       (select count(*)
        from curtida
        where curtida.fk_post = post.id) as totalCurtidas,
       (select count(*)
        from comentario
        where comentario.fk_post = post.id) as totalComentarios
from post
join usuario
on post.fk_usuario = usuario.id;

select * from vw_post_completo;

create view vw_dashboard_kpis as
select
    (select count(*) from post) as totalPosts,
    (select count(*) from curtida) as totalCurtidas,
    (select count(*) from comentario) as totalComentarios,
    (select count(*) from sonho_casal) as totalSonhos,
    (select count(*) from sonho_casal where realizado = 1) as sonhosRealizados,
    (select count(*) from lugar_casal) as totalLugares,
    (select count(*) from lugar_casal where visitado = 1) as lugaresVisitados;

select * from vw_dashboard_kpis;

create view vw_metricas_categoria as
select vw_post_completo.categoria,
       count(*) as totalPosts,
       sum(vw_post_completo.totalCurtidas) as totalCurtidas,
       sum(vw_post_completo.totalComentarios) as totalComentarios
from vw_post_completo
group by vw_post_completo.categoria;

select * from vw_metricas_categoria;