 // server/db.js

const knex = require('knex');
const knexfile = require('./knexfile');

// Initialize the Knex connection
const db = knex(knexfile.development);

module.exports = db;