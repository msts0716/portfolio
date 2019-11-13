$(function(){
	$('a[href^="#"]').on('click',function(){
	    var speed = 500;
	    var href= $(this).attr("href");
	    var target = $(href == "#" || href == "" ? 'html' : href);
	    var position = target.offset().top;
	    $("html, body").animate({scrollTop:position}, speed, "swing");
	    return false;
  	});
	var outContent = [];	//本文
	var outTitle = [];		//タイトル
	var outImageUrl = [];	//画像
	$.getJSON('http://localhost/wordpress/wp-json/wp/v2/posts',{
	 	format:"json"
	 })
    .done(function(data){
    	for (var i = 0; i < data.length; i++) {
    		AdjustData(data,i);
    	}
    	OutputBlog();
    })
    .fail(function(){      
    })
	function AdjustData(data, num){
		var content = data[num].content.rendered;
		var noImg = '<img src =./img/noimg.jpg>';//画像がない時の代替画像
		//画像データ取得
		//画像の有無判定
        var imgurl = content.match(/<figure class="wp-block-image">(.*)<\/figure>/);
        var imageData = (imgurl===null) ? noImg : imgurl[1];
		//本文データ（画像部分除去データ取得）
		content = content.replace('<figure class="wp-block-image">' + imageData + '</figure>','');
		content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
		content = content.replace(/\s+/g,'');
		content = CountStr(content);
		//タイトルデータ取得
		var title = data[num].title.rendered;
		outTitle.push(title);
		outContent.push(content);
		outImageUrl.push(imageData);
	}
	function CountStr(str){
	    var cutFigure = '30'; // カットする文字数
	    var afterTxt = '…';   // 文字カット後に表示するテキスト
	    var textTrim = str.substr(0,(cutFigure))
	    textTrim += afterTxt;
	    return textTrim;  
	}
	function OutputBlog(){
		var count = 0;
		var colCount = 0;
		for (var i = 0; i < outImageUrl.length; i++) {
			if (i%3==0) {
				colCount++;
				$('.blogList').append('<div class="blogSec'+ colCount +'"></div>');
			}
			$('.blogSec'+colCount).append('<section class="three-co blog'+ count +'"><li></li><p class="BlogText"></p><div class="more_div"><a clss="more">more</a></div></section>');
			$('section.blog'+ count +' li').append(outImageUrl[count]);
			$('section.blog'+ count +' li').append('<h3>'+outTitle[count]+'</h3>');
			$('section.blog'+ count +' p.BlogText').html(outContent[count]);
			count++;
		}
	}
});



