const knex = require('./knex.js');

var user = async function (app) {

	app.post('/api/user/login', async function (req, res) {
		let result = {}
		if(req.body.account == 'admin' && req.body.password == 'admin'){
			req.session.user = req.body.account
			result = {'laginStatus': 1, 'user': req.session.user}
		}else{
			result = {'laginStatus': 0}
		}
		res.json(result);
	})

	app.post('/api/user/logout', async function (req, res) {
		await req.session.destroy()
		res.json({'msg':'ok'})
	})

	app.get('/api/user/', async function (req, res) {
		console.log('dddff')
		if (req.session.user) {
			result = {'laginStatus': 1, 'user': req.session.user }
		} else {
			result = {'laginStatus': 0}
		}
		res.json(result);
	})

}

module.exports = user;
