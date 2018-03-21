// 处理回复评论数据的逻辑
$(function(){
	$('.comment').click(function(e){
		var target = $(e.currentTarget);// 获取元点击素
		var toId = target.data('tid');
		var commentId = target.data('cid');

		// 是否已经点击过了
		if($('#toId').length>0){
			$('#toId').val(toId);
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'toId',
				name: 'comment[tid]',
				value: toId
			}).appendTo('#commentForm');
		}	
		if($('#commentId').length>0){
			$('#commentId').val(commentId);
		}else{
			$('<input>').attr({
				type: 'hidden',
				id: 'commentId',
				name: 'comment[cid]',
				value: commentId
			}).appendTo('#commentForm');
		}		
	});
});