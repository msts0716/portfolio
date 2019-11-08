$(function(){
/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.toTop a').on('click',function(){
			$('html,body').animate({
				scrollTop:0
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});

/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.about').on('click',function(){
			$('html,body').animate({
				scrollTop:740
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});

/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.works').on('click',function(){
			$('html,body').animate({
				scrollTop:1120
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});

/*DOM(htmlの後に読み込んでくださいという)コード*/
	$('.blog').on('click',function(){
			$('html,body').animate({
				scrollTop:2040
			},600);/*1000msで1秒、0.6sでも可*/
			return false;
	});




	var outContent = [];	//本文
	var outTitle = [];		//タイトル
	var outImageUrl = [];	//画像
	//Ajax WordPress REST API
	// URL：http://localhost/wordpress/wp-json/wp/v2/posts
	//JSON データを取得

	$.getJSON('http://localhost/wordpress/wp-json/wp/v2/posts',{
	 	format:"json"//取得したデータをjson形式で整形
	 })
    //取得が完了したら
    .done(function(data){
    	for (var i = 0; i < data.length; i++) {
    		AdjustData(data,i);
    	}
    	OutputBlog();
    })

    //取得失敗したら
    .fail(function(){
        
    })

    //どの状況でも
    .always(function(data){
       
    })

	function AdjustData(data, num){
		//取得するデータを1個のfunctionに格納する
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

		/*
		title:タイトル
		content:内容
		imgaData:画像

		*/
		outTitle.push(title);
		outContent.push(content);
		outImageUrl.push(imageData);

	}

	function CountStr(str){
	    var cutFigure = '30'; // カットする文字数
	    var afterTxt = '…'; // 文字カット後に表示するテキスト
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
	//val:ボタンや表示の中の文字にのみ使う html:タグを書く必要がある text:タグの内容を更新


});



