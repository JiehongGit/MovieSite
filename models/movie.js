//加载mongoose工具模块
var mongoose = require('mongoose')
//引入模式文件
var MovieSchema = require('../schemas/movies.js')
// 将模式进行编译，生成构造函数（模型）
var Movie = mongoose.model('Movie',MovieSchema)

//导出构造模式
module.exports = Movie