const User = require('../models/users');

// showSignup page
exports.showSignup = function(req,res){
	res.render('signup', {
		title: '注册页面'
	});
};
// showSignin page
exports.showSignin = function(req,res){
	res.render('signin', {
		title: '登陆页面'
	});
};
// singn up 注册
exports.signup = function(req, res){
	let _user = req.body.user;
	// /user/signup/:useerId?useerId=1122;
	// 三种获取userId，1.req.params.userid, 2.req.body.userid 3.req.query.useerid,  若直接使用req.param('userid'),会从123按顺序找

	// 查找是或否用户名已存在
	User.findOne({name:_user.name}, function(err, user){ // find返回的是数组
		if(err){
			console.log(err);
		}
		if(user&&user.length){
			return res.redirect('/signup');
		}
		else{
			user = new User(_user);
			user.save(function(err, user){
				if(err){
					console.log(err);
				}else{
					console.log(user);
					res.redirect('/');
				}
			})	
		}
	})

};

// signin 登陆
exports.signin = function(req,res){
	let _user= req.body.user;
	let name = _user.name;
	let password = _user.password;

	User.findOne({name:name}, function(err,user){
		if(err){
			console.log(err);
		}
		if(!user){
			return res.redirect('/signup');
		}
		// compare password
		user.comparePassword(password, function(err, isMatched){
			if(err){
				console.log(err);
			}
			if(isMatched){
				req.session.user = user; // 写入session,不做处理重启服务就消失了
				// console.log("Password is matched");
				return	res.redirect('/');
			}else{
				return res.redirect('/signin');
				console.log("Password is not matched");
			}
		});
	});
};

// logout
exports.logout = function(req,res){
	delete req.session.user;
	// delete app.locals.user
	res.redirect('/');
};
// userlist page
exports.userlist = function(req,res){
	User.fetch(function(err ,users){
		if(err){
			console.log(err);
		}
		res.render('userlist', {
			title: '用户列表页',
			users: users
		});

	});
};

//
exports.adduser = function(req, res) {
    res.render('add_user', {
        title: '用户录入页',
        user: {
            name: '',
            password: '',
            role: 10
        }
    });
};

// middware for user
exports.signinRequired = function(req,res,next){
	let user = req.session.user;

	if(!user){
        console.log('未登录，没有访问权限！')
		return res.redirect('/signin');
	}
	next();
};
// middware for admin
exports.adminRequired = function(req,res,next){
	let user = req.session.user;

	if(user.role<=10 || !user.role){
		return res.redirect('/signin');
	}
	next();
};

/**
 * 用户录入逻辑
 */
/*
exports.save_user = function(req, res) {
    let id = req.body.user._id;
    let userObj = req.body.user;
    let postUser = null;

    // 若 id 存在则更新，不存在就创建
    if (id) {
        console.log('修改失败，用户名已存在！');

        userModel.findById(id, function(err, user) {
            if (err) {
                console.log(err);
            }

            // postUser = Object.assign({}, user, movieObj);
            // 用 underscore 替换对象
            postUser = _.extend(user, userObj);
            postUser.save(function(err, user) {
                if (err) {
                    console.log(err);
                }

                // 重定向
                res.redirect('/admin/user_list');
            });
        });
    } else {
        postUser = new user({
            name: userObj.name,
            password: userObj.password,
            role: userObj.role
        });

        postUser.save(function(err, user) {
            if (err) {
                console.log(err);
            }

            // 重定向
            res.redirect('/admin/user_list');
        });
    }
};

// 修改用户
exports.user_update = function(req, res) {
    let id = req.params.id;
    console.log(id)

    if (id) {
        userModel.findById(id, function(req, user) {
            res.render('add_user', {
                title: '后台用户修改页',
                user: user
            });
        });
    }
};

// 删除用户
exports.user_delete = function(req, res) {
    let id = req.query.id;

    if (id) {
        userModel.remove({ _id: id }, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
};*/
// 修改用户
exports.user_update = function(req, res) {
    let id = req.params.id;

    if (id) {
        User.findById(id, function(req, user) {
            res.render('add_user', {
                title: '后台用户修改页',
                user: user
            });
        });
    }
};

// 删除用户
exports.user_delete = function(req, res) {
    let id = req.query.id;

    if (id) {
        User.remove({ _id: id }, function(err, user) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
};
