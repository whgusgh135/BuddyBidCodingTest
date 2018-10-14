'use strict';

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
}

var multer = require('multer'),
  upload = multer({
    dest: 'modules/products/client/img/product/uploads/',
    limits: { fileSize: 1024 * 1024 * 5},
    fileFilter: fileFilter
  });

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function(app) {
  // Products Routes
  // Note that all routes are supposed to be admin only but
  // the policy is commented out for easier testing.
  app.route('/api/products')
    //.all(productsPolicy.isAllowed)
    .get(products.list)
    .post(upload.single('productImage'), products.create);

  app.route('/api/products/:productId')
    //.all(productsPolicy.isAllowed)
    .get(products.read)
    .put(upload.single('productImage'), products.update)
    .delete(products.delete);

  app.route('/api/products/search/:name')
    //.all(productsPolicy.isAllowed)
    .get(products.search);

  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
