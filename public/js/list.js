var atarget = $('.table-header th').size() -1; 

$('.table-list').dataTable({
	/* 指定按多列数据排序的依据 */
	"aaSorting": [[ 0, "asc" ]], // 默认第几个排序

	/* 开关，是否打开客户端状态记录功能。
	这个数据是记录在cookies中的，打开了这个记录后，即使刷新一次页面，或重新打开浏览器，之前的状态都是保存下来的 */
	"bStateSave": false, // 状态保存
	
	/* 设置列的属性时，可以任意指定列，并且不需要给所有列都设置 */
	"aoColumnDefs": [
	  {"orderable":false,"aTargets":[atarget]} // 制定列不参与排序
	],

	/* 改变语言 */
	"oLanguage" : {
        "sLengthMenu": "显示 _MENU_ 条数据",
        "sZeroRecords": "抱歉， 没有找到",
        "sInfo": "从 _START_ 到 _END_ ，共 _TOTAL_ 条数据",
        "sInfoEmpty": "没有数据",
        "sInfoFiltered": "(从 _MAX_ 条数据中过滤)",
        "sZeroRecords": "没有找到匹配的数据",
        "sSearch": "搜索:",
        "oPaginate": {
        "sFirst": "首页",
        "sPrevious": "上一页",
        "sNext": "下一页",
        "sLast": "尾页"
        }
   }
});

function delete_movie(obj,id){
    var data = {id : id};
    layer.confirm('确认要删除吗？',function(index){
        $.get("/admin/movie/delete",data,function(data){
            $(obj).parents("tr").remove();
            layer.msg('已删除!',{icon:1,time:2000});
        })
    });
}

function delete_user(obj,id){
    var data = {id : id};
    layer.confirm('确认要删除吗？',function(index){
        $.get("/admin/user/delete",data,function(data){
            $(obj).parents("tr").remove();
            layer.msg('已删除!',{icon:1,time:2000});
        })
    });
}
function delete_cat(obj,id){
	var data = {id : id};
	layer.confirm('确认要删除吗？',function(index){
		$.get("/admin/category/delete",data,function(data){
			$(obj).parents("tr").remove();
			layer.msg('已删除!',{icon:1,time:2000});
		})
	});
}
function delete_key(obj,id){
	var data = {id : id};
	layer.confirm('确认要删除吗？',function(index){
		$.get("/admin/keyword/delete",data,function(data){
			$(obj).parents("tr").remove();
			layer.msg('已删除!',{icon:1,time:2000});
		})
	});
}
/*
	Params：
	title	标题
	url		请求的url
	id		需要操作的数据id
	w		弹出层宽度（缺省调默认值）
	h		弹出层高度（缺省调默认值）
*/
function show_layer(title,url,w,h){
	if (title == null || title == '') {
		title=false;
	};
	if (url == null || url == '') {
		url="404.html";
	};
	if (w == null || w == '') {
		w=800;
	};
	if (h == null || h == '') {
		h=($(window).height() - 50);
	};
	layer.open({
		type: 2,
		area: [w+'px', h +'px'],
		fix: false, // 不固定
		maxmin: true,
		shade:0.4,
		title: title,
		content: url
	});
}
