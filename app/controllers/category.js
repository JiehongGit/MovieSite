const categoryModel = require('../models/categoryModel');

exports.add_category = function(req, res) {
    res.render('add_category', {
        title: '电影分类录入页',
        category: {
            name: '普通分类'
        }
    });
};

exports.save_category = function(req, res) {
    var _category = req.body.category;
    var category = new categoryModel(_category);
    category.save(function(err, category) {
        if (err) {
            console.log(err);
        }
        res.redirect('/admin/category_list');
    });
};

exports.category_list = function(req, res) {
    categoryModel.findAll(function(err, categorys) {
        if (err) {
            console.log(err);
        }
        res.render('category_list', {
            title: '电影分类列表',
            categorys: categorys
        });
    });
};