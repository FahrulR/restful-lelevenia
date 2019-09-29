const mongoose = require('mongoose');

const notifSchema = mongoose.Schema({
  id_user : { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  productId: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
 }, { versionKey : false })

module.exports = mongoose.model('Wishlist', notifSchema, 'wishlist')