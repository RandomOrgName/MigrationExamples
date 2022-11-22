import { Knex } from "knex";
import { USERS_TABLE_NAME } from "../assets/constant";

export async function up(knex: Knex): Promise<void> {
  const tableExists = await knex.schema.hasTable(USERS_TABLE_NAME);

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
}

export async function down(knex: Knex): Promise<void> {
  knex.schema.dropTable(USERS_TABLE_NAME);
}
