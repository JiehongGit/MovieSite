// 处理删除电影数据的逻辑
$(function(){
	$('.del').click(function(e){
		var target = $(e.target);
		var id = target.data('id');// 获取元点击素
		var tr = $('.item-id-'+id);

		$.ajax({
			type: 'DELETE',
			url: '/admin/movie/list?id='+id // 异步请求类型：删除
		})
		.done((results) => {
			if(results.success ===1) {
				if(tr.length>0){
					tr.remove();
				}
			}
		});
	});
	$('#douban').blur(function(){
		let douban = $(this);
		let id = douban.val();

		if(id){
			$.ajax({
				url: 'https://api.douban.com/v2/movie/subject/' + id,
				cache: true,
				type: 'get',
				dataType:'jsonp',
				crossDomain: true,
				jsonp: 'callback',
				success: function(data){
					$('#inputTitle').val(data.title);
					$('#inputDoctor').val(data.directors[0].name);
					$('#inputCountry').val(data.countries[0]);
					$('#inputPoster').val(data.images.large);
					$('#inputYear').val(data.year);
					$('#inputSummary').val(data.summary);
				}
			});			
		}

	});
});