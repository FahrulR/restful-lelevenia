const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const app = require('../../app')
const path = require('path')
const multer = require('multer');
const multerUploads = require('../middleware/multer').multerUploads;
const dataUri = require('../middleware/multer').dataUri;
const cloudinary = require('../../config/cloudinaryConfig');
const nodemailer = require('nodemailer');
const Wishlist = require('../models/wishlist');
const TmpOrder = require('../models/tmpCart');

router.get('/', (req, res) => {
  User.find()
    .then(user => {
      res.status(200).json({
        data: user
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:id', (req, res) => {
  User.find({_id: req.params.id})
    .then(user => {
      if (user) {
        res.status(200).json({
          user: user
        })
      }else {
        res.status(404).json({error: "Entry not found"})
      }
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post('/register', (req, res) => {
  const {
    name,
    email,
    password,
    gender,
    phone,
    birthDate,
    role,
    profileImage
  } = req.body;
  User.find({email})
    .then(user => {
      if (user >= 1) {
        return res.status(409).json({message: "Mail Exist"});
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({error: err});
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name,
              email,
              password: hash,
              gender,
              phone,
              birthDate: new Date,
              role,
              profileImage
            });
            user.save()
              .then(result => {
                // auto create wishlist==============
                const wishlist = new Wishlist({
                  _id: new mongoose.Types.ObjectId(),
                  id_user: result._id,
                  productId: []
                  });
                  wishlist.save()
                  .catch(err => {
                    res.status(500).json({
                      error: err
                    });
                  });
                  const tmpCart = new TmpOrder({
                    _id: new mongoose.Types.ObjectId(),
                    userId: result._id,
                    products: [],
                    quantity: 0,
                    totalAmount: 0
                    });
                    tmpCart.save()
                    .catch(err => {
                      res.status(500).json({
                        error: err
                      });
                    });
                  //================================
                res.status(201).json({
                  status: 200,
                  createdUser: result
                })
              })
              .catch(err => {
                console.log(err)
                res.status(500).json({
                  error: err
                })
              });
          }
        
        });
      }
    })
    .catch(err => {
      console.log(err)
      res.status(500).json({
        error: err
      })
    });

  
});

router.post('/login', (req, res) => {
  console.log(req.body.email);
  
  User.find({email: req.body.email})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({message: 'Please fill the field'});
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({message: 'Auth Failed'});
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            }, 
            process.env.JWT_KEY || 'secret',
            {
              expiresIn: "12h"
            }
          );
          return res.status(200).json({
            status: 200,
            message: 'Auth Success',
            user: user,
            token: token
          });
        }
        return res.status(401).json({message: 'Auth Failed'});
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      })
    });
});

router.patch("/:id", (req, res) => {
  const id = req.params.id;
  const updateOps = {};

  for (const key of Object.keys(req.body)) {
    updateOps[key] = req.body[key];
  }
  console.log(updateOps)
  User.update({ _id: id }, { $set: updateOps })
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

router.patch("/upload/:id", multerUploads, (req, res) => {
  const id = req.params.id;
 
  cloudinary.config();

  if (req.file) {
    const file = dataUri(req).content;

    return cloudinary.uploader.upload(file)
      .then(result => {
        const image = result.url;
        User.update({ _id: id }, { profileImage: image })
          .exec()
          .then(result => {
            res.status(200).json({
              message: 'upload success',
              data: {
                image
              }
            });
          })
          .catch(err => {
            res.status(500).json({
              error: err
            });
          });
      })
      .catch((err) => res.status(400).json({
        message: 'something went wrong',
        data: err
      }))
  }

  // upload(req, res, function(err) {
  //   if (err) {
  //     return res.send(err)
  //   }
  //   console.log('file uploaded to server')
  //   console.log(req.file)

  //   // SEND FILE TO CLOUDINARY
  //   const cloudinary = require('cloudinary').v2
  //   cloudinary.config({
  //     cloud_name: 'elevania789',
  //     api_key: '121298662299568',
  //     api_secret: 'rbCJKjZ6rUAGMM6OttHgCgTpirY'
  //   })
    
  //   const path = req.file.path
  //   const uniqueFilename = new Date().toISOString()

  //   cloudinary.uploader.upload(
  //     path,
  //     { public_id: `profile/${uniqueFilename}`, tags: `profile` }, // directory and tags are optional
  //     function(err, image) {
  //       if (err) return res.send(err)
  //       console.log('file uploaded to Cloudinary')
  //       // remove file from server
  //       const fs = require('fs')
  //       fs.unlinkSync(path)
  //       // return image details
      
        // User.update({ _id: id }, { profileImage: image.url })
        //   .exec()
        //   .then(result => {
        //     res.status(200).json(result);
        //   })
        //   .catch(err => {
        //     res.status(500).json({
        //       error: err
        //     });
        //   });
  //     }
  //   )
  // })
});

/*      FORGOT PASSWORD       */
router.post('/forgotPassword', (req,res) => {
  if(req.body.email === '') {
    res.json('email required !')
  }
  console.log(req.body.email);
  User.findOne({ email : req.body.email })
    .then(async users => {
      if(users === null) {
        console.log(' Email not in database ');
        res.json(' Email not in db ')
      }else {
        const token = await jwt.sign(
        {email: users.email},
        process.env.JWT_KEY
        )
        const html = `
        <p>Hey ${users.name || users.email},</p>
        <p>We heard that you lost your Lelevenia password. Sorry about that!</p>
        <p>But don’t worry! You can use the following link to reset your password:</p>
        <p>https://restful-lelevenia.herokuapp.com/users/resetPassword/${users.id}/${token}</p>
        <p>Do something outside today! </p>
        `
        const transporter = nodemailer.createTransport({
          service : 'gmail',
          auth: {
            user : process.env.USER,
            pass: process.env.PASS
          },
        });

        const mailOptions = {
          from : process.env.USER,
          to : `${users.email}`,
          subject: 'Link to reset password',
          html
        };

        transporter.sendMail(mailOptions,function(err,res){
          if(err){
            console.error('something wrong ',err);
          }
        })
      }
      return res.status(200).json({
        status : 200,
        message : `Data has been sended to email ${users.email}`
      })
    })
});

router.get('/resetPassword/:id/:key',(req,res)=>{
  jwt.verify(req.params.key, process.env.JWT_KEY, (err, data) => {
   res.sendFile(path.join(app.rootPath + '/views/resetForm.html'))
  })
})

const BRCYPT_SALT_ROUNDS = 10;
router.post('/resetPassword/:id/:key',(req,res)=>{
  User.findOne({_id: req.params.id})
  .then(data => {
    if (data) {
      bcrypt.hash(req.body.password, BRCYPT_SALT_ROUNDS)
      .then(hashedPassword => {
       data.password = hashedPassword
       data.save()
       res.send('Successfully changed password! You can login now on your device')
      })
    } else {
      res.status(404).json({
        status: 404,
        error: true,
        message: 'Failed to change password, Email not found' 
      })
    }
  })
  .catch(err => {
    res.status(400).json({
      status: 400,
      error: true,
      message: err.message,
    })
  })
})
module.exports = router;
