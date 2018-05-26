const Category = require('../models/category'); // 电影分类模型
const _ = require('underscore');

/* 电影分类录入控制器 */
exports.new = function(req,res){
	res.render('category',{
		title: '分类录入',
		category: {
			name: ''
		}
	})
}

/* 电影分类添加控制器 */
exports.add = function(req,res){
	let id = req.body.category._id;
	let categoryObj = req.body.category;
	let _category;
	if(id !== ''){
		Category.findById(id,function(err,category){
			if(err)	console.log(err);
			_category = _.extend(category,categoryObj);
			_category.save(function(err,category){
				if(err){
					console.log(err);
				}
				res.json({"success":true,"data":"编辑分类成功"});
			})
		})
	} else {
		_category = new Category({
			name: categoryObj.name,
		})
		_category.save(function(err,movie){
			if(err){
				console.log(err);
			}
			res.json({"success":true,"data":"新增分类成功"});
		});
	}
}

/* 电影分类编辑控制器 */
exports.update = function(req, res) {
	let id = req.params.id;

	if(id){
		Category.findById(id, function(err,category){
			if(err){
				console.log(err);
			}
			res.render('category',{
				title: '分类编辑',
				category: category
			})
		});
	}
}

/* 电影分类列表控制器 */
exports.list = function(req,res){	
	Category.fetch(function(err,categories){
		if(err) console.log(err);
		res.render('category_list',{
			title: '分类列表',
			categories: categories
		})	
	})
}

/* 电影分类删除控制器 */
exports.delete = function(req,res){	
	// 获取客户端Ajax发送的URL值中的id值
	let id = req.query.id;
	if(id){
		// 如果id存在则服务器中将该条数据删除并返回删除成功的json数据
		Category.delete(id,function(err,category){
			if(err){
				console.log(err);
			} 
			res.json({'success':true});
		})
	}
}