const config = {
  client: 'mysql',
  connection: {
    host: process.env.DB_HOST,
	  user: process.env.DB_USER,
	  password: process.env.DB_PASS,
    database: "lookformenu",
    timezone: process.env.TZ
  },
  pool: {
    min: 0,
    max: 3,
    afterCreate: function(connection: any, callback: any) {
      connection.query("SET time_zone = '" + process.env.TZ + "';", function(err: any) {
        callback(err, connection);
      });
    }
  }
}

import knex from 'knex';

export const useKnex = knex(config);