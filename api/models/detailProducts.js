const mongoose = require('mongoose');

const detailProductsSchema = mongoose.Schema({

  stock: {
    type: Number,
    required: true
  },
  condition: { 
    type: String, 
    required: true 
  },
  numberOfProduct: {
    type: String
  },
  productWeight: {
    type: String,
    required: true
  },
  countryOfOrigin: {
    type: String, 
    required: true
  },
  location: {
    type: String,
  },
  warranty : {
    type : String
  }
},{ versionKey : false });

module.exports = mongoose.model('DetailProducts', detailProductsSchema, 'product_details')