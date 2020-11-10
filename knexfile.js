// Update with your config settings.

module.exports = {
     client: 'postgresql',
    connection: {
      database: 'amazon_clone',
      user:     'postgres',
      password: '1234567891'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }


};
