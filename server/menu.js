const fs = require('fs');
const fsPromises = require('fs').promises;
const knex = require('./knex.js');
const sharp = require('sharp');
var multer  = require('multer');
const jimp = require('jimp');
const auth = require('./auth.js')
const jo = require('jpeg-autorotate')

var file_path = './static/images/';

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, file_path);
  },
  filename: function (req, file, callback) {
    var filename = file.originalname;
    var arr = filename.split(".")
    var fileExtension = arr[arr.length-1];
    callback(null, Date.now() + "." + fileExtension);
  }
});
var upload = multer({ storage : storage }).array('images',10);


var menu = async function (app) {

	app.get('/api/menu/:id', async function (req, res) {
	  let result = {};
	  result = await knex.select().from('menu').where({'id': req.params.id, used: 1 }).first()
	  if(result == undefined){
			res.status(404).end()
			return
		}
	  
	  result.label = await knex.select('label.id as label_id' ,'label.name as label_name' ,'label_class.id as label_class_id' ,'label_class.name as label_class_name')
						.leftJoin('label_class', 'relate_menu_label.class_id', 'label_class.id')
						.rightJoin('label', 'relate_menu_label.label_id', 'label.id')
						.where('relate_menu_label.menu_id', req.params.id)
						.from('relate_menu_label')
						.orderBy('label_class_id')
						.orderBy('label.id')
		
	  result.image = await knex.select('image.id' ,'image.filename' ,'image.tag' ,'image.priority' ,'image.width' ,'image.height' ,'image.domain')
						.where('menu_id', req.params.id)
						.from('image')
						.orderBy('image.priority')
		
		let sub = '`image` on `image`.`id` = (select `id` from `image` where `image`.`menu_id` = `menu`.`id` order by `priority` asc limit 1)'
		
	  result.relate_menu = await knex.select('menu.id' ,'menu.store' ,'menu.branch' ,'menu.first_img_filename')
	  					.select('image.filename as fm', 'image.domain as img_domain')
							.join('relate_menu_label', 'menu.id', 'relate_menu_label.menu_id')
							.join(knex.raw(sub))
							.where(function(){
							    for(let i in result.label){
							        this.orWhere('label_id', result.label[i].label_id)
							    } 
							})
							.from('menu')
							.limit(4)
							.orderByRaw('rand()')
		
		let today = new Date().getDate()
		result.day_menu = await knex.select('menu.*')
			.select('image.filename as fm', 'image.domain as img_domain')
			.join(knex.raw(sub)).where('menu.id',today).from('menu')
		
		//let sql = await knex.select('menu.*', 'image.filename as fm').join(knex.raw(sub)).where('menu.id',today).from('menu').toString()
		
    res.json(result);
    
	})
	
	app.get('/api/menu/', async function (req, res) {
		if(req.query.history === undefined){
			res.json({data: 'nothing'})
		}
		let sub = '`image` on `image`.`id` = (select `id` from `image` where `image`.`menu_id` = `menu`.`id` order by `priority` asc limit 1)'
		let menu_arr = req.query.history.split('-').map( Number );
		let query = knex('menu').select('menu.*', 'image.filename as fm', 'image.domain as img_domain').join(knex.raw(sub))
		let order_str = '(CASE menu.id '
		for(let i in menu_arr){
			query.orWhere('menu.id', menu_arr[i])
			order_str += 'WHEN ' + menu_arr[i] + ' THEN ' + i + ' '
		}
		order_str += 'END)'
		query.where('used',1)
		query.orderByRaw(order_str)
		let result = await query
		res.json(result)
	})
	
	app.post('/api/menu/suggest/', upload, async function (req, res) {
		
		let formData = req.body;
		let form = JSON.parse(formData.form)
    
    let result = await knex('suggest_menu').insert({
    	store: form.store,
    	branch: form.branch,
    	feature: form.feature,
    	address: form.address,
    	tel: form.tel,
    	fb_page: form.fb_page,
    	website: form.website,
    	memo: form.memo,
    	create_by: 'guest',
    	create_date: knex.fn.now(),
    	update_by: 'guest',
    	update_date: knex.fn.now(),
    })
    
    
    let new_menu_id = result[0]
    
    await knex('suggest_menu')
    	.where('id', new_menu_id)
    	.update({
	    	priority: new_menu_id,
	    	main_store_id: new_menu_id,
	    })
    
    //處理圖片
    for(let i in req.files){
    	let img_filename = await compress_img('./static/images/', req.files[i].filename, './static/tmp/')
    	await knex('suggest_image').insert({
    			menu_id: new_menu_id,
    			filename: img_filename,
    			tag: 1,
    			ori_filename: req.files[i].originalname,
    			priority: i,
    			create_by: req.session.user,
    			create_date: knex.fn.now(),
    			update_by: req.session.user,
    			update_date: knex.fn.now(),
    			domain: app.get('base_url'),
    		})
    }
    res.json({status: true})
	})
	
	// admin api
	
	app.get('/api/admin/menu/suggest/', auth, async function (req, res) {
		let result = await knex('suggest_menu').orderBy('id', 'desc')
		res.json(result)
	})
	
	app.get('/api/admin/menu/suggest/:id', auth, async function (req, res) {
		let result = {};
	  result = await knex.select().from('suggest_menu').where({'id': req.params.id}).first()
	  if(result == undefined){
			res.status(404).end()
			return
		}
		result.image = await knex.select('suggest_image.*')
						.where('menu_id', req.params.id)
						.from('suggest_image')
						.orderBy('suggest_image.priority')
		res.json(result);
	})
	
	app.put('/api/admin/menu/suggest/:id/review/', auth, async function (req, res) {
		let suggest_menu = await knex('suggest_menu').where({'id': req.params.id}).first()
		delete suggest_menu.id
		let result = await knex('menu').insert(suggest_menu)
    
    let new_menu_id = result[0]
    
    await knex('menu')
    	.where('id', new_menu_id)
    	.update({
	    	priority: new_menu_id,
	    	main_store_id: new_menu_id,
	    })
	  
	  //處理圖片
	  let suggest_image = await knex('suggest_image').where({'menu_id': req.params.id})
	  for(var i in suggest_image){
	  	let old_path = './static/tmp/' + suggest_image[i].filename
	  	let new_path = './static/images/' + suggest_image[i].filename
	  	await fs.renameSync(old_path, new_path)
    	if(i==0){
    		await thumbnail_img('./static/images/', suggest_image[i].filename)
    	}
    	delete suggest_image[i].id
    	suggest_image[i].menu_id = new_menu_id
    	await knex('image').insert(suggest_image[i])
	  }
	  
	  await knex('suggest_menu').where('id', req.params.id).update({ used: 1 })
	  
    res.json({status: true})
	})
	
	app.put('/api/admin/menu/suggest/:id/reject/', auth, async function (req, res) {
		let result = await knex('suggest_menu')
    	.where('id', req.params.id)
    	.update({
    		used: -1
    	})
    res.json({status: true})
	})
	
	
	app.get('/api/admin/menu/', auth, async function (req, res) {
		let result = await knex('menu').orderBy('id', 'desc')
		res.json(result)
	})
	
	app.get('/api/admin/menu/:id', auth, async function (req, res) {
		let result = {};
	  result = await knex.select().from('menu').where({'id': req.params.id}).first()
	  if(result == undefined){
			res.status(404).end()
			return
		}
	  
	  result.label = await knex.select('label.id as label_id' ,'label.name as label_name' ,'label_class.id as label_class_id' ,'label_class.name as label_class_name')
						.leftJoin('label_class', 'relate_menu_label.class_id', 'label_class.id')
						.rightJoin('label', 'relate_menu_label.label_id', 'label.id')
						.where('relate_menu_label.menu_id', req.params.id)
						.from('relate_menu_label')
						.orderBy('label_class_id')
						.orderBy('label.id')
		
	  result.image = await knex.select('image.id' ,'image.filename' ,'image.tag' ,'image.priority' ,'image.width' ,'image.height' ,'image.domain')
						.where('menu_id', req.params.id)
						.from('image')
						.orderBy('image.priority')
		res.json(result);
	})
	
	app.post('/api/admin/menu/upload', auth, upload, async function (req, res) {
		let resdata = []
		for(let i in req.files){
			let path = './static/images/' + req.files[i].filename
			let outFile = Date.now() + ".jpg"
			let out = './static/images/' + outFile
			let image = await jimp.read(path)
			await image.quality(60).write(out)
			fs.unlink(path, (err) => {
			  if (err) throw err
			});
			resdata[i] = outFile
		}
		
		res.json(resdata)
	})
	
	app.post('/api/admin/menu/', auth, upload, async function (req, res) {
		let formData = req.body;
		let form = JSON.parse(formData.form)
    
    let result = await knex('menu').insert({
    	store: form.store,
    	branch: form.branch,
    	feature: form.feature,
    	address: form.address,
    	tel: form.tel,
    	fb_page: form.fb_page,
    	website: form.website,
    	memo: form.memo,
    	create_by: form.create_by,
    	create_date: knex.fn.now(),
    	update_by: form.create_by,
    	update_date: knex.fn.now(),
    })
    
    
    let new_menu_id = result[0]
    
    await knex('menu')
    	.where('id', new_menu_id)
    	.update({
	    	priority: new_menu_id,
	    	main_store_id: new_menu_id,
	    })
    
    //加入標籤
    for(let i in form.label){
    	await knex('relate_menu_label').insert({
    		menu_id: new_menu_id,
    		class_id: form.label[i].class_id,
    		label_id: form.label[i].id,
    		create_by: form.create_by,
    		create_date: knex.fn.now(),
    	})
    }
    
    //處理圖片
    for(let i in req.files){
    	let img_filename = await compress_img('./static/images/', req.files[i].filename, false)
    	if(i==0){
    		await thumbnail_img('./static/images/', img_filename)
    	}
    	await knex('image').insert({
    			menu_id: new_menu_id,
    			filename: img_filename,
    			tag: 1,
    			ori_filename: req.files[i].originalname,
    			priority: i,
    			create_by: req.session.user,
    			create_date: knex.fn.now(),
    			update_by: req.session.user,
    			update_date: knex.fn.now(),
    			domain: app.get('base_url'),
    		})
    }
    res.json({status: true})
	})
	
	app.put('/api/admin/menu/:id', auth, upload, async function (req, res) {
		
		let menu_id = req.params.id
		let formData = req.body;
		let form = JSON.parse(formData.form)
    
    let result = await knex('menu')
    	.where('id', req.params.id)
    	.update({
	    	store: form.store,
	    	branch: form.branch,
	    	feature: form.feature,
	    	address: form.address,
	    	tel: form.tel,
	    	fb_page: form.fb_page,
	    	website: form.website,
	    	memo: form.memo,
	    	update_by: req.session.user,
	    	update_date: knex.fn.now(),
	    })
    
    //將已上傳的圖片，進行壓縮，並按照順序，整理進陣列
    for(let i in req.files){
    	let img_filename = await compress_img('./static/images/', req.files[i].filename, false)
    	for(let j in form.image){
    		if(form.image[j].file !== undefined && form.image[j].filename === undefined){
    			form.image[j].filename = img_filename
    			form.image[j].originalname = req.files[i].originalname
    			break;
    		}
    	}
    }
    
    //處理圖片
    for(let i in form.image){
    	if(i==0){
    		await thumbnail_img('./static/images/', form.image[i].filename)
    	}else{
    		await delete_img('./static/thumbnail/' + form.image[i].filename)
    	}
    	if(form.image[i].file !== undefined){
    		await knex('image').insert({
    			menu_id: menu_id,
    			filename: form.image[i].filename,
    			tag: 1,
    			ori_filename: form.image[i].originalname,
    			priority: form.image[i].priority,
    			create_by: req.session.user,
    			create_date: knex.fn.now(),
    			update_by: req.session.user,
    			update_date: knex.fn.now(),
    			domain: app.get('base_url'),
    		})
    	}else{
    		await knex('image')
    				.where('id', form.image[i].id)
    				.update({
    					priority: form.image[i].priority,
    					update_by: req.session.user,
    					update_date: knex.fn.now(),
    				})
    	}
    }
    
    //刪除圖片
    let del_img = JSON.parse(formData.del_img)
    for(let i in del_img){
    	await knex('image')
    				.where('id', del_img[i].id)
    				.del()
    	
  		//await delete_img('./static/images/' + del_img[i].filename)
  		await delete_img('./static/images/' + del_img[i].filename);
  		await delete_img('./static/thumbnail/' + del_img[i].filename);
    }
    
    //處理標籤
    let old_label = await knex('relate_menu_label').where({
    	'menu_id': menu_id,
    })
    
    for(let i in old_label){
    	var check = false
    	for(let j in form.selected_label){
    		if(form.selected_label[j].id === old_label[i].label_id){
    			check = true
    			form.selected_label.splice(j,1)
    		}
    	}
    	if(!check){
    		await knex('relate_menu_label')
    				.where('id', old_label[i].id)
    				.del()
    	}
    }
	  
	  for(let i in form.selected_label){
	  	let obj = form.selected_label[i]
	  	await knex('relate_menu_label').insert({
	  		menu_id: menu_id,
				class_id: obj.class_id,
				label_id: obj.id,
				create_by: req.session.user,
				create_date: knex.fn.now(),
	  	})
	  }
	  
	  res.json({status: true})
	})
	
	app.put('/api/admin/menu/:id/used', auth, async function (req, res) {
		await knex('menu')
				.where('id', req.params.id)
				.update({
					used: req.body.used
				})
    				
    res.json({status: true})
	})
	
	app.put('/api/admin/menu/:id/feature', auth, async function (req, res) {
		await knex('menu')
				.where('id', req.params.id)
				.update({
					mark_feature: req.body.feature
				})
    				
    res.json({status: true})
	})
	
}

