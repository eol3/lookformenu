const knex = require('./knex.js')
const auth = require('./auth.js')

var label = async function (app) {
	
	app.get('/api/label/', async function (req, res) {
		let result = await knex('label')
						.select('label.id' ,'label.name', 'label.class_id', 'label_class.name as class_name')
						.leftJoin('label_class','label_class.id','label.class_id')
						.where('label.used', 0)
		res.json(result);
	})
	
	app.get('/api/label/:id', async function (req, res) {
				if(req.params.id == 'usual'){
					let result = await knex('label').where('label.star', 1)
        	res.json(result);
				}else{
					let result = await knex('label').where('id', parseInt(req.params.id))
        	res.json(result);	
				}
	})
	
	
	//amdin api
	
	app.get('/api/admin/label/', auth, async function (req, res) {
		let result = await knex('label')
						.select('label.*', 'label_class.name as class_name')
						.leftJoin('label_class','label_class.id','label.class_id')
    res.json(result);
	})
	
	app.post('/api/admin/label/', auth, async function (req, res) {
				let result = await knex('label').insert({
		    	class_id: req.body.class_id,
          name: req.body.name,
					create_by: req.session.user,
					create_date: knex.fn.now(),
					update_by: req.session.user,
					update_date: knex.fn.now(),
		    })
		    
		    let new_label_id = result[0]
		    
		    await knex('label')
		    	.where('id', new_label_id)
		    	.update({
			    	priority: new_label_id,
			    })
			    
			  res.json({
			  	status: true,
			  	new_label_id: new_label_id,
			  })
	})
	
	app.put('/api/admin/label/:id', auth, async function (req, res) {
				await knex('label')
		    	.where('id', req.params.id)
		    	.update({
			    	'class_id': req.body.class_id,
            'name': req.body.name,
						'update_by': req.session.user,
						'update_date': knex.fn.now(),
			    })
			    
			  res.json({status: true})
	})
	
	app.put('/api/admin/label/:id/address', auth, async function (req, res) {
				await knex('label')
			    	.where('id', req.params.id)
			    	.update({
				    	'address': req.body.address,
							'update_by': req.session.user,
							'update_date': knex.fn.now(),
				    })
				    
				  res.json({status: true})
	})
	
}

module.exports = label;