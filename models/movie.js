//加载mongoose工具模块
var mongoose = require('mongoose')
//引入模式文件
var MovieSchema = require('../schemas/movie')
var Movie = mongoose.model('Movie',MovieSchema)

//导出构造模式
module.exports = Movie