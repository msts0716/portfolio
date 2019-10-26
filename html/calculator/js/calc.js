$(function(){
	var dspStart = '0';
	$('.dspData').val(dspStart);
	//dspDataにdspStartを取り込む
	var inputNum = 0;
	var nextNum = 0;
	var operator ='+';
	var CalFlg = 0;

	//数字を入れる
	$('.Num').on('click',function(){	
		var inputData = $(this).val();
		var dData = $('.dspData').val();
		if (CalFlg == 1){
			dData = '0';
		}
		if(dData==='0'){
			//＝が3つ:完全一致
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
		if (CalFlg == 0) {
			nextNum = $('.dspData').val();
			//nextNumにdspDataに入っている値を取り出して格納する(取り込む)
			var tData = inputNum + operator + nextNum;
			tData = eval(tData);
			//eval:文字式を式として計算する
			inputNum = tData;
			$('.dspData').val(tData);
			//dspDataにtDataの値を表示する
		}else{
			if (ope=='=') {	
				var tData = inputNum + operator + nextNum;
				tData = eval(tData);
				//eval:文字式を式として計算する
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
			//opeが=ではないとき
			operator=ope;
		}
		CalFlg = 1;
	});

	//オールクリアとクリア
	$('.Clear').on('click',function(){
		var Mode = $(this).val();
		if(Mode == 'AC'){
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
		dData = (-1) * dData;
		$('.dspData').val(dData);
	});



});


