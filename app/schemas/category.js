var mongoose = require('mongoose')
var Schema = mongoose.Schema
var ObjectId = Schema.Types.ObjectId

var CategorySchema = new Schema({
  name: String,
  movies: [{type: ObjectId, ref: 'Movie'}],
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  }
})

// 为模式添加新的方法, movieSchema.pre 表示每次存储数据之前都先调用这个方法
CategorySchema.pre('save', function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  }
  else {
    this.meta.updateAt = Date.now()
  }

  next()
})

// CategorySchema模式的静态方法
CategorySchema.statics = {
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findById: function(id,cb){
		return this.findOne({_id: id}).exec(cb);
	},
  	delete: function(id,cb){
		return this.remove({_id: id}).exec(cb);
	},
}

// 导出movieSchema模式
module.exports = CategorySchema