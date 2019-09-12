const fs = require('fs');
const knex = require('./knex.js');
const jimp = require('jimp');

async function main(k){
	console.log('==process menu id: ' + k + ' ==')
	let res = await knex('image').where('menu_id', k).orderBy('priority')
	// console.log(res)
	// process.exit()
	let path = 'https://api.lookformenu.com/public/source_img/'
	for(let i in res){
		console.log('start get img:' + res[i].filename)
		let img_filename = await compress_img(path, res[i].filename)
		console.log('output img:' + img_filename)
		if(i==0){
			await thumbnail_img('../static/images/', img_filename)
		}
		await knex('image')
    				.where('id', res[i].id)
    				.update({
    					filename: img_filename,
    					priority: i,
    					domain: 'http://test.lookformenu.com'
    				})
	}
}

async function compress_img(path, filename){
	let outFile = Date.now() + ".jpg"
	let out = '../static/images/' + outFile
	let image = await jimp.read(path + filename)
	if (image.bitmap.width>1200 || image.bitmap.height>1200){
		image.scale(0.3)
	}
	await image.write(out)
	//await fsPromises.unlink(path + filename);
	return outFile
}

async function thumbnail_img(path, filename){
	
	let out = '../static/thumbnail/' + filename
	
	if (fs.existsSync(out)) {
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
	console.log('finish thumb:' + filename)
	return true
}

async function all(){
	for(let k=99;k>=1;k--){
		await main(k)
	}
}

all()