async function compress_img(path, filename, ta_path){
	
	if (!fs.existsSync(path + filename)) {
		return false
	}
	
	if(!ta_path) ta_path = path
	
	const options = {quality: 85}
	let image = {}
	try {
		let result = await jo.rotate(path + filename, options)
		image = await jimp.read(result.buffer)
	} catch (error) {
		image = await jimp.read(path + filename)
	}
	
	if (image.bitmap.width>1200 || image.bitmap.height>1200){
		image.scale(0.3)
	}
	let outFile = Date.now() + ".jpg"
	let out = ta_path + outFile
	await image.write(out)
	await fsPromises.unlink(path + filename);
	return outFile
}

async function thumbnail_img(path, filename){
	
	let out = './static/thumbnail/' + filename
	
	if (fs.existsSync('./static/thumbnail/' + filename)) {
		return true
	}
	
	let image = await jimp.read(path + filename)
	let w = image.bitmap.width
	let h = image.bitmap.height
	if(w > h){
		x = (w - h) / 2;
		y = 0
		w = w / 2
	}else{
		y = (h - w) / 2;
		x = 0
		h = h / 2
	}
	await image.crop( x, y, w, h ).resize(300, 300).quality(60).write(out)
	return true
}

async function delete_img(path){
	if (fs.existsSync(path)) {
		try {
			await fsPromises.unlink(path)
		} catch(e) {
			console.log(e)
		}
	} else {
		return true
	}
}

module.exports = menu;