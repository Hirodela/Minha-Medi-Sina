# Minha Medi Sina

Projeto individual desenvolvido com Node.js, Express, MySQL, HTML, CSS e JavaScript.

## Funcionalidades

- Cadastro e login de usuários.
- Publicações de lembranças com título, descrição, data, categoria e foto.
- Curtidas e comentários.
- Perfil e foto de perfil.
- Dashboard com métricas.
- Configurações do casal, qualidades, sonhos e lugares.
- Upload de imagens e música.

## Como executar

1. Instale Node.js e MySQL.
2. No MySQL Workbench, execute `src/database/script projeto individual.sql`.
3. No arquivo `.env.dev`, informe os dados locais do seu MySQL.
4. No terminal, dentro da pasta do projeto, execute:

   ```bash
   npm install
   npm start
   ```

5. Acesse `http://localhost:3333`.


## Validações simplificadas

O cadastro exige nome (mínimo 2 caracteres), e-mail válido e senha com pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial. O login verifica se e-mail e senha foram informados.
