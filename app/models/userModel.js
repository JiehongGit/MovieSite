var mongoose = require('mongoose');
var userSchema = require('../schemas/userSchema');

// 将 movieSchema 这个模式发布为 Model
// user -> users
var userModel = mongoose.model('user', userSchema);

module.exports = userModel;
