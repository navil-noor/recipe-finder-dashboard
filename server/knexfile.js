// server/knexfile.js

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './db/dev.sqlite3' // The database file
    },
    useNullAsDefault: true,
    migrations: {
      directory: './db/migrations'
    }
  }
};