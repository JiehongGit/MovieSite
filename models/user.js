// 加载mongoose工具模块
var mongoose = require('mongoose');
// 引入模式文件
var UserSchema = require('../schemas/user.js');
// 将模式进行编译，生成构造函数（模型）
var User = mongoose.model('User',UserSchema);

// 导出构造模式
module.exports = User;