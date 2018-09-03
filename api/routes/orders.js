const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200) .json({
    message: 'Orders retrieved'
  });
});

router.post('/', (req, res, next) => {
  res.status(201) .json({
    message: 'Order was created'
  });
});

router.get('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId;
  res.status(200) .json({
    message: 'Order details',
    orderId: orderId
  });
});

router.delete('/:orderId', (req, res, next) => {
  const orderId = req.params.orderId;
  res.status(200) .json({
    message: 'Order deleted',
    orderId: orderId
  });
});

module.exports = router;