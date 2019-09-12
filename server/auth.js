var auth = async function (req, res, next) {
	if(!req.session.user){
		res.status(403).end()
		return
	}else{
		next()
	}
}

module.exports = auth;