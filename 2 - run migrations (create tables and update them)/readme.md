2. We want to run the migrations every time we deploy/start the service to have an updated DB schema.

- We use our DB-querying-tool (whatever) - this time it will be `knex.js`:
  `import { Knex } from "knex";`

- We check if the table exists:
  `const tableExists = await knex.schema.hasTable(USERS_TABLE_NAME);`

- If table doesn't exist, we create it:

```
  if (!tableExists) {
    await knex.schema.createTable(USERS_TABLE_NAME, (table) => {
      table
        .increments("id", { primaryKey: false })
        .notNullable()
        .index("users_id_index");
      table
        .uuid("public_id")
        .primary()
        .defaultTo(knex.raw("gen_random_uuid()"))
        .index("users_public_id_pkey");
      table.text("nickname").notNullable();
      table.text("first_name").notNullable();
      table.text("last_name").notNullable();
      table.boolean("is_active").notNullable().defaultTo(false);
      table.timestamp("last_connected").notNullable().defaultTo(knex.fn.now());
      table.timestamp("created").notNullable().defaultTo(knex.fn.now());
      table.timestamp("modified").notNullable().defaultTo(knex.fn.now());
      table.text("avatar");
      table.text("email").notNullable().unique();
      table.text("username").notNullable().unique();
      table.text("role").notNullable().defaultTo("user");
      table.boolean("is_verified").notNullable().defaultTo(false);
      table.text("hashed_password").notNullable();
    });
  }

```

(if table exists, and we don't check if it exists -- and we try to create it anyway, we will get an SQL error).

### WHEN DO WE ACTUALLY RUN MIGRATIONS?

- We want to run the migrations _every time we start the server, ideally!_.

### And how do we run them?

- If we want to run the migrations every time the app starts, we can add it to the `npm run dev`, or/and `npm run start` commands. Like so:

Our command to run migrations is different between each tool we use to manage the database (for exmaple - Sequelize VS Knex.js). For running Knex.js migrations, we have:

A. ` "db:migrate:list": "./node_modules/.bin/knex migrate:list",`

B. `"db:migrate:latest": "./node_modules/.bin/knex migrate:latest",`

One of these commands (I honestly don't remmeber which), as part of the `package.json` scripts, will run all the migrations we have in `./scripts/migrations`

So, we want to call upon the correct command every time the server starts - BEFORE it starts!

Example:

```
  "scripts": {
    "db:migrate:list": "./node_modules/.bin/knex migrate:list",
    "db:migrate:latest": "./node_modules/.bin/knex migrate:latest",
    "dev": "db:migrate:latest && cross-env NODE_ENV=dev nodemon ./src/index.ts"
  }

```
