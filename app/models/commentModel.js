var mongoose = require('mongoose');
var commentSchema = require('../schemas/commentSchema');

// 将 commonSchema 这个模式发布为 Model
// common -> commons
var commentModel = mongoose.model('comment', commentSchema);

module.exports = commentModel;
