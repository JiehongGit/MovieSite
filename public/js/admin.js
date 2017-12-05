//e是event事件的缩写，相当于读取目标元素p触发事件的目标节点<p>event节点内容</p>里的内容
//通过e可以调出来执行p.click事件时候p元素里面的内容。
$(function(){
    $('.del').click(function(e){ //e 是被jquery改造后的event对象
        //return confirm('确定要删除吗')
        var target = $(e.target) //拿到当前点击按钮
        var id = target.data('id')
        var tr = $('.item-id-' + id) //拿到表格的一行

        //调用ajax
        $.ajax({
            method: 'DELETE', //异步请求为delete
            url: '/admin/list?id=' + id
        })
            .done(function(results){
                if(results.success === 1){
                    if(tr.length >0 ){
                        tr.remove()
                    }
                }
            })
    })
})