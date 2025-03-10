const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Order.find()
  .select('product quantity _id')
  .populate('product', 'name')
  .exec()
  .then(docs => {
    return res.status(200).json({
      count: docs.length,
      orders: docs.map(doc => {
        return {
          _id: doc._id,
          product: doc.product,
          quantity: doc.quantity,
          request: {
            type: 'GET',
            url: `https://node-rest-shop-brendon1911.c9users.io/orders/${doc._id}`
          }
        };
      })
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', (req, res, next) => {
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
      _id: mongoose.Types.ObjectId() ,
      quantity: req.body.quantity,
      product: req.body.productId
      });
      return order.save();
  })
  .then(result => {
    console.log(result);
    res.status(201).json({
      message: 'Order stored',
      createdOrder: {
        _id: result._id,
        product: result.product,
        quantity: result.quantity
      },
      request: {
        type: 'GET',
        url: `https://node-rest-shop-brendon1911.c9users.io/orders/${result._id}`
      }
    });
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
  .select('order quantity _id')
  .populate('product')
  .exec()
  .then(order => {
    if (!order) {
      res.status(404).json({
        message: 'Order not found'
      });
    }
    res.status(200).json({
      order: order,
      request: {
        type: 'GET',
        url: 'https://node-rest-shop-brendon1911.c9users.io/orders'
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

router.delete('/:orderId', (req, res, next) => {
  Order.remove({ _id: req.params.orderId })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Order deleted',
      request: {
        type: 'POST',
        url: 'https://node-rest-shop-brendon1911.c9users.io/orders',
        body: { productId: 'ID', quantity: 'Number'}
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      error: err
    });
  });
});

module.exports = router;