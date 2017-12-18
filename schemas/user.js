// 引入mongoose模块
var mongoose = require('mongoose');
// 引入bcrybt模块
var bcrybt = require('bcrypt');

/*
SALT_WORK_FACTOR 表示密码加密的计算强度，从1级到10级，强度越高，密码越复杂，计算时间也越长。
值得注意的是，强度为1-3时强度太低，系统会默认使用强度为10的计算方式进行加密
*/
// 定义加密密码计算强度
var SALT_WORK_FACTOR = 10;

// 定义用户模式
var UserSchema = new mongoose.Schema({
    name:{
        unique: true,
        type: String
    },
    password: {
        unique: true,
        type: String
    },

    meta:{
        createAt:{
            type:Date,
            default: Date.now()
        },
        updateAt:{
            type:Date,
            default: Date.now()
        }
    }
});

// 为模式添加方法
// 使用pre中间件在用户信息存储前进行密码加密
UserSchema.pre('save',function (next){
    var user = this;

    if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else{
        this.meta.updateAt = Date.now()
    }

    // 进行加密（加盐）
    bcrybt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) {
            return next(err)
        }
        bcrybt.hash(user.password, salt, function (err, hash) {
            if (err) {
                return next(err)
            }
            user.password = hash;
            next()
        })
    })
});

// UserSchema模式的静态方法
UserSchema.static('findByID',function(id,cb){
    return this
        .findOne({_id:id})
        .exec(cb)
});

UserSchema.static('fetch',function(cb){
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
});

module.exports = UserSchema;