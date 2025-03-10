# Nodejs + Express + Apollo + Graphql
## Docker + Postgres + Prisma + JWT
> A small project for test graphql CRUD operations using threaded app

### Tool Needed :
- [Nodejs](https://nodejs.org/en) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) isntalled
- [Docker](https://docs.docker.com/desktop/) installed in the system

## Installation :

> Clone the project
````bash
npm install
````
> Create postgres image inside docker using 
````bash
docker compose up -d
````
> Copy `.env.example` to `.env` and update the credentials from `docker-compose.yml`
````bash
cp .env.example .env
````
````bash
npm run dev
````
## docker CLI commands for database access (Terminal)
````
docker ps
docket exec -it <postgres_container_id>
su postgress
psql
````
`\l`  `\c`  `\d`  `\x` 

## Refernces :

-   [Docker Compose](https://github.com/docker-library/docs/blob/master/postgres/README.md)
-   [Prisma](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
-   [Apollo-Client + Graphql](https://www.apollographql.com/docs/apollo-server/getting-started)

