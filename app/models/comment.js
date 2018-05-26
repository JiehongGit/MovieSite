var mongoose = require('mongoose')
var CommentSchema = require('../schemas/comment')
// 使用mongoose的模型方法编译生成模型
var Comment = mongoose.model('Comment',CommentSchema)
// 将模型构造函数导出
module.exports  = Comment 