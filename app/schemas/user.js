var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
// 设置盐值
var SALT_WORK_FACTOR = 10;

// 定义一个新的模型，但此模式未与User集合有关联
var UserSchema = new mongoose.Schema({ // 通过Schema的模式接口传入一个对象
	name:{
		unique: true,
		type: String
	},
	// email: String,
	password: String, 
	role: {
		type: Number,
		default: 0
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
})

// 为模式添加新的方法
UserSchema.pre('save',function(next){
	var user = this
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	} else {
		this.meta.updateAt = Date.now();
	}
	// 生成随机的盐，和密码混合后再进行加密
	bcrypt.genSalt(SALT_WORK_FACTOR,function(err,salt){
		if(err) return next(err);
		bcrypt.hash(user.password,salt,null,function(err,hash){
			if(err) return next(err);
			// 将hash后的密码赋值到当前用户密码	
			user.password = hash;
			next();
		});
	});
})

// 实例方法
UserSchema.methods = {
	comparePassword: function(password,cb){
		// 使用bcrypt的compare方法对用户输入的密码和数据库中保存的密码进行比对
		bcrypt.compare(password,this.password,function(err,isMatch){
			if(err) return cb(err);
			cb(null,isMatch);
		})
	}
}

// 静态方法
// 静态方法不会与数据库直接交互，需要经过模型编译实例化后才会具有该方法
UserSchema.statics = {
	fetch: function(cb){
		return this.find({}).sort('meta.updateAt').exec(cb);
	},
	findByName: function(name,cb){
		return this.findOne({name: name}).exec(cb);
	},
	delete: function(id,cb){
		return this.remove({_id: id}).exec(cb);
	},
}

module.exports = UserSchema