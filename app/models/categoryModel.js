var mongoose = require('mongoose');
var categorySchema = require('../schemas/categorySchema');

// 将 categorySchema 这个模式发布为 Model
// category -> categorys
var categoryModel = mongoose.model('category', categorySchema);

module.exports = categoryModel;
