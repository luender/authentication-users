import { Knex } from "knex";

const tableName = "users";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (t) => {
    t.increments("id").unsigned().notNullable();
    t.string("name").notNullable();
    t.string("user").notNullable().unique();
    t.string("email").notNullable().unique();
    t.string("password").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex(tableName).delete();
  return knex.schema.dropTableIfExists(tableName);
}
