// 加载express模块
var express = require('express');
// 创建一个express应用,express()是一个由express模块导出的入口(top-level)函数
var app = express();
// 引入path模块
var path = require('path');
// 不引入不行,新版本中bodyParser不在express中而是单独存在的，引入前还需npm install body-parser，再require，再app.use()
var bodyParser = require('body-parser');
// 引入mongoose模块
var mongoose = require('mongoose');
// 引入相关的模块
var Movie = require('./models/movie.js');
var User = require('./models/user.js');
// 引入underscore模块
var _underscore = require('underscore');
// 引入pug模块
var pug = require('pug');
// 设置端口(也可以从命令行中设置全局变量)，process是一个全局变量，获取环境变量和外围传入的参数
var port = process.env.PORT || 3000;
// 引入时间模块
var moment = require('moment');

/*设置静态资源
const serveStatic = require('serve-static');*/

/*
启动M]mongoDB数据库命令
mongod --dbpath D:\MongoDB\data
*/

// 由于mongoose中已不自带Promise，所以需要设置一个全局Promise
mongoose.Promise = global.Promise;
// 创建数据库连接
mongoose.connect('mongodb://localhost:27017/moviesite',{useMongoClient: true});


// 实例赋给一个变量,设置视图根目录
app.set('views',path.join(__dirname,"./views/pages"));
// 设置默认模板引擎
app.set('view engine','pug');

/*
1、extended为false表示使用querystring来解析数据，这是URL-encoded解析器
2、返回一个只解析urlencoded消息体的中间件，只接受utf-8对消息体进行编码，同时支持自动的gzip/deflate编码解析过的消息放在req.body对象中。
3、这个对象包含的键值对，同时值可以是一个string或者一个数组(当extended为false的时候)。也可以是任何类型(当extended设置为true)
4、加extended:true，否则会在post的时候出错
5、！！！解析 POST 方法中的表单数据*/
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(express.bodyParser())
// app.locals.moment = require('moment')

// 设置静态目录，使view中引入的东西路径正确
app.use(express.static(path.join(__dirname,'public')));
// 使用 Moment.js
app.locals.moment = require('moment');

// app.use(serveStatic(path.join(__dirname,'bower_components')))

// 监听端口
app.listen(port);
// 打印日志
console.log('Server is running at http://localhost:' + port + '/');

/* ---------- 路由添加 ---------- */

// 错误页
/*function miss(res,err) {
	res.render('miss',{
		title: '发生错误',
		err: err
	})
}*/

// 首页
app.get('/',function(req,res){
	Movie.fetch(function (err,movies) {
		if(err){
		    // 打印错误
		    console.log(err)
			// miss(res,err)
			// return
		}
		res.render('index',{
			title: 'MovieSite 首页',
			movies:movies
        })
	})
});

// signup
app.post('/user/signup', function (req,res) {
    var _user = req.body.user;
    var user = new User(_user);

    console.log(_user)
});

// detail page
app.get('/movie/:id',function(req,res){
    // params方法用于从express路由器获取参数
	var id = req.params.id;
	Movie.findById(id, function (err,movie) {
        /*if (err) {
            miss(res, err)
            return
        }*/
        res.render('detail', {
            title: movie.title,
            movie: movie
        })
    })
});

// admin page
app.get('/admin/movie', function(req,res){
	res.render('admin',{
		title: 'MovieSite 后台录入页',
		movie: {
			title: '',
            director: '',
			country: '',
			age: '',
			poster: '',
			url: '',
			summary: '',
			language: ''
		}
	})
});

// admin update movie
app.get('/admin/update/:id', function (req,res) {
	var id = req.params.id;
    if (id) {
        Movie.findById(id, function (err, movie) {
            /*if (err) {
                miss(res, err)
                return
            }*/
            res.render('admin', {
                title: '后台更新页',
                movie: movie
            })
        })
	}
});

// admin post movie 后台提交路由
app.post('/admin/movie/new', function (req, res) {
	var id = req.body.movie._id;
	var movieObj = req.body.movie;
	var _movie;
	if (id !== 'undefined'&& id !==''){
		Movie.findById(id, function (err, movie) {
			if (err){
                // miss(res, err)
                // return
                console.log(err)
			}
			_movie = _underscore.extend(movie, movieObj);
			_movie.save(function (err, movie) {
				if (err){
                    // miss(res, err)
                    // return
                    console.log(err)
				}
				res.redirect('/movie/' + movie._id)
            })
        })
	}
	else {
		_movie = new Movie({
            director: movieObj.director,
            title: movieObj.title,
            country: movieObj.country,
            language: movieObj.language,
            age: movieObj.age,
            poster: movieObj.poster,
            summary: movieObj.summary,
            url: movieObj.url
		});
        _movie.save(function (err, movie) {
            if (err){
                miss(res, err);
                return
            }
            res.redirect('/movie/' + movie._id)
        })
	}
});

// list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function (err,movies) {
        if(err){
            // miss(res, err)
            // return
            console.log(err)
        }
        res.render('list',{
            title: 'MovieSite 列表页',
            movies: movies
        })
    })
});

// list delete movie data 列表页删除电影
app.delete('/admin/list', function (req, res) {
    var id = req.query.id;
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                // miss(res, err)
                // return
                console.log(err)
            }
            else {
                res.json({success: 1})
            }
        })
    }
});

