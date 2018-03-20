/**
 * 处理电影控制逻辑
 */

const movieModel = require('../models/movieModel');
const commentModel = require('../models/commentModel');
const _ = require('underscore');

// GET detail page.
exports.detail = function(req, res) {
    // 取到 url '/detail/:id' 中的 id
    var id = req.params.id;

    movieModel.findById(id, function(err, movie) {
        // 取到该电影的评论数据
        commentModel.find({ movie: id }, function(err, comments) {
            console.log(comments);

            if (err) {
                console.log(err);
            }

            res.render('detail', {
                title: '电影详情页',
                movie: movie,
                comments: comments
            });
        });

    });
};

// GET add_movie page.
exports.add_movie = function(req, res) {
    res.render('add_movie', {
        title: '后台电影录入页',
        movie: {
            title: '',
            director: '',
            country: '',
            year: '',
            poster: '',
            url: '',
            summary: '',
            language: ''
        }
    });
};

// add_movie page - post
exports.movie_save = function(req, res) {
    var id = req.body.movie._id;
    var movieObj = req.body.movie;
    var postMovie = null;

    // 若 id 存在则更新，不存在就创建
    if (id) {
        movieModel.findById(id, function(err, movie) {
            if (err) {
                console.log(err);
            }
            // postMovie = Object.assign({}, movie, movieObj);
            // 用 underscore 替换对象
            postMovie = _.extend(movie, movieObj);
            postMovie.save(function(err, movie) {
                if (err) {
                    console.log(err);
                }

                // 重定向
                res.redirect('/detail/' + movie._id);
            });
        });
    } else {
        postMovie = new movieModel({
            title: movieObj.title,
            director: movieObj.director,
            country: movieObj.country,
            language: movieObj.language,
            year: movieObj.year,
            poster: movieObj.poster,
            url: movieObj.url,
            summary: movieObj.summary
        });

        postMovie.save(function(err, movie) {
            if (err) {
                console.log(err);
            }
            // 重定向
            res.redirect('/detail/' + movie._id);
        });
    }
};

// GET movie-list page.
exports.movie_list = function(req, res) {
    movieModel.findAll(function(err, movies) {
        if (err) {
            console.log(err);
        }

        res.render('movie_list', {
            title: '后台电影管理页',
            movies: movies
        });
    });
};

// movie- page - update
exports.movie_update = function(req, res) {
    var id = req.params.id;

    if (id) {
        movieModel.findById(id, function(req, movie) {
            res.render('add_movie', {
                title: '后台电影更新页',
                movie: movie
            });
        });
    }
};

// movie- page - delete
exports.movie_delete = function(req, res) {
    var id = req.query.id;

    if (id) {
        movieModel.remove({ _id: id }, function(err, movie) {
            if (err) {
                console.log(err);
            } else {
                res.json({ success: 1 });
            }
        });
    }
};
