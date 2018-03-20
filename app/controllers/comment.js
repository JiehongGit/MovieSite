/**
 * 电影评论逻辑
 */

const commentModel = require('../models/commentModel');
exports.comment_save = function(req, res) {
    var post_comment = req.body.comment;
    var movie_id = post_comment.movie;
    var commentEntity = new commentModel(post_comment);
    commentEntity.save(function(err, comment) {
        if (err) {
            console.log(err);
        }
        // 重定向
        res.redirect('/detail/' + movie_id);
    });
};
