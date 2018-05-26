var mongoose = require('mongoose')
var KeywordSchema = require('../schemas/keyword')
// 使用mongoose的模型方法编译生成模型
var Keyword = mongoose.model('Keyword',KeywordSchema)
// 将模型构造函数导出
module.exports  = Keyword 