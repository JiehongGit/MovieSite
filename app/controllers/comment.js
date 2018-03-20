/**
 * 电影评论逻辑
 */

const commentModel = require('../models/commentModel');

exports.comment_save = function(req, res) {
    var post_comment = req.body.comment;
    var movie_id = post_comment.movie;

    if (post_comment.cid){
        commentModel.findById(post_comment.cid, function (err, comment) {
            var reply = {
                from: post_comment.from,
                to: post_comment.tid,
                content: post_comment.content
            }
            comment.reply.push(reply)

            comment.save(function (err, comment) {
                if (err){
                    console.log(err);
                }
                res.redirect('/detail/' + movie_id);
            })
        })
    }
    else {
        var comment = new commentModel(post_comment)
        comment.save(function (err, comment) {
            if (err){
                console.log(err)
            }
            res.redirect('/detail/' + movie_id);
        })
    }

    /*var commentEntity = new commentModel(post_comment);
    commentEntity.save(function(err, comment) {
        if (err) {
            console.log(err);
        }
        // 重定向
        res.redirect('/detail/' + movie_id);
    });*/
};
