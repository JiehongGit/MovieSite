//const Movie = require('../models/movies');
const Category = require('../models/category');
//const Comment = require('../models/comment');
//const _underscore = require('underscore');

//后台录入页admin 
exports.new = function(req, res){
	res.render('category_admin', {
		title: 'immoc 后台分类录入页',
		category: {
			name: ''
		}
	});
};

// admin post category
exports.save = function(req, res){
	console.log('body:', req.body);
	var _category = req.body.category;

	let category = new Category(_category);
	//修改movie---category
	category.save(function(err, category){
		if(err){
			console.log(err);
		}

		res.redirect('/admin/category/list' );
	});
};

//Category list
exports.list = function(req, res){
	Category.fetch(function(err ,categories){
		if(err){
			console.log(err);
		}
		res.render('categorylist', {
			title: '分类列表页',
			categories: categories
		});

	});
};

//cate list delete
exports.del = function(req, res){
    var id = req.query.id
    if(id){
        Category.remove({_id: id},function(err, category){
            if(err){
                console.log(err)
                res.json({success:0})
            }else{
                res.json({success:1})
            }
        })
    }
}