var knex = require('knex')({
  client: 'mysql',
  connection: {
    host: "localhost",
	  user: "root",
	  password: "password",
	  database: "lookformenu"
  },
  pool: { min: 0, max: 10 }
});

module.exports = knex
