$(function(){
	//コンマ
	var count = 0;
	var DotCount = 0;
	var Seccond = 0;
	var Minute = 0;
	var timerID;
	var RapCount = 0;
	var countup = function(){
		count++;
		Dot();
	}
	var SecUp = function(){
		Seccond++;
	}
	var MinUp = function(){
		Minute++;
	}
	//スタート&ストップ
	$('.Start').on('click',function(){
		var Mode = $(this).val();
		if(Mode == '開 始'){
			timerID = setInterval(countup,10); 
			$('.Start').val('停 止');
			$('.Rap').val('ラップ');
		}else{
			clearTimeout(timerID);
			$('.Start').val('開 始');
			$('.Rap').val('クリア');
		}
	});
	//ストップウォッチ
	var Dot = function(){
		DotCount = count;
		if(String(DotCount).length>=2) {
			DotCount = String(DotCount).substr(-2);
		}else{
			DotCount = '0' + String(DotCount);
		}
		$('.Dot').text(DotCount);
		if(DotCount>=99) {
			SecUp();
			if(Seccond<=9) {
				Seccond = '0' + String(Seccond);
			}else{
				Seccond = String(Seccond).substr(-4,2);
			}
		}
		if(Seccond==0) {
				Seccond = '00';
			}

		//秒を分に切り替える
		if(Seccond>59) {
			(Seccond)= 0;
			MinUp();
			if(Minute<=9) {
				Minute = '0' + String(Minute);
			}else{
				Minute = String(Minute).substr(-6,2);
			}
		}
		if(Minute==0) {
				Minute = '00';
			}
		$('.Seccond').text(Seccond);
		$('.Minute').text(Minute);
	}
	//ラップ
	$('.Rap').on('click',function(){
		var Mode = $(this).val();
		if(Mode == 'ラップ'){
			if (RapCount > 3) return;
			$('.RapList').append('<p>'+Minute+':'+Seccond+'.'+DotCount+'</p>');
			RapCount++;
		}else{
			$('.RapList').text('');
			RapCount = 0;
			count = 0;
			DotCount = 0;
			Seccond = 0;
			Minute = 0;
			$('.Dot').text('00');
			$('.Seccond').text('00');
			$('.Minute').text('00');
		}	
	});
});