const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session')
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo')(session);

// mongoose
var dbUrl = 'mongodb://127.0.0.1:27017/test';
mongoose.connect(dbUrl, { useMongoClient: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'Mongodb connect error !'));
db.once('open', function() {
    console.log('Mongodb started !');
});

var app = express();

// moment.js
app.locals.moment = require('moment');

// view engine setup
app.set('views', path.join(__dirname, 'app/views/pages'));
app.set('view engine', 'pug');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'imooc',
    resave: false,
    saveUninitialized: true,
    store: new mongoStore({
        url: dbUrl,
        collection: 'sessions'
    })
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

/**
 * 开发环境：
 * （显示报错信息、显示 HTTP 状态、美化 html 源代码、显示 mongoose debug 信息）
 */
if (app.get('env') === 'development') {
    app.set('showStackError', true);
    // express.logger 在express 4.0后已经迁出，现在为 morgan
    // app.use(express.logger(':method :url :status'));
    app.use(logger(':method :url :status'));
    app.locals.pretty = true;
    mongoose.set('debug', true);
}

// routes
require('./config/routes')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500).render('error');
});

module.exports = app;
