// server/db/migrations/[timestamp]_create_recipes_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('recipes', (table) => {
    table.increments('id').primary(); // Recipe ID
    table.string('title').notNullable();
    table.text('ingredients').notNullable(); // Storing ingredients as text/JSON string
    table.text('instructions').notNullable(); 
    
    // --- FOREIGN KEY: The Relational Link ---
    table.integer('user_id')
         .unsigned() // Must be a positive integer
         .notNullable()
         .references('id') // References the 'id' column
         .inTable('users') // In the 'users' table
         .onDelete('CASCADE'); // If the user is deleted, their recipes are too
    
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('recipes');
};