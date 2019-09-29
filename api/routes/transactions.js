const express = require('express');
const router = express.Router();
const Transaction = require('../models/transaction');
const Product = require('../models/product');
const tmpCart = require('../models/tmpCart')

router.get('/', (req, res) => {
  Transaction.find().populate('products')
  .exec()
  .then(transactions => {
    

    res.status(200).json({
      status: 200,
      message : "Get data transaction is successfully",
      data : transactions
    })
  })
  .catch(err => {
    res.status(500).json({
      error : err
    });
  });
});
/* Get By Id */
router.get('/:id', (req, res) => {
  Transaction.findOne({transaction_id_user : req.params.id}).populate('products')
    .exec()
    .then(transactions => {
      res.status(200).json({
        data: transactions
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
/* POST */
router.post('/',(req,res) => {
  let { number, products, total, id_user } = req.body;

  let transactionAdd = new Transaction({
    transaction_number : number,
    products : products,
    transaction_total: total,
    transaction_id_user: id_user
  });
  
  tmpCart.update({userId :id_user},{$set : { products : []}}).exec()
  transactionAdd.save()
    .then(transactions => {

      var sendNotification = function(data) {
        var headers = {
          "Content-Type": "application/json; charset=utf-8",
          "Authorization": process.env.REST_KEY
        };
        
        var options = {
          host: "onesignal.com",
          port: 443,
          path: "/api/v1/notifications",
          method: "POST",
          headers: headers
        };
        
        var https = require('https');
        var req = https.request(options, function(res) {  
          res.on('data', function(data) {
            console.log("Response:");
            console.log(JSON.parse(data));
          });
        });
        
        req.on('error', function(e) {
          console.log("ERROR:");
          console.log(e);
        });
        
        req.write(JSON.stringify(data));
        req.end();
      };
      
      var message = { 
        app_id: process.env.APP_ID,
        contents: {"en": "Pembelian Sukses"},
        included_segments: ["All"]
      };
      
      sendNotification(message);

      res.status(200).json({
        status : 200,
        message : 'Transactions has been added',
        data : transactions
      })
    })
    .catch(err => {
      res.status(500).json({
        error : err
      });
    });
});
  
module.exports = router;
