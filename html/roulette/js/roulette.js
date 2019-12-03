$(function(){
	var scroll = 0;
	var client_h = document.getElementById('tab').clientHeight;
	var Roulette = null;
	
	$('.start').on('click',function(){
		console.log(client_h + 'px');
		//$('#tab').css('transform','translateY(-'+client_h+'px)');
		//var scrollUp = $('#tab').css('transform','translateY(-382px)'
		Roulette = setInterval(scrollUp,1);
	});

	var scrollUp = function(){
		scroll--;
		$('#tab').css('transform','translateY('+scroll+'px)');
		if(scroll <= -client_h){
			scroll = 0;
		}
	}

	$('.stop').on('click',function(){
		clearInterval(Roulette);
	});
});