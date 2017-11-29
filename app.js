//加载express模块
var express = require('express')
//设置端口(也可以从命令行中设置全局变量)
//process是一个全局变量，获取环境变量和外围传入的参数
var port = process.env.PORT || 3000
//启动web服务器
var app = express()
//实例赋给一个变量
app.set('views','./views')
//设置默认模板引擎
app.set('view engine','pug')
//监听端口
app.listen(port)
//打印日志
console.log('serer started on port' + port)

//路由添加
app.get('/',function(req,res){
	res.render('index',{
		title: 'MovieSite 首页'
	})
})

app.get('/movie/:id',function(req,res){
	res.render('detail',{
		title: 'MovieSite 详情页'
	})
})

app.get('/admin/movie',function(req,res){
	res.render('admin',{
		title: 'MovieSite 后台录入页'
	})
})

app.get('/admin/list',function(req,res){
	res.render('list',{
		title: 'MovieSite 列表页'
	})
})

