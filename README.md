# Frontend
Desenvolvido com:
- NodeJs
- Typescript
- NextJs
- react
- docker
## Rotas
### Nível
> /nivel/:id - rota de cadastro e alterações
> /nivel     - rota de listagem

### Desenvolvedors
> /dev/:id - rota de cadastro e alterações
> /dev     - rota de listagem

<hr>

# Backend
Desenvolvido com:
- NodeJs
- Typescript
- NestJs
- TypeORM

## Rotas
    > POST   /level     - rota de cadastro
    > GET    /level     - rota de listagem
    > PATCH  /level/:id - rota de atualização
    > DELETE /level/:id - rota de exclusão
    > GET    /level/:id - rota de busca por de busca unica

    > POST   /developer     - rota de cadastro
    > GET    /developer     - rota de listagem
    > PATCH  /developer/:id - rota de atualização
    > DELETE /developer/:id - rota de exclusão
    > GET    /developer/:id - rota de busca por de busca unica

<hr>
# Como executar
as aplicações precisam ser inicializadas manualmente com

> npm start

e é necessária a criação de um arquivo .env na raiz do projeto backend contendo as definições das variaveis para o banco de dados

essas variaveis devem ser copidas do jeito que estão
> TYPEORM_CONNECTION = postgres
> TYPEORM_MIGRATIONS = src/database/migrations/*.ts
> TYPEORM_MIGRATIONS_DIR = src/database/migrations
> TYPEORM_ENTITIES = dist\/*\*/\*.entity.js
> TYPEORM_ENTITIES_DIR = dist/**/entities
> TYPEORM_SCHEMA = public

estas variaveis são para configurar o acesso ao seu banco de dados postgres
> TYPEORM_USERNAME = \<seu_usuario\>
> TYPEORM_PORT = \<porta\>
> TYPEORM_DATABASE = \<nome_do_banco\>
> TYPEORM_PASSWORD = \<sua_senha\>
> TYPEORM_HOST = \<host\>
