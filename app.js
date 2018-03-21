/*
 * 伪造模板数据跑通前后端交互流程
 */

const express = require('express');
const fs = require('fs');
const path = require('path');  // 设置路径
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// 用户状态持久化三个模块
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoStore = require('connect-mongo')(session);

const logger = require('morgan'); //日志模块 
const serverStatic = require('serve-static');


const port = process.env.PORT || 3000; // 设置端口号，默认3000，process为全局变量，命令PORT=4000 node app.js传入 并启动
const app = express(); //启动一个服务器
const dbURL = 'mongodb://localhost/moviesite'; // 连接数据库

mongoose.connect(dbURL);

// models loading
let model_path = __dirname + '/app/models';
let walk = function(path){
	fs
		.readdirSync(path)
		.forEach(function(file){
			let newPath = path + '/' + file;
			let stat = fs.statSync(newPath);

			if(stat.isFile()){
				if(new RegExp('/(.*)\.(js|coffee)/').test(file)){
					require(newPath);
				}
			} else if(stat.isDirectory()){
				walk(newPath);
			}
		});
};
walk(model_path);

app.set('views', './app/views/pages'); // 设置视图默认目录

app.set('view engine', 'pug'); // 设置默认模板引擎pug, 模板文件后缀保持统一
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));//将表单数据 编码解析,_id 是mongodb的默认主键
app.use(cookieParser()); // cookie中间件，现在需要单独安装cookie-parser,session使用
//app.use(multi());
app.use(session({ // 设置session
	secret:'imooc',
	store: new mongoStore({ // 持久化，重启session也在
		url:dbURL,
		collection: 'session'
	})
}));

// 判断是否是开发环境，是的话打印日志和增肌可读性
if('development' === app.get('env')){ // process.env.NODE_ENV === 'development'
	app.set('showStackError', true);
	app.use(logger(':method :url :status'));
	app.locals.pretty=true;
	mongoose.set('debug', true);
}

require('./config/routes')(app);

//body-parser不在和express打包在一起，要单独安装 app.use(express.bodyParser()); // 表单数据格式化
app.use(serverStatic(path.join(__dirname, 'public'))); // 静态文件
app.locals.moment = require('moment'); // locals的本地变量。模板可直接使用
app.listen(port); //监听端口

console.log('website started on port '+ port); // 监听成功打印信息

