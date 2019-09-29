const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const mongoose = require('mongoose');

router.get('/', (req, res) => {
  Order.find()
    .then(orders => {
      res.status(200).json({
        data: orders
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', (req, res) => {
  Order.findById(req.params.id)
    .then(order => {
      res.status(200).json({
        data: order
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/', (req, res) => {
  const {
    order_no_customer,
    order_postal_fee,
    order_total,
    order_detail_address,
    order_name_customer,
    order_phone_customer,
    order_postal_code_customer,
    order_email_customer,
    order_amount_ordered
  } = req.body;

  const order = new Order({
    _id: new mongoose.Types.ObjectId(),
    order_date: new Date(),
    order_no_customer,
    order_postal_fee,
    order_total,
    order_detail_address,
    order_name_customer,
    order_phone_customer,
    order_postal_code_customer,
    order_email_customer,
    order_amount_ordered
  });

  order
    .save()
    .then(result => {
      console.log(result)
      res.status(201).json({
        status: 201,
        message: 'new order successfully created',
        user: result
      })
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });
});


router.delete('/:id', (req, res) => {
  Order.remove({
    _id: req.params.id
  })
    .exec()
    .then(() => {
      res.status(200).json({
        message: 'Order Deleted'
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
});

module.exports = router;
