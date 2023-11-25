import { Knex } from "knex";

const tableName = "auth";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (t) => {
    t.increments("id").unsigned().notNullable();
    t.string("email").notNullable().unique();
    t.foreign("email").references("users.email");
    t.integer("expiresIn").notNullable();
    t.string("refresh_token").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
