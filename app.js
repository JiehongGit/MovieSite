//加载express模块
const express = require('express')
//启动web服务器
const app = express()
const path = require('path')
//不引入不行
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
//引入mongoose模块
const Movie = require('./models/movie.js')
const _underscore = require('underscore')

var pug = require('pug')

//设置端口(也可以从命令行中设置全局变量)，process是一个全局变量，获取环境变量和外围传入的参数
var port = process.env.PORT || 3000

var moment = require('moment')

//设置静态资源
//const serveStatic = require('serve-static');

//创建数据库连接
mongoose.Promise = global.Promise
mongoose.connect('mongodb://localhost:27017/moviesite',{useMongoClient: true})


//实例赋给一个变量,设置视图根目录
app.set('views',path.join(__dirname,"./views/pages"))
//设置默认模板引擎
app.set('view engine','pug')

/*
1、extended为false表示使用querystring来解析数据，这是URL-encoded解析器
2、返回一个只解析urlencoded消息体的中间件，只接受utf-8对消息体进行编码，同时支持自动的gzip/deflate编码解析过的消息放在req.body对象中。
3、这个对象包含的键值对，同时值可以是一个string或者一个数组(当extended为false的时候)。也可以是任何类型(当extended设置为true)
4、加extended:true，否则会在post的时候出错
5、！！！解析 POST 方法中的表单数据*/
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

//app.use(express.bodyParser())
// app.locals.moment = require('moment')

// 设置静态目录，使view中引入的东西路径正确
app.use(express.static(path.join(__dirname,'public')))
// 使用 Moment.js
app.locals.moment = require('moment')

//app.use(serveStatic(path.join(__dirname,'bower_components')))

//监听端口
app.listen(port)
//打印日志
console.log('Server is running at http://localhost:' + port + '/')

//路由添加

//错误页
/*function miss(res,err) {
	res.render('miss',{
		title: '发生错误',
		err: err
	})
}*/

//首页
app.get('/',function(req,res){
	Movie.fetch(function (err,movies) {
		if(err){
		    console.log(err)
			// miss(res,err)
			// return
		}
		res.render('index',{
			title: 'MovieSite 首页',
			movies:movies
        })
		/*movies: [{
            title: '机械战警',
            _id: 1,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
            title: '机械战警',
            _id: 2,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
            title: '机械战警',
            _id: 3,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
            title: '机械战警',
            _id: 4,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
            title: '机械战警',
            _id: 5,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		},{
            title: '机械战警',
            _id: 6,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5'
		}]*/
	})
})

//detail page
app.get('/movie/:id',function(req,res){
	var id = req.params.id
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
    /*
    res.render('detail',{
        title: 'MovieSite' + movie.title,
        movie: {
            director: '何塞·帕迪里亚',
            country: '美国',
            title: '机械战警',
            year: 2014,
            poster: 'http://r3.ykimg.com/05160000530EEB63675839160D0B79D5',
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
            summary: '《机械战警》是由何塞·帕迪里亚执导，乔尔·金纳曼、塞缪尔·杰克逊、加里·奥德曼等主演的一部科幻电影，改编自1987年保罗·范霍文执导的同名电影。影片于2014年2月12日在美国上映，2014年2月28日在中国大陆上映。影片的故事背景与原版基本相同，故事设定在2028年的底特律，男主角亚历克斯·墨菲是一名正直的警察，被坏人安装在车上的炸弹炸成重伤，为了救他，OmniCorp公司将他改造成了生化机器人“机器战警”，代表着美国司法的未来。'
        }*/
})

//admin page
app.get('/admin/movie', function(req,res){
	res.render('admin',{
		title: 'MovieSite 后台录入页',
		movie: {
			title: '',
            director: '',
			country: '',
			year: '',
			poster: '',
			flash: '',
			summary: '',
			language: ''
		}
	})
})

//admin update movie
app.get('/admin/update/:id', function (req,res) {
	var id = req.params.id
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
})

//admin post movie 后台提交路由
app.post('/admin/movie/new', function (req, res) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if (id !== 'undefined'&& id !==''){
		Movie.findById(id, function (err, movie) {
			if (err){
                // miss(res, err)
                // return
                console.log(err)
			}
			_movie = _underscore.extend(movie, movieObj)
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
            year: movieObj.year,
            poster: movieObj.poster,
            summary: movieObj.summary,
            flash: movieObj.flash
		})
        _movie.save(function (err, movie) {
            if (err){
                miss(res, err)
                return
            }
            res.redirect('/movie/' + movie._id)
        })
	}
})

//list page
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
	/*res.render('list',{
		title: 'MovieSite 列表页',

		movies: [{
            title: '机械战警',
            _id: 1,
            director: '何塞·帕迪里亚',
            country: '美国',
            year: 2014,
            language: '英语',
            flash: 'http://player.youku.com/player.php/sid/XNjA1Njc0NTUy/v.swf',
        }]
	})*/
})

// list delete movie data 列表页删除电影
app.delete('/admin/list', function (req, res) {
    var id = req.query.id
    if (id) {
        Movie.remove({_id: id}, function (err, movie) {
            if (err) {
                // miss(res, err)
                // return
                console.log(err)
            }
            res.json({success: 1})
        })
    }
})

