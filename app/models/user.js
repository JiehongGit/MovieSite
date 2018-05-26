var mongoose = require('mongoose')
var UserSchema = require('../schemas/user')
/* 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对象。
   正是Model的存在，让我们操作数据库更加方便快捷。 */
// 使用mongoose的模型方法编译生成模型
var User = mongoose.model('User',UserSchema) // 与User集合关联
// 将模型构造函数导出
module.exports  = User 