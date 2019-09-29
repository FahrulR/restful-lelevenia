const mongoose = require('mongoose');

const productSchema = mongoose.Schema({

  product_IdCategory : { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
  product_sellerID : {type: mongoose.Schema.Types.ObjectId, ref: 'Users',required:true},
  product_price: {
    type: Number,
    required: true
  },
  product_name: { 
    type: String, 
    ref: 'User', required: true 
  },
  product_stock: {
    type: Number,
    required: true
  },
  photo : {
    type: Array,
    required: true
  },
  product_description: {
    type: String
  },
  product_date_of_entry: {
    type: Date, default: Date.now
  },
  profileImage : {
    type : String
  }
},{ versionKey : false });

module.exports = mongoose.model('Product', productSchema, 'products')