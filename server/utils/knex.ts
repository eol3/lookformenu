const config = useRuntimeConfig()

const knexConfig = {
  client: 'mysql2',
  connection: {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database,
    timezone: config.mysql.tz,
  },
  pool: {
    min: 0,
    max: 3,
    afterCreate: function(connection: any, callback: any) {
      connection.query('SET time_zone = "' + config.mysql.tz + '"', function(err: any) {
        callback(err, connection);
      });
    }
  }
}

import knex from 'knex';

export const useKnex = knex(knexConfig);