// 加载mongoose工具模块
var mongoose = require('mongoose')
// 引入模式文件
var MovieSchema = require('../schemas/movie')
// 使用mongoose的模型方法编译生成模型
var Movie = mongoose.model('Movie',MovieSchema)
// 将模型构造函数导出
module.exports = Movie 