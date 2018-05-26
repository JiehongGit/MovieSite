$(function(){
	showTab();
	window.onhashchange = function(){
		showTab();
	}
	$(document).on('keyup','[required]',function(){
		if(!$(this).val()){
			formTip($(this),true,'此处不能为空');
		} else {
			formTip($(this),false);
		}
	})
	$(document).on('keyup','[signup-confirm]',function(){
		if($("[signup-pass]").val() != $(this).val()){
			formTip($(this),true,'两次输入的密码不一致');
		} else {
			formTip($(this),false);
		}
	})
	
	$("#form-signup").submit(function(){
		var _this = $(this);
		$.ajax({
			url:'/user/signup',
			method:'POST',
			data: _this.serialize(),
			dataType: 'json',
			success: function(data){
				if(!data.issuccess){
					if(data.place == 'name'){
						formTip($("[signup-name]"),true,data.data);
					}
				} else {
					window.location.href = document.referrer;
				}
				
			},
		})
		return false;
	})
	
	$("#form-signin").submit(function(){
		var _this = $(this);
		$.ajax({
			url:'/user/signin',
			method:'POST',
			data: _this.serialize(),
			dataType: 'json',
			success: function(data){
				if(!data.issuccess){
					if(data.place == 'name'){
						formTip($("[signin-name]"),true,data.data);
					} else if (data.place == 'password'){
						formTip($("[signin-pass]"),true,data.data);
					}
				} else {
					window.location.href = document.referrer;
				}
				
			},
		})
		return false;
	})
})

function formTip(ele,isShow,data){
	if(isShow){
		ele.siblings('label').html(data).addClass('visible');
	}else{
		ele.siblings('label').removeClass('visible');
	}
}

function showTab(){
	if(window.location.hash == "#signin"){
		$(".tab-nav").attr("data-index",1);
		$(".tab-nav").find('a').eq(1).addClass('active').siblings('a').removeClass('active');
		$(".tab").hide();
		$(".tab-signin").show();
	} else {
		$(".tab-nav").attr("data-index",0);
		$(".tab-nav").find('a').eq(0).addClass('active').siblings('a').removeClass('active');
		$(".tab").hide();
		$(".tab-signup").show();
	}
}