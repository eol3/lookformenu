const knex = require('./knex.js');

var query = async function (app) {

	app.get('/api/query', async function (req, res) {
				let arr = []
				let result = {}
				
				let query = knex('menu')
				query.select('menu.*')
				query.select('image.filename as fm', 'image.domain as img_domain')
				query.where('menu.used', 1)
				query.distinct('menu.id')
				query.leftJoin('relate_menu_label', 'menu.id', 'relate_menu_label.menu_id');
				query.leftJoin('label', 'label.id', 'relate_menu_label.label_id');
				
				let sub = '`image` on `image`.`id` = (select `id` from `image` where `image`.`menu_id` = `menu`.`id` order by `priority` asc limit 1)'
				query.join(knex.raw(sub))
				
				if(req.query.s){
					let char = '%' + req.query.s + '%'
					query.orWhere('label.name', 'like', char)
					query.orWhere('menu.store', 'like', char)
					query.orWhere('menu.branch', 'like', char)
				}
				
				if(req.query.labels){
					query.andWhere(function(){
						arr = req.query.labels.split("-");
						for(let i in arr){
							this.orWhere('label_id', '=', arr[i])
						}
					})
				}
				
				if(req.query.limit){
					query.limit(req.query.limit)
				}
				
				if(req.query.offset){
					query.offset(parseInt(req.query.offset))
				}
				
				if(req.query.order){
        	query.orderBy('menu.priority', req.query.order)
				}else{
					query.orderBy('menu.priority', 'desc')
				}
				
			  result.menu = await query
			  
			  if(req.query.labels){
					query = knex('label')
					for(let i in arr){
						query.orWhere('id', '=', arr[i])
					}
					result.label = await query
				}
				
			  res.json(result)
	})
	
	app.get('/api/query/feature', async function (req, res) {
				let query = knex('menu')
				query.select('menu.*')
				query.select('image.filename as fm', 'image.domain as img_domain')
				query.where('menu.used', 1)
				query.where('menu.mark_feature', 1)
				let sub = '`image` on `image`.`id` = (select `id` from `image` where `image`.`menu_id` = `menu`.`id` order by `priority` asc limit 1)'
				query.join(knex.raw(sub))
				query.orderBy('priority', 'desc')
        let result = await query
        res.json(result);
	})
	
}

module.exports = query;