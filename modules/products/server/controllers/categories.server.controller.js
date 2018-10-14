'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Category = mongoose.model('Category'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller'));
 
/**
 * Create a Category
 */
exports.create = function(req, res) {
  var category = new Category({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name
  });

  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Show the current Category
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var category = req.category ? req.category.toJSON() : {};

  res.json(category);
};

/**
 * Update a Category
 */
exports.update = function(req, res) {
  var category = req.category;

  category.name = req.body.name;
  
  category.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * Delete an Category
 */
exports.delete = function(req, res) {
  var category = req.category;

  category.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(category);
    }
  });
};

/**
 * List of Categories
 */
exports.list = function(req, res) {
  Category.find().sort('-created').exec(function(err, categories) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.json(categories);
    }
  });
};

/**
 * Search Category
 * controller to search category by name
 */
exports.search = function(req, res) {
  Category.findOne({name: req.params.name}).exec(function(err, category) {
    return res.json(category);
  });
}



/**
 * Category middleware
 */
exports.categoryByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Category is invalid'
    });
  }

  Category.findById(id).exec(function (err, category) {
    if (err) {
      return next(err);
    } else if (!category) {
      return res.status(404).send({
        message: 'No Category with that identifier has been found'
      });
    }
    req.category = category;
    next();
  });
};
