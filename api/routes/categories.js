const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Category = require('../models/category');

router.get('/', (req, res) => {
  Category.find().populate({path:'productId',options: { limit: 5 }})
    .exec()
    .then(category => { 
      res.status(200).json({
        status: 200,
        data: category
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})
router.get('/:id', (req, res) => {
  const id = req.params.id
  Category.findById(id)
    .exec()
    .then(category => {
      res.status(200).json({
        data: [{
          // thumbnail : "https://www.google.com/imgres?imgurl=https%3A%2F%2Fid-test-11.slatic.net%2Foriginal%2Fd2aeee8f687acf71c686a5fb55266336.jpg&imgrefurl=https%3A%2F%2Fwww.lazada.co.id%2Fproducts%2Fsepatu-slipon-pria-varka-v-081-sepatu-kets-kasual-pria-sepatu-santai-hitam-i408688626-s452601082.html&docid=T-6aX1E1rVgo3M&tbnid=AlH96C6FQAKQPM%3A&vet=10ahUKEwiCv4TptajjAhV_8XMBHWCYDCQQMwhVKAEwAQ..i&w=1000&h=1000&safe=strict&bih=647&biw=1280&q=sepatu&ved=0ahUKEwiCv4TptajjAhV_8XMBHWCYDCQQMwhVKAEwAQ&iact=mrc&uact=8",
          // title : "ini judul",
          category_id : category.category_id,
          category_name: category.category_name
          // harga: 2000,
        }]
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
})

router.post('/', (req, res) => {
  const category = new Category({
  _id: new mongoose.Types.ObjectId(),
  category_name: req.body.category_name
  });
  category
  .save()
  .then(result => {
    res.status(201).json({
      status: 201,
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
router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const category_name = req.body.category_name;
  Category.update({ _id: id }, { category_name: category_name })
    .exec()
    .then(result => {
      res.status(200).json({
        status: 200,
        message : 'Category has been edited',
        data : result
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
  Category.remove({ _id: id })
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
module.exports = router;
