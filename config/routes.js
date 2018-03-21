const Index = require('../app/controllers/index');
const User = require('../app/controllers/user');
const Movie = require('../app/controllers/movie');
const Comment = require('../app/controllers/comment');
const Category = require('../app/controllers/category');
const multipart = require('connect-multiparty');
let multipartMiddleware = multipart();

module.exports = function(app){
	// pre handle user
	app.use(function(req, res,next){
		let _user = req.session.user; // 从session读取y用户

		app.locals.user = _user;
		next();	
	});

	//路由编写 .调用controller

	// index page
	app.get('/', Index.index);

	// User
	app.post('/user/signup',User.signup);
	app.post('/user/signin', User.signin);
	app.get('/signin', User.showSignin);
	app.get('/signup', User.showSignup);
	app.get('/logout',User.logout);
	app.get('/admin/user/list', User.signinRequired, User.adminRequired, User.userlist); // 中间件概念
    app.get('/admin/user/new', User.signinRequired, User.adminRequired, User.adduser);
    //app.get('/admin/user_update/:id', User.signinRequired(),User.adminRequired(), User.user_update);
    //app.post('/admin/save_user', User.signinRequired(), User.adminRequired(),User.save_user());
    app.delete('/admin/user/list', User.signinRequired, User.adminRequired, User.user_delete);

	// Movie
	app.get('/movie/:id', Movie.detail);
	app.get('/admin/movie/new', User.signinRequired, User.adminRequired, Movie.new);
	app.get('/admin/movie/update/:id', User.signinRequired, User.adminRequired, Movie.update);
	app.post('/admin/movie', multipartMiddleware, User.signinRequired, User.adminRequired, Movie.savePoster, Movie.save);
	app.get('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.list);
	app.delete('/admin/movie/list',User.signinRequired, User.adminRequired, Movie.del);	
	// Comment
	app.post('/user/comment', User.signinRequired, Comment.save);

	// Category
	app.get('/admin/category/new', User.signinRequired, User.adminRequired, Category.new);
	app.post('/admin/category',User.signinRequired, User.adminRequired, Category.save);
	app.get('/admin/category/list',User.signinRequired, User.adminRequired, Category.list);	

	// Results
	app.get('/results', Index.search);	
};

