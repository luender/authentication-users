import { Knex } from "knex";

const tableName = "emailToken";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (t) => {
    t.increments("id").unsigned().notNullable();
    t.string("email").notNullable().unique();
    t.foreign("email").references("users.email");
    t.string("token").notNullable();
    t.boolean("validated").notNullable();
    t.integer("attempts").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(tableName);
}
