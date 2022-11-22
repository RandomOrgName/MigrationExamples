1. We want to create a DB by:

- connecting to postgres:
  ` const pgClient = new pg.Client({ ...options, database: "postgres" });`

- connecting to your existing postgres server:
  ` await pgClient.connect();`

- creating the DB:
  `` await pgClient.query(`CREATE DATABASE "${options.database}"`);``

* We want to run the command to create the DB one time on the machine where the app is hosted, so it can connect to the database. The database needs to run in the background, unrelated to the application.

`"db:create": "ts-node ./scripts/db/create-local-db.ts"`

- The database now exists on your machine. It's on a postgres _server_. But, it's not running yet, the server, isn't up.

* We ALSO want to run the command to start the database -- AKA start up the server.

Example:

```"db:start": "docker-compose -f docker-compose.yaml up --no-start
       && docker-compose -f ./docker-compose.yaml start postgres"
```

- It can run as a docker container
- It can run as a background process on your machine

In this example, the DB is starting as a docker container:

- `docker-compose -f` = I don't remember (can google)
- `docker-compose.yaml up --no-start` = we start up _a_ container, without runnign anything on it (`--no-start` flag)
- `docker-compose -f ./docker-compose.yaml start postgres` = we start _only_ the postgres container

### Running without docker

- We can run without docker as a background process on the local machine. That means, it will _always_ run and you will see the service running if you try (on macOS) the command: `brew services` (which gives you a list of all brew services currently running in background)
