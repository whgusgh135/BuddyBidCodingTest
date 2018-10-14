'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  categories = require('../controllers/categories.server.controller');

module.exports = function(app) {
  // Categories Routes
  app.route('/api/categories')
    .get(categories.list)
    .post(categories.create);

  app.route('/api/categories/:categoryId')
    .get(categories.read)
    .put(categories.update)
    .delete(categories.delete);

  app.route('/api/categories/search/:name')
    .get(categories.search);

  // Finish by binding the Category middleware
  app.param('categoryId', categories.categoryByID);
};
