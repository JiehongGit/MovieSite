var mongoose = require('mongoose');
var movieSchema = require('../schemas/movieSchema');

// 将 movieSchema 这个模式发布为 Model
// movie -> movies
var movieModel = mongoose.model('movie', movieSchema);

module.exports = movieModel;
