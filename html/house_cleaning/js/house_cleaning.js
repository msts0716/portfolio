$(function(){
	var outContent = [];
	var outTitle = [];
	var outImageUrl = [];
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
    .always(function(data){
    })
	function AdjustData(data, num){
		var content = data[num].content.rendered;
		var noImg = '<img src =./img/noimg.jpg>';
        var imgurl = content.match(/<figure class="wp-block-image">(.*)<\/figure>/);
        var imageData = (imgurl===null) ? noImg : imgurl[1];
		content = content.replace('<figure class="wp-block-image">' + imageData + '</figure>','');
		content = content.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
		content = content.replace(/\s+/g,'');
		content = CountStr(content);
		var title = data[num].title.rendered;
		outTitle.push(title);
		outContent.push(content);
		outImageUrl.push(imageData);

	}
	function CountStr(str){
	    var cutFigure = '30'; 
	    var afterTxt = '…'; 
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
	$('.chk').on('blur',function(){
		var name = $(this).attr('name');
			if($(this).val()==''){
						console.log(message)
					$('.err_'+name).html('入力してください');
			}else{
				var result = null;
				var message = '';
				if(name=='phone'){
					result = $(this).val().match(/^\d{10,11}$/);
					message =　'電話番号の形式が異なります';
				}else{
					result = $(this).val().match(/[^!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]+/);
					message = '不正な記号が含まれています';
				}
				if(result==null){
					$('.err_'+name).html(message);
				}else{
					$('.err_'+name).html('');
				}
			}
	});
});



