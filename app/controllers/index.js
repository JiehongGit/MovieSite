const Movie = require('../models/movies');
const Category = require('../models/category');

// index page
exports.index = function(req, res){
	// console.log('user in session');
	// console.log(req.session.user);

	Category
		.find({})
		.populate({path: 'movies', options: {limit: 6}})
		.exec(function(err, categories){
			if(err){
				console.log(err);
			}
			res.render('index', { // 返回首页
				title: '首页' ,// 传递参数，替代占位符
				categories: categories
			});
		});
};

// search page
exports.search = function(req, res){
	let catId = req.query.cat;
	let q = req.query.q;
	let page = parseInt(req.query.p, 10) || 0; // 没传默认0
	let count = 6
	let index = page * count;

	if(catId){
		Category
			.find({_id: catId})
			.populate({
				path: 'movies',
				select: 'title poster'
				// options: {limit: 2, skip: index}
			})
			.exec(function(err, categories){
				if(err){
					console.log(err);
				}
				let category = categories[0] || {};
				let movies =category.movies || [];
				let results = movies.slice(index, index + count)
				// console.log(movies)
				res.render('results', { // 返回首页
					title: '结果列表页面',// 传递参数，替代占位符
					keyword: category.name,
					movies: results,
					currentPage: (page + 1),
					//Math.ceil向上取整
					totalPage: Math.ceil(movies.length / count),
					query: 'cat=' + catId
				});
			});
	}else{
		Movie
			.find({title: new RegExp((q + '.*'),'i')})
			.exec(function(err, movies){
				if(err){
					console.log(err);
				}

				let results = movies.slice(index, index + count);

				// console.log(movies)
				res.render('results', { // 返回首页
					title: '结果列表页面',// 传递参数，替代占位符
					keyword: q,
					movies: results,
					currentPage: (page + 1),
					totalPage: Math.ceil(movies.length / count),
					query: 'q='+q
				});
			});
	}
};

