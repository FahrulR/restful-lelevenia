const mongoose = require('mongoose');

const transactionSchema = mongoose.Schema({
  
  transaction_id_user : { type: mongoose.Schema.Types.ObjectId, ref: 'User'},
  
  transaction_number: {
    type: String,
    default: function() { return 'T-'+Math.floor(Math.random()*900000)}
  },
  transaction_day: { 
    type: Date, default: Date.now // timestampnow
  },
  transaction_date: {
    type: Date, default: Date.now
  },
  products:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  // transaction_payment: {
  //   type: String,
  //   required: true
  // },
  // transaction_metode: {
  //   type: String,
  //   required: true
  // },
  transaction_total: {
    type: Number,
    required: true
  },
  transaction_id_user: {
    type: String
  }
},{ versionKey : false });

module.exports = mongoose.model('Transaction', transactionSchema, 'transaction')