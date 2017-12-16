var mongoose = require('mongoose')

// Movie的结构概要（模式）
var MovieSchema = new mongoose.Schema({
    director: String,
    title: String,
    language: String,
    country: String,
    summary: String,
    flash: String,
    poster: String,
    year: Number,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            default:Date.now()
        }
    }
})

// 为模式添加方法
// movieSchema.pre表示每次存储数据之前都先调用这个方法
MovieSchema.pre('save',function (next) {
    if (this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else{
        this.meta.updateAt = Date.now()
    }
    next()
})

// movieSchema模式的静态方法
MovieSchema.static('findByID',function(id,cb){
    return this
        .findOne({_id:id})
        .exec(cb)
})

MovieSchema.static('fetch',function(cb){
    return this
        .find({})
        .sort('meta.updateAt')
        .exec(cb)
})

module.exports = MovieSchema