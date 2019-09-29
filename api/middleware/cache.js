// const redis = require('../../app')

// const Product = require('../models/product');

// const cache = (req, res, next) => {

// 	redis.client.get('products', (err, data) => {
// 		if(err) next(err)

// 		if(data !== null){
// 			console.log('data cache')
// 			res.json({
// 				data: JSON.parse(data)
// 			})
// 		}
// 			else {
// 				console.log('no cache')
// 			next()
// 			}
		
// 	})
// }
// module.exports = cache