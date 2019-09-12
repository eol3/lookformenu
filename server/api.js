const express = require('express')
const { Nuxt, Builder } = require('nuxt')
var helmet = require('helmet');
var bodyParser = require('body-parser')
var session = require('express-session')

const app = express()
app.use(helmet());

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

var sess = {
  secret: 'keyboard cat',
  saveUninitialized: true,
  resave: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}

if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}

app.use(session(sess))

app.set('view engine', 'ejs');

const query = require('./models/query.js')

app.get('/', async function(req, res) {
  let result = await query(req)
  //console.log(result)
  res.render('index', { menu: result.menu })
});

require('./user.js')(app)
require('./query.js')(app)
require('./menu.js')(app)
require('./label.js')(app)
require('./label_class.js')(app)

// Import and Set Nuxt.js options
let config = require('../nuxt.config.js')
config.dev = !(process.env.NODE_ENV === 'production')

const nuxt = new Nuxt(config)

const { host, port } = nuxt.options.server
app.set('port', port)
app.listen(port, host)
consola.ready({
  message: `Server listening on http://${host}:${port}`,
  badge: true
})
