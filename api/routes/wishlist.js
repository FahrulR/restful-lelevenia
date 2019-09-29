const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Wishlist = require('../models/wishlist');
//just for deploying
router.get('/', (req, res) => {
  Wishlist.find().populate({path:'productId',options: { limit: 5 }})
    .exec()
    .then(wishlist => { 
      res.status(200).json({
        data: wishlist
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})
router.post('/', (req, res) => {
  const wishlist = new Wishlist({
  _id: new mongoose.Types.ObjectId(),
  id_user: req.body.id_user,
  productId: req.body.productId
  });
  wishlist
  .save()
  .then(result => {
    res.status(201).json({
      message: "success to insert data",
      created: result
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});
router.delete("/:id", (req, res, next) => {
  const id = req.params.id;
  Wishlist.remove({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});
//==================================
router.get('/:id', (req, res) => {
  const id = req.params.id
  Wishlist.findOne({id_user:id}).populate('productId')
    .exec()
    .then(wishlist => {
      res.status(200).json({
        data: wishlist
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const updateOps = {};
    for (const ops of req.body) {
      updateOps[ops.field] = ops.value;
    }
    console.log(updateOps)
  Wishlist.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      Wishlist.findById(id).populate('productId')
      .then(wishlist => {
        res.status(200).json({
          data: wishlist
        })
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

module.exports = router;
