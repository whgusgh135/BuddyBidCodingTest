'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Basic data validation
 */
var validateName = function (name) {
  return (name.length < 50);
};

var validateDescription = function (description) {
  return (description.length < 300);
};

var validateNumber = function (number) {
  return (number > 0 && number < 100000000);
}

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true,
    unique: true,
    validate: [validateName, 'Product name cannot be longer than 50 characters.']
  },
  description: {
    type: String,
    default: 'No Description',
    validate: [validateDescription, 'Product description cannot be longer than 300 characters.']
  },
  productImage: {
    type: String,
    default: '/modules/products/client/img/profile/default.png'
  },
  price: {
    type: Number,
    required: 'Please fill Product price',
    validate: [validateNumber, 'Please enter valid number']
  },
  availableStockQuantity: {
    type: Number,
    required: 'Please insert available stock quantity',
    validate: [validateNumber, 'Please enter valid number']
  },
  category: [{
    type: Schema.Types.ObjectId,
    ref: 'Category'
  }],
  created: {
    type: Date,
    default: Date.now
  }
});

mongoose.model('Product', ProductSchema);
