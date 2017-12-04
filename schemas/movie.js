var mongoose = require('mongoose')
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

//为模式添加方法
// movieSchema.pre 表示每次存储数据之前都先调用这个方法
MovieSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }
    else{
        this.meta.updateAt = Date.now()
    }
    next()
})

// movieSchema 模式的静态方法
MovieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})
            .sort('meta.updateAt')
            .exec(cb)
    },
    findById: function (id,cb) {
        return this
            .findOne({_id: id})
            .exec(cb)
    }
}

module.exports = MovieSchema