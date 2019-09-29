const express = require('express');
const router = express.Router();
const Notif = require('../models/notif');

router.get('/', (req, res) => {
  Notif.find()
  .then(notified => {
    return res.status(200).json({
      status : 200,
      result : 'Data getted successfully',
      data : notified
      })
    })
  .catch(err => {
    res.status(500).json({
      error : err
    });
  });
});
/* Get By Id */

// router.get('/:id', (req, res) => {
//   Transaction.findById(req.params.id)
//     .then(transactions => {
//       res.status(200).json({
//         data: transactions
//       })
//     })
//     .catch(err => {
//       res.status(500).json({
//         error: err
//       });
//     });
// });

/* POST */
router.post('/',(req,res) => {
  
    let notifAdd = new Notif({
      id_user : req.body.id_user,
      activity : req.body.activity
    });

    notifAdd.save()
      .then(notification => {
          return res.status(200).send({
            status : 200,
            result : "Data successfully added",
            id_user : notification.id_user,
            notif : [{
              activity: notification.activity
            }]
          })
      })
      .catch(err => {
        res.status(500).json({
          status : 500,
          message: err.message,
          data: []
        });
      });
    })
    
/* PATCH */
router.patch('/:id',(req,res) => {
  let transactionId = req.params.id;
  let updateTransaction = {};

  for(const transactions of req.body) {
    updateTransaction[transactions.field] = transactions.value;
  }

  Transaction.update({ _id: transactionId },{ $set: updateTransaction })
  .then(transaction => {
    res.status(200).json({
      data : transaction
    })
  })
  .catch(err => {
    res.status(500).json({
      error : err
    });
  });
});  
/* DELETE */

router.delete('/:id',(req,res) => {
  let notifId = req.params.id;

  Notif.remove({ _id: notifId })
  .then(notification => {
    res.status(200).json({
      data : notification
    })
  })
  .catch(err => {
    res.status(500).json({
      error : err
    });
  });
});  
module.exports = router;
