'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');
 
/**
 * Create a Product
 */
exports.create = function(req, res) {
  var product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
    availableStockQuantity: req.body.availableStockQuantity,
    description: req.body.description,

    // check if image is uploaded or image url is given
    productImage: req.file ? req.file.path : req.body.productImage
  });

  // add categories
  // check if user has passed any category first
  if(req.body.category) {
    // check if there is any duplicates in category array
    if(hasDuplicates(req.body.category)) {
      return res.status(400).send({
        message: "Cannot have duplicate categories"
      });
    }
    for(var i = 0; i < req.body.category.length; i++) {
      product.category.push(req.body.category[i]);
    }
  }
  
  
  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  res.json(product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product.name = req.body.name ? req.body.name : req.product.name;
  product.price = req.body.price ? req.body.price: req.product.price;
  product.availableStockQuantity = req.body.availableStockQuantity ? req.body.availableStockQuantity : req.product.availableStockQuantity;
  product.description = req.body.description ? req.body.description : req.product.description;

  // check if image is uploaded or image url is given
  product.productImage = req.file ? req.file.path : req.body.productImage;

  // add categories
  // req.body.category has to be passed as an array
  product.category = [];
  if(req.body.category) {
    if(hasDuplicates(req.body.category)) {
      return res.status(400).send({
        message: "Cannot have duplicate categories"
      });
    }
    for(var i = 0; i < req.body.category.length; i++) {
      product.category.push(req.body.category[i]);
    }
  }

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find().sort('-created').populate('category').exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(products);
    }
  });
};

/**
 * Search Product
 * controller to search product by name
 */
exports.search = function(req, res) {
  Product.findOne({name: req.params.name}).populate('category').exec(function(err, product) {
    return res.json(product);
  });
}



/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('category').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};


// helper method to check if there is a duplicate name in an array
var hasDuplicates = function(array) {
  var valuesSoFar = Object.create(null);
  for (var i = 0; i < array.length; ++i) {
      var value = array[i].name;
      if (value in valuesSoFar) {
          return true;
      }
      valuesSoFar[value] = true;
  }
  return false;
}
