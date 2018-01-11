// 引入mongoose模块
var mongoose = require('mongoose');
// 引入bcrypt模块
var bcrypt = require('bcrypt');

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
    password: String,
    /*role:{
        type: Number,
        default: 0
    },*/
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
//保存用户之前的操作，设置meta属性，利用哈希算法和加盐算法重置密码
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
    /*bcrybt.hash(user.password, null, null, function (err, hash) {
        if (err){
            return next(err)
        }
        user.password = hash;
        next()
    })*/
});

UserSchema.methods = {
    comparePassword: function (_password, cb) {
        bcrybt.compare(_password, this.password, function (err, res) {
            if (err){
                return cb(err)
            }
            cb(null, res)
        })
    }
};

// UserSchema模式的静态方法
UserSchema.static = {
    fetch: function (cb) {
        return this
            .find({})
            .sort("meta.updateAt")
            .exec(cb)
},
    findById: function (id,cb) {
        return this({
            _id: id
        }).exec(cb)
    },
    findByName: function (id,cb) {
        return this.findOne({
            name: _name
        }).exec(cb)
    }
};

module.exports = UserSchema;