const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // Reject file
  if (file.mimetype === 'img/jpeg' || file.mimetype === 'img/png') {
    cb(null, true);
  } else {
    cb(null, false); 
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const Product = require('../models/product');

router.get('/', (req, res, next) => {
  Product.find()
  .select('name price _id productImage')
  .exec()
  .then(docs => {
    const response = {
      count: docs.length,
      products: docs.map(doc => {
        return {
          name: doc.name,
          price: doc.price,
          productImage: doc.productImage,
          _id: doc._id,
          request: {
            type: 'GET',
            url: `https://node-rest-shop-brendon1911.c9users.io/products/${doc._id}`
          }
        };
      })
    };
    //if (docs.length >= 0) {
      res.status(200).json(response);
    //} else {
    //   res.status(404) .json({
    //     message: 'No entries found'
    //   });
    // }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.post('/', upload.single('productImage'), (req, res, next) => {
  console.log(req.file);
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });
  product.save()
  .then(result => {
    console.log(result);
    res.status(201).json({
    message: 'Created product successfully',
    createdProduct: {
      name: result.name,
      price: result.price,
      _id: result._id,
      request: {
        type: 'GET',
        url: `https://node-rest-shop-brendon1911.c9users.io/products/${result._id}`
      }
    }
  });
  }).catch(err => {
    console.log(err);
    res.status(500).json({
      error: err
    });
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
  .select('name price _id productImage')
  .exec()
  .then(doc => {
    console.log("From database", doc);
    if (doc) {
      res.status(200).json({
        product: doc,
        request: {
          type: 'GET',
          description: 'Get all products with the link below',
          url: 'https://node-rest-shop-brendon1911.c9users.io/products'
        }
      }); 
    } else {
      res.status(404).json({
        message: 'No valid entry found for provided ID'
      });
    }
  })
  .catch(err => {
    console.log(err);
    res.status(500).json({error: err});
  });
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
  .exec()
  .then(result => {
    console.log(result);
    res.status(200).json({
      message: 'Product successfully updated',
      request: {
        type: 'GET',
        url: `https://node-rest-shop-brendon1911.c9users.io/products/${id}`
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

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
  .exec()
  .then(result => {
    res.status(200).json({
      message: 'Product successfully deleted',
      request: {
        type: 'POST',
        url: 'https://node-rest-shop-brendon1911.c9users.io/products',
        body: { name: 'String', price: 'Number' }
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

module.exports = router;