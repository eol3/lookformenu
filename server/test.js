var express = require('express');
const { Nuxt, Builder } = require('nuxt')
var app = express();
const routes = require('./routes');
var helmet = require('helmet');
var bodyParser = require('body-parser')

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.set('view engine', 'ejs');
app.use(helmet());
app.get('/', function (req, res) {
  res.send('Hello World!');
});


require('./routes/users.js')(app)
//app.use('/users', require('./routes/users'));
/*
app.listen(8080, function () {
  console.log('Example app listening on port 8080!');
});*/
const consola = require('consola')
//let config = require('../nuxt.config.js')
//config.dev = !(process.env.NODE_ENV === 'production')
//const nuxt = new Nuxt(config)

//const { host, port } = nuxt.options.server
var port = 8080
var host = '64.111.98.77'
app.set('port', port)
app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})