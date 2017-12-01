//加载express模块
var express = require('express')
var path = require('path')
//不引入不行
var bodyParser = require('body-parser')
//启动web服务器
var app = express()
//引入mongoose模块
var mongoose = require('mongoose')
var Movie = require('./models/movie')
var _ = require('underscore')
//设置端口(也可以从命令行中设置全局变量)，process是一个全局变量，获取环境变量和外围传入的参数
var port = process.env.PORT || 3000
//设置静态资源
var serveStatic = require('serve-static')

//创建数据库连接
mongoose.connect('mongodb;//localhost:27017/movie')

//实例赋给一个变量
app.set('views','./views/pages')
//设置默认模板引擎
app.set('view engine','pug')

//extended为false表示使用querystring来解析数据，这是URL-encoded解析器
//返回一个只解析urlencoded消息体的中间件，只接受utf-8对消息体进行编码，同时支持自动的gzip/deflate编码解析过的消息放在req.body对象中。这个对象包含的键值对，同时值可以是一个string或者一个数组(当extended为false的时候)。也可以是任何类型(当extended设置为true)
app.use(bodyParser.urlencoded({ extended: true }))
//上面那个要加extended:true，否则会在post的时候出错

//app.use(express.bodyParser())
app.locals.moment = require('moment')

app.use(bodyParser.json());
// 设置静态目录，使view中引入的东西路径正确
app.use(serverStatic('bower_components'))

app.use(serverStatic(path.join(__dirname,'bower_components')))

//监听端口
app.listen(port)
//打印日志
console.log('serer started on port ${port}')

//路由添加
app.get('/',function(req,res){
	Movie.fetch(function (err,movie) {
		if(err){
			console.log(err)
		}
		res.render('index',{
			title: 'MovieSite',
			movies:movie
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
	Movie.findById(id,function (err,movie) {

    })
	res.render('detail',{
		title: 'MovieSite' + movie.title,
		movie: movie
        /*movie: {
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
})

//admin page
app.get('/admin/movie',function(req,res){
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
app.get('/admin/update/:id',function (req,res) {
	var id = req.params.id
	if (id){
		Movie.findById(id,function (err,movie) {
			res.render('admin',{
				title: 'MovieSite 后台更新页',
				movie: movie
			})
        })
	}
})

//admin post movie
app.post('/admin/movie/new',function (res,req) {
	var id = req.body.movie._id
	var movieObj = req.body.movie
	var _movie
	if(id !== 'undefined'){
		Movie.findById(id,function (err,movie) {
			if(err){
				console.log(err)
			}
			_movie = _.extend(movie,movieObj)
			_movie.save(function (err,movie) {
				if(err){
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
        _movie.save(function (err,movie) {
            if(err){
                console.log(err)
            }
            res.redirect('/movie/' + movie._id)
        })
	}
})

//list page
app.get('/admin/list',function(req,res){
    Movie.fetch(function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{
            title: 'MovieSite',
            movies:movies
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

