$(function(){
/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.toTop a').on('click',function(){
			$('html,body').animate({
				scrollTop:0
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});
})


$(function(){
/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.about').on('click',function(){
			$('html,body').animate({
				scrollTop:740
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});
})

$(function(){
/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.works').on('click',function(){
			$('html,body').animate({
				scrollTop:1120
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});
})

$(function(){
/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.blog').on('click',function(){
			$('html,body').animate({
				scrollTop:2040
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});
})