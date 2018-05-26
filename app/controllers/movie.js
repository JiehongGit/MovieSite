const _ = require('underscore'); // 该模块用来对变化字段进行更新
const Movie = require('../models/movie'); // 电影数据模型
const Category = require('../models/category'); // 电影分类模型
const Comment = require('../models/comment'); // 电影评论模型
const fs =require('fs'); // 读写文件模块
const path = require('path'); // 路径模块

/* 电影信息录入控制器 */
exports.movie= function(req, res) {
	Category.fetch(function(err,categories){
		res.render('addMovie',{
			title: '后台录入',
			movie:{
				director:'',
				actors: '',
				country:'',
				title:'',
				year:'',
				poster:'',
				language:'',
				trailer:'',
				download:'',
				summary:''
			},
			categories: categories
		})
	})
};

/* 电影详情页面控制器 */
exports.detail = function(req, res) {
	let id = req.params.id;
	// 电影用户访问统计，每次访问电影详情页，pv值增加1
	Movie.update({_id:id},{$inc:{pv:1}},function(err){
		if(err){
			console.log(err);
		}
	})
	// Comment存储到数据库中的_id值与相应的movie id值相同
	Movie.findById(id, function(err,movie){
		// 查找该id值所对应的评论信息
		Comment
		  .find({movie:id})
		  .populate("from","name")
		  .populate('reply.from reply.to', 'name')
		  .exec(function(err,comments){
			if(err){
				console.log(err);
			}
			res.render('detail',{
				title: movie.title + ' - 详情',
				movie: movie,
				comments: comments
			})
		});
	});
};

/* 电影信息更新控制器 */
exports.update = function(req, res) {
	let id = req.params.id;
	if(id){
		// 若id存在，则通过Movie模型拿到这部电影的数据
		Movie.findById(id, function(err,movie){
			if(err){
				console.log(err);
			}
			Category.fetch(function(err,categories){
				if(err){
					console.log(err);
				}
				res.render('addMovie',{
					title: '电影编辑',
					movie: movie,
					categories: categories
				})
			});
		});
	}
};

/* 电影信息添加控制器 */
exports.add = function(req,res){
	let id = req.body.movie._id;
	let movieObj = req.body.movie;
	// 声明一个movie对象
	let _movie;
	if(id){
		Movie.findById(id,function(err,movie){
			if(err){
				console.log(err);
			}
			// 调用underscore的extend方法
			_movie = _.extend(movie,movieObj);

			_movie.save(function(err,movie){
				if(err){
					console.log(err);
				}
				res.json({"success":true,"data":"编辑电影成功"});
			})
		})
	} else {
		_movie = new Movie(movieObj);
		let categoryId = _movie.category;
		_movie.save(function(err,movie){
			if(err){
				console.log(err);
			}
			Category.findById(categoryId,function(err,category){
				if(err){
					console.log(err);
				}
				category.movies.push(movie._id);
				category.save(function(err,category){
					res.json({"success":true,"data":"添加电影成功"});
				})
			})
		});
	}
};

/* 电影信息列表控制器 */
exports.list = function(req, res) {
	Movie.fetch(function(err,movies){
		if(err){
			console.log(err);
		}
		res.render('list',{
			title: '电影列表',
			movies: movies
		});
	})
};

/* 电影列表删除控制器 */
exports.delete = function(req, res) {
	// 获取客户端Ajax发送的URL值中的id值
	let id = req.query.id;
	// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
	if(id){
		// 查找该条电影信息
		Movie.delete(id,function(err,movie){
			if(err){
				console.log(err);
			} else {
				// 给客户端返回json数据
				res.json({'success': true});
			}
		})
	}
};

exports.fileUpload = function(req,res){
	let postData = req.files.file;
	let filePath = postData.path;
	let originalFilename = postData.originalFilename;
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			let timestamp = Date.now();
			let type = postData.type.split('/')[1];
			let poster = timestamp+'.'+type;
			let newPath = path.join(__dirname,'../../','public/upload/'+poster);
			fs.writeFile(newPath,data,function(err){
				let src = '/upload/' + poster;
				res.json({'src':src});
			});
		});
	}
}

exports.uploadPoster = function(req,res,next){
	let postData = req.files.uploadPoster;
	let filePath = postData.path;
	let originalFilename = postData.originalFilename;
	if(originalFilename){
		fs.readFile(filePath,function(err,data){
			let timestamp = Date.now();
			let type = postData.type.split('/')[1];
			let poster = timestamp+'.'+type;
			let newPath = path.join(__dirname,'../../','public/upload/'+poster);
			fs.writeFile(newPath,data,function(err){
				req.poster = '/upload/' + poster;
				next();
			});
		});
	} else {
		next();
	}
}
