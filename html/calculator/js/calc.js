$(function(){
	var dspStart = '0';
	$('.dspData').val(dspStart);
	//dspDataにdspStartを取り込む
	var inputNum = 0;
	var nextNum = 0;
	var operator ='+';
	var CalFlg = 0;
	var DispFlg = 0;
	//変数を作る際のポイント：全体向けは共通データとして保持したい時、個別向けは特定の機能の中で頻繫に出るものを簡略化するために用いる


	//数字を入れる
	$('.Num').on('click',function(){	
		var inputData = $(this).val();//押した数字を格納する
		var dData = $('.dspData').val();//現在表示されている数字を保存する
		if (CalFlg == 1){
			dData = '0';
		}
		if(dData==='0'){
			//＝が3つ:完全一致
			dData = inputData;
		}else{
			dData += inputData;
		}
		$('.dspData').val(dData);//dspDataにdDataの数字を出力する
		CalFlg = 0;
		$('.Clear').val('C');
	});

	//四則演算
	$('.Comp').on('click',function(){
		var ope = $(this).val();
		
		//初期表示時'='→計算ストップ
		if (ope == '=' && DispFlg == 0) return;
		//'='以外が押された→計算式稼働
		if (ope != '=') DispFlg = 1;

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

		//表示している数字にピリオドがある場合
		if(dData.match(/\./)) return;
		dData += inputData;
		$('.dspData').val(dData);
		$('.Clear').val('C');
	});
});


