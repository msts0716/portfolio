$(function(){
	var count = 0;
	$('.DespStart').text(count);

	var countup = function(){
		count++;
		$('.DespStart').text(count);
	}

	var timerID = function(){
		setInterval(countup,100); 
		//1秒毎にcountup()を呼び出し
	}

	$('.Start').on('click',function(){
		var Mode = $(this).val();
		if(Mode == '開 始'){
			$('.DespStart').text(timerID);
			$('.Start').val('停 止');
			$('.Rap').val('ラップ');
		}else{
			$('.Start').val('開 始');
			$('.Rap').val('クリア');
		}
	});

//カウントストップ

//コンマ100秒になったときに、0に戻し、1秒を追加する
	var Dot = function(){
		if(count.length=>2) {
		substr(2);
		console.log('yui');
		}
	}

});