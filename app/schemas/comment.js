var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// ObjectId是mongoose中重要的引用字段类型，在Schema中默认配置了该属性，索引也是利用组件进行
var ObjectId = Schema.Types.ObjectId;

var CommentSchema = new mongoose.Schema({
	// type为ObjectID为了实现关联文档的查询
	movie:{
		type: ObjectId,
		ref: 'Movie'
	},
	from:{
		type: ObjectId,
		ref: 'User'
	},
	reply: [{
		from:{type: ObjectId,ref: 'User'},
		to:{type: ObjectId,ref: 'User'},
		content: String,	
		meta:{
			createAt:{
				type:Date,
				default: Date.now()
			}
		}
	}],
	content: String,
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
})

// 为模式添加新的方法
// 模式保存前执行下面函数,如果当前数据是新创建，则创建时间和更新时间都是当前时间，否则更新时间是当前时间
CommentSchema.pre('save',function(next){
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	next();
})

// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
CommentSchema.statics = {
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

module.exports = CommentSchema;