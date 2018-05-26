// 引入express框架
const express = require('express');
// 文件路径模块
const path = require('path');
// 文件处理模块
const fs = require('fs');
// proces为全局变量
const port = process.env.PORT || 3000;
const routes = require('./config/router');
// 处理post数据模块
const bodyParser = require('body-parser');
// 用户状态持久化模块
const cookieParser = require('cookie-parser');
const session = require('express-session');
// 图标模块
const favicon = require('serve-favicon');
// JS模版引擎  $ npm install art-template@3.1.3
const template = require('art-template');

/* Schema、Model、Entity或者Documents的关系请牢记。
   Schema生成Model，Model创造Entity；
   Model和Entity都可对数据库操作造成影响；
   但Model比Entity更具操作性。 */

/* Schema ： 一种以文件形式存储的数据库模型骨架，不具备数据库的操作能力
   Model  ： 由Schema发布生成的模型，具有抽象属性和行为的数据库操作对
   Entity ： 由Model创建的实体，他的操作也会影响数据库 */
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);

// 日志模块
const logger = require('morgan');

// 实例化express对象,用于连接中间件
const app = express();
const env = process.env.NODE_ENV || 'development';

// 数据库连接
let dbUrl = 'mongodb://localhost/MovieSite';
mongoose.Promise = global.Promise;
// mongoose.connect(dbUrl);
mongoose.connect(dbUrl, function(err){
	if(err){
		console.log('数据库连接失败');
	}else{
		console.log('数据库连接成功')
		console.log("server started on port:" + port);
	}
});
/* setTimeout(function(){
	mongoose.disconnect(function(){
		console.log('数据库连接断开')
	})
}, 2000); */

// 时间格式化模块，locals为本地变量,模版中可直接使用
app.locals.moment = require('moment');

// models loading
let models_path = __dirname + '/app/models';
let walk = function(path){
	fs.readdirSync(path).forEach(function(file){
		var newPath = path + '/' + file;
		var stat = fs.statSync(newPath);
		if(stat.isFile()){
			if(/(.*)\.(js|coffee)/.test(file)){
				require(newPath);
			} else if(stat.isDirectory){
				walk(newPath);
			}
		}
	})
}
walk(models_path);

// art-template引擎
app.set("views","./app/views"); // 视图文件根目录
template.config('base','');
template.config('extname', '.html');
app.engine('.html', template.__express); // 设置模板引擎
app.set('view engine', 'html');

// 解析json格式
app.use(bodyParser.json());
// 解析文本格式,limit修改上传文件的大小,默认上传太小了
app.use(bodyParser.urlencoded({ extended: true, limit:"50mb"}));
app.use(cookieParser());
// 设置session
app.use(session({
	secret:"MovieSite",
	resave: true, 
	saveUninitialized: true,
	// 持久化，重启session还存在
	store: new mongoStore({
		url: dbUrl,
		collection: 'sessions',
	}),
	// 设置maxAge是24小时60分钟60秒1000毫秒，即24小时候后session和相应的cookie失效过期
	cookie: {maxAge: 1000 * 60 * 60 * 24},
}));
// 访问所有public目录下的静态资源文件
app.use(express.static(path.join(__dirname, 'public')));
// 网站图标设置
app.use(favicon(path.join(__dirname, 'public/images', 'JHicon.png')));

// 路由设置
// app.use('/', routes);
routes(app); // 路由控制

// 错误处理
if(env === 'development'){
	// 在屏幕上讲信息打印出来
	app.set("showStackError",true);
	// 显示的信息
	app.use(logger(':method :url :status'));
	mongoose.set("debug",true);
}

app.listen(port);
