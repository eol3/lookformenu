const knex = require('./knex.js')
const auth = require('./auth.js')

var label_class = async function (app) {
	
	app.get('/api/label_class/', async function (req, res) {
        let result = await knex('label_class').select('id', 'name', 'priority')
        res.json(result);
	})

	app.get('/api/label_class/:id', async function (req, res) {
        let result = await knex('label_class').where('id', parseInt(req.params.id))
        res.json(result);
	})
	
	
	//admin api
	
	app.get('/api/admin/label_class/', auth, async function (req, res) {
        let result = await knex('label_class')
        res.json(result);
	})
	
	app.post('/api/admin/label_class/', auth, async function (req, res) {
			let result = await knex('label_class').insert({
          name: req.body.name,
					create_by: req.session.user,
					create_date: knex.fn.now(),
					update_by: req.session.user,
					update_date: knex.fn.now(),
		    })
		    
	    let new_label_class_id = result[0]
	    
	    await knex('label_class')
	    	.where('id', new_label_class_id)
	    	.update({
		    	priority: new_label_class_id,
		    })
		    
			res.json({
		  	status: true,
		  	new_label_class_id: new_label_class_id,
		  })
	})
	
	app.put('/api/admin/label_class/:id', auth, async function (req, res) {
			await knex('label_class')
		    	.where('id', req.params.id)
		    	.update({
            'name': req.body.name,
						'update_by': req.session.user,
						'update_date': knex.fn.now(),
			    })
			    
			res.json({status: true})
	})
	
}

module.exports = label_class;