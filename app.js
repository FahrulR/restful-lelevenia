require('dotenv').config()

const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

/* REDIS */
// const redis = require('redis')
// const client = redis.createClient(process.env.REDIS_PORT);


/* Products */
const productRoute = require('./api/routes/products');
/* Category */
const categoryRoute = require('./api/routes/categories');
/* Cart */
const tmpCartRoute = require('./api/routes/tmp_order');
/* Transaction */
const transactionRoute = require('./api/routes/transactions');
/* User */
const userRoute = require('./api/routes/users');
/* Order */
const orderRoute = require('./api/routes/orders');
/* Notification */
const notifRoute = require('./api/routes/notif');
/*Wishlist */
const wishlistRoute = require('./api/routes/wishlist');

mongoose.connect(process.env.DB_CONNECTION, {useNewUrlParser: true})
.then(()=>{
  console.log('Server is up')
})
.catch((err)=>{
  console.log('Server is not ok:',err)
});
mongoose.Promise = global.Promise;

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/views'))

/**
 * CORS SETUP
 */
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

/**
 * Routing
 */

app.use('/users', userRoute);
app.use('/products', productRoute);
app.use('/categories', categoryRoute);
app.use('/transactions', transactionRoute);
app.use('/orders', orderRoute);
app.use('/tmpCart', tmpCartRoute);
app.use('/notif',notifRoute);
app.use('/wishlist',wishlistRoute);

/**
 * Error Handler
 */
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message
    }
  })
})

// module.exports.client = client
module.exports.rootPath = __dirname
module.exports = app;


