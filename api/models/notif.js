const mongoose = require('mongoose');

const notifSchema = mongoose.Schema({
  id_user : { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
  date : {
    type : Date, 
    default: Date.now
  },
  activity: { type: String }
}, { versionKey : false });

module.exports = mongoose.model('Notif', notifSchema, 'notifikasi')