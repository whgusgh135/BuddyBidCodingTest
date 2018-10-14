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

/**
 * Category Schema
 */
var CategorySchema = new Schema({
    name: {
        type: String,
        default: '',
        required: 'Please fill Category',
        trim: true,
        validate: [validateName, 'Category name cannot be longer than 50 characters.']
    }
});
  
mongoose.model('Category', CategorySchema);