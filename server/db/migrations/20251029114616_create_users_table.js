// server/db/migrations/[timestamp]_create_users_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary(); // Unique User ID
    table.string('username').notNullable().unique(); // Unique Username
    table.string('email').notNullable().unique(); // Unique Email
    table.string('password_hash').notNullable(); // Hashed password (NEVER store plain text)
    table.timestamps(true, true); // created_at, updated_at
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('users');
};