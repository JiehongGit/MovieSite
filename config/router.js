const express = require('express');
const router = express.Router();
const Index = require('../app/controllers/index'); // 电影首页控制器
const User = require('../app/controllers/user'); // 用户模块路由控制器
const Movie = require('../app/controllers/movie'); // 电影模块路由控制器
const Comment = require('../app/controllers/comment'); // 电影评论控制器
const Category = require('../app/controllers/category'); // 电影分类控制器
const Admin = require('../app/controllers/admin'); 

// 处理文件上传中间件
const multipart = require('connect-multiparty'); 
const multipartMiddleware = multipart();

/* 在Express的app.js文件中，可以向应用添加一些中间件。
   Express的通过方法重载将中间件添加到应用中，这些中间件可以被其后路由中的GET、POST等HTTP方法使用，也可以通过中间件做一些通用的处理。 	
*/
module.exports = function(app) {
	// 预处理用户登录
	app.use(function(req,res,next){
		var _user = req.session.user;
		app.locals.user = _user;
		return next();
	})
	
	// 首页
	app.get('/', Index.index);

	// 搜索
	app.get('/search',Index.search);
	app.get('/movie/:id',Movie.detail);

	// 用户评论
	app.post('/movie/comment/reply',User.signinRequired,Comment.reply);
	
	// 电影管理
	app.get('/admin',User.signinRequired,User.adminRequired,Admin.index);
	app.get('/admin/movie/addMovie', User.signinRequired,User.adminRequired,Movie.movie);
	app.get('/admin/movie/addMovie/:id', User.signinRequired,User.adminRequired,Movie.update);
	app.post('/admin/movie/add',User.signinRequired,User.adminRequired,Movie.add);
	app.get('/admin/movie/list', User.signinRequired,User.adminRequired, Movie.list);
	app.get('/admin/movie/delete', User.signinRequired,User.adminRequired, Movie.delete);  
	
	// 搜索热词管理
	app.get('/admin/keyword/list', User.signinRequired,User.adminRequired, Admin.keywordList);
	app.get('/admin/keyword/delete', User.signinRequired,User.adminRequired, Admin.keywordDelete);

	// 图片上传
	app.post('/admin/movie/fileUpload', User.signinRequired,User.adminRequired,multipartMiddleware,Movie.fileUpload);
	//app.post('/admin/movie/fileUpload', User.signinRequired,User.adminRequired,Movie.fileUpload);
	
	// 用户管理
	app.get('/register', User.register);
	app.post('/user/signin', User.signin);
	app.post('/user/signup', User.signup);
	app.get('/user/logout', User.logout);
	app.get('/admin/user/list', User.signinRequired,User.adminRequired,User.userlist);
    app.get('/admin/user/delete', User.signinRequired,User.adminRequired,User.userDelete);
	
	// 电影分类
	app.get('/admin/category', User.signinRequired,User.adminRequired,Category.new);
	app.post('/admin/category/add', User.signinRequired,User.adminRequired,Category.add);
	app.get('/admin/category/edit/:id', User.signinRequired,User.adminRequired,Category.update);
	app.get('/admin/category/list', User.signinRequired,User.adminRequired,Category.list);
	app.get('/admin/category/delete', User.signinRequired,User.adminRequired,Category.delete);
	
	// 404处理
	app.use(function(req, res, next) {
		// 设置所有HTTP请求的超时时间
		req.setTimeout(5000)
		// 设置所有HTTP请求的服务器响应超时时间
		res.setTimeout(5000)
		next();
	});

	app.use(function(req, res, next) {
		var err = new Error('404 Not Found');
		err.status = 404;
		next(err);
	});
	// 将错误信息渲染 error 模板并显示到浏览器中
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			title: '404',
			message: err.message,
			error: {}
		});
	});
};