$(function(){
	var dspStart = '0';
	$('.dspData').val(dspStart);
	var inputNum = 0;
	var nextNum = 0;
	var operator ='+';
	var CalFlg = 0;
	var DispFlg = 0;
	//数字を入れる
	$('.Num').on('click',function(){	
		var inputData = $(this).val();
		var dData = $('.dspData').val();
		if (CalFlg == 1){
			dData = '0';
		}
		if(dData==='0'){
			dData = inputData;
		}else{
			dData += inputData;
		}
		$('.dspData').val(dData);
		CalFlg = 0;
		$('.Clear').val('C');
	});
	//四則演算
	$('.Comp').on('click',function(){
		var ope = $(this).val();
		if (ope == '=' && DispFlg == 0) return;
		if (ope != '=') DispFlg = 1;
		if (CalFlg == 0) {
			nextNum = $('.dspData').val();
			var tData = inputNum + operator + nextNum;
			tData = eval(tData);
			inputNum = tData;
			$('.dspData').val(tData);
		}else{
			if (ope=='=') {
				var tData = inputNum + operator + nextNum;
				tData = eval(tData);
				inputNum = tData;
				$('.dspData').val(tData);
			}
		}
		if(ope=='÷'){
			ope='/';
		}
		if(ope=='×'){
			ope='*';
		}
		if(ope!='='){
			operator=ope;
		}
		CalFlg = 1;
	});
	//オールクリアとクリア
	$('.Clear').on('click',function(){
		var Mode = $(this).val();
		if(Mode == 'AC'){
			DispFlg = 0;
			dspStart = '0';
			$('.dspData').val(dspStart);
			inputNum = 0;
			nextNum = 0;
			operator ='+';
			CalFlg = 0;
			$('.dspData').val();
			$('.Clear').val('C');
		}else{
			dspStart = '0';
			$('.dspData').val(dspStart);
			$('.Clear').val('AC');
		}
	});
	//プラスマイナス
	$('.PlusMinus').on('click',function(){
		var dData = $('.dspData').val();
		dData = (-1) * dData;
		$('.dspData').val(dData);
	});
	//パーセント
	$('.Percent').on('click',function(){
		var dData = $('.dspData').val();
		dData = dData / 100;
		$('.dspData').val(dData);
	});
	//小数点
	$('.Dot').on('click',function(){
		var inputData = $(this).val();
		var dData = $('.dspData').val();
		if (CalFlg == 1){
			dData = '0';
		}
		CalFlg = 0;
		if(dData.match(/\./)) return;
		dData += inputData;
		$('.dspData').val(dData);
		$('.Clear').val('C');
	});
});


