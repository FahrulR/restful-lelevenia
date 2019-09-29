const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  order_date: {
    type: Date,
    required: true
  },
  order_no_customer: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', required: true 
  },
  order_postal_fee: {
    type: Number,
    required: true
  },
  order_total: {
    type: Number,
    required: true
  },
  order_detail_address: {
    type: String, ref: 'User', 
    required: true
  },
  order_name_customer: {
    type: String, ref: 'User', 
    required: true
  },
  order_phone_customer: {
    type: Number, ref: 'User', 
    required: true
  },
  order_postal_code_customer: {
    type: Number, ref: 'User', 
    required: true
  },
  order_email_customer: {
    type: String, ref: 'User', 
    required: true
  },
  order_amount_ordered: {
    type: Number,
    required: true
  }
});

module.exports = mongoose.model('Order', orderSchema, 'order')