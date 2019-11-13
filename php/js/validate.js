//validate JavaScript
$(function(){
	validate.init();
});
//
var validate = {
	errorMessage:{'name':'','tel':'','mail':'','subject':'','contents':''},
	reqArr:['name','tel','mail','subject','contents'],									//必須項目のnameを格納
	chkArr:{'name':false,'tel':false,'mail':false,'subject':false,'contents':false},	//必須項目のnameを格納　デフォルト値としてfalse
	postReg:new RegExp('/^\d{3}-\d{4}$/'),
	enReg:new RegExp('/^[a-zA-Z]*$/'),
	init:function(){
		validate.addEvent();
		validate.reInputAlert();
	},
	addEvent:function(){
		 $('input, textarea').on('blur',function(){
		 	$this = $(this);
		 	validate.actionEvent($this);
		 });
	},
	actionEvent:function($this){
	 	var val = $this.val();
	 	var id = $this.attr('name');
	 	var chk = false;

	 	//Null チェック
	 	if (validate.reqArr.indexOf(id) >= 0){
	 		chk = validate.nullCheck(val,id);
		}
	 	if(chk==true){
	 		//各バリデーションチェック
		 	switch (id){
		 		case 'tel':
		 			//半角変換
		 			$this.val(validate.chgHankaku(val,1));
		 			val = validate.chgHankaku(val,1);
		 			chk = validate.chk_num(val);
		 			break;
	 			case 'mail':
	 				//半角変換
		 			$this.val(validate.chgHankaku(val,1));
		 			val = validate.chgHankaku(val,1);
	 				chk = validate.MailCheck(val);
	 				break;
		 		default:
		 			//半角記号チェック
		 			$this.val(validate.chgHankaku(val,2));
		 			val = validate.chgHankaku(val,2);
		 			chk = validate.symbolCheck(val,id);
		 			break;
		 	}
		 	if(chk) $('.' + id + '_div span.err_msg').text('');
	 	}else{
	 		//エラーテキスト出力
	 		$('.' + id + '_div span.err_msg').text(validate.errorMessage[id]);
	 	}
	 	//BORDER ALERT CLASS ADD OR REMOVE
	 	if(!chk){
	 		$('#'+id).addClass('error');
	 	}else{
	 		$('#'+id).removeClass('error');
	 	}
	 	//入力チェック更新
	 	validate.chkArr[id] = chk;
	 	// 送信ボタンのアクティブ化判定
	 	validate.activateBtn();
	},
	chk_num:function(str1){
		validate.errorMessage['tel']='';
		if(str1.match(/^\d{10,11}$/)){	
			$('.tel_div span.err_msg').text(validate.errorMessage['tel']);
			return true;
		}else{
			validate.errorMessage['tel']='-(ハイフン)なしの数字のみを入力してください';
			$('.tel_div span.err_msg').text(validate.errorMessage['tel']);
			return false;
		}
	},
	chk_furistr:function(str1){
		//1.半角を全角に返還
		var strzen = validate.chgHankaku(str1,2);
		if(strzen.match(/^[ぁ-ん]*$/)){
			errorMessage['furi']='';
			return true;
		}else{
			errorMessage['furi']='ひらがなのみ入力してください';
			return false;
		}
	},
	//全角半角変換用
	isHankaku:function(value){
		var a = 1;
		var re = new RegExp("ｱ|ｲ|ｳ|ｴ|ｵ|ｶ|ｷ|ｸ|ｹ|ｺ|ｻ|ｼ|ｽ|ｾ|ｿ|ﾀ|ﾁ|ﾂ|ﾃ|ﾄ|ﾅ|ﾆ|ﾇ|ﾈ|ﾉ|ﾊ|ﾋ|ﾌ|ﾍ|ﾎ|ﾏ|ﾐ|ﾑ|ﾒ|ﾓ|ﾔ|ﾕ|ﾖ|ﾗ|ﾘ|ﾙ|ﾚ|ﾛ|ﾜ|ﾝ|ｦ|ｧ|ｨ|ｩ|ｪ|ｫ|ｯ|ｬ|ｭ|ｮ|ﾞ|ﾟ|ｰ", "g");
		if (re.test(value)) {
			return a;
		}
		return value;
	},
	chgHankaku:function(val,flg){
		//flg = 1 ⇒　半角化
		val = $.trim(val);
		flg = flg || '1';
		han = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
		han += "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｬｭｮｯ";
		han += "!\"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~ ";
		zen = "０１２３４５６７８９ＡＢＣＤＥＦＧＨＩＪＫＬＭＮＯＰＱＲＳＴＵＶＷＸＹＺａｂｃｄｅｆｇｈｉｊｋｌｍｎｏｐｑｒｓｔｕｖｗｘｙｚ";
		zen += "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンァィゥェォャュョッ";
		zen += "！”＃＄％＆’（）＊＋，－．／：；＜＝＞？＠［￥］＾＿｀｛｜｝～　";

		// change zenkaku
		if(flg == '2'){
			str1 = han;
			str2 = zen;
		}else{
			str1 = zen;
			str2 = han;
		}

		for (i = 0; i < val.length; i++){
			n = str1.indexOf(val.charAt(i),0);
			if (n >= 0){
				val = val.replace(val.charAt(i),str2.charAt(n));
			}
		}
		return val;
	},
	//ひらがな変換用
	chgHira:function(str){
    	return str.replace(/[\u30a1-\u30f6]/g, function(match) {
        var chr = match.charCodeAt(0) - 0x60;
        return String.fromCharCode(chr);
    	});
	},
	MailCheck:function(mail){
		// -------------------------------------------------------------------
		// メールアドレスチェック関数
		// -------------------------------------------------------------------
		validate.errorMessage['mail'] = '';
	    let mail_regex1 = new RegExp( '(?:[-!#-\'*+/-9=?A-Z^-~]+\.?(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*|"(?:[!#-\[\]-~]|\\\\[\x09 -~])*")@[-!#-\'*+/-9=?A-Z^-~]+(?:\.[-!#-\'*+/-9=?A-Z^-~]+)*' );
	    let mail_regex2 = new RegExp( '^[^\@]+\@[^\@]+$' );
	    if( mail.match( mail_regex1 ) && mail.match( mail_regex2 ) ) {
	        // 全角チェック
	        if( mail.match( /[^a-zA-Z0-9\!\"\#\$\%\&\'\(\)\=\~\|\-\^\\\@\[\;\:\]\,\.\/\\\<\>\?\_\`\{\+\*\} ]/ ) ) {
	        	validate.errorMessage['mail'] = 'メールアドレスに半角以外の文字が含まれております。';
	        	$('.mail_div span.err_msg').text(validate.errorMessage['mail']);
	        	return false;
	        }
	        // 末尾TLDチェック（〜.co,jpなどの末尾ミスチェック用）
	        if( !mail.match( /\.[a-z]+$/ ) ) {
	        	validate.errorMessage['mail'] = 'メールアドレスのドメイン部分に不正な部分があります。';
	        	$('.mail_div span.err_msg').text(validate.errorMessage['mail']);
	        	return false;
	        }
	        // 不正記号チェック（-「ハイフン」 .「ドット」  _「アンダーバー」のみ許可）
	        if( mail.match( /[\!\"\#\$\%\&\'\(\)\=\~\|\^\\\[\;\:\]\,\/\\\<\>\?\`\{\+\*\} ]/ ) ) {
	        	validate.errorMessage['mail'] = 'メールアドレスには半角英数字、記号は_（アンダーバー）.（ドット）-（ハイフン）@（アットマーク）のみです。';
	        	$('.mail_div span.err_msg').text(validate.errorMessage['mail']);
	        	return false;
	        }
	        $('.mail_div span.err_msg').text(validate.errorMessage['mail']);
	        return true;
	    } else {
			validate.errorMessage['mail'] = 'メールアドレスの形式が異なります';
			$('.mail_div span.err_msg').text(validate.errorMessage['mail']);
	        return false;
	    }		
	},
	symbolCheck:function(str,id){
		let reg = new RegExp(/[!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]/g);
		let title = '';
		if(reg.test(str)) {	
			title = validate.selectTitle(id);
			validate.errorMessage[id] = title + 'に半角記号の使用はできません。ご確認ください。'
			$('.' + id + '_div span.err_msg').text(validate.errorMessage[id]);
			return false;
		}
		$('.' + id + '_div span.err_msg').text('');
		return true;
	},
	selectTitle:function(id){
		//メッセージタイトル選択
		let textTitle = '';
	 	switch (id){
	 		case 'tel':
	 			textTitle = '電話番号';
	 			break;
 			case 'mail':
	 			textTitle = 'メールアドレス';
	 			break;
	 		case 'name':
	 			textTitle = '氏名';
	 			break;
 			case 'subject':
 				textTitle = '件名';
	 			break;
 			case 'contents':
 				textTitle = '問い合わせ内容';
	 			break;
	 		default:
	 			textTitle = 'システムエラー';
	 			break;
	 	}
	 	return textTitle;
	},
	nullCheck:function(str,id){
		//メッセージテキスト選択
		let textTitle = '';
	 	textTitle = validate.selectTitle(id);
		if(str==''||str==null){
			validate.errorMessage[id]=　textTitle + 'は必須項目です';
			return false;
		}
		return true;
	},
	activateBtn:function(){
		//送信ボタン　アクティブ化　判定
		var arr = validate.chkArr;
		var cnt = 0;
		for (key in arr) {
			if(!arr[key]) cnt++;
		}
		(cnt) ? $('#submit').attr('disabled',true) : $('#submit').attr('disabled',false);
	},
	reInputAlert:function(){
		let initCheck = 0;
		var value = '';
		for (var i = 0; i < validate.reqArr.length; i++) {
			value = $('#'+validate.reqArr[i]).val();
			if(value!='') initCheck++;
		}
		if(initCheck){
			for (var i = 0; i < validate.reqArr.length; i++) {
				var id = '#' + validate.reqArr[i];
				id = $(id);
				validate.actionEvent(id);
			}
		}
	}
}

//メモ
//関数(機能を自作する)
//これまではprepend、attend、after、htmlなどJQueryの関数を使っていた
//$('#id')などもそう
//上記を0から書こうとするとめっちゃ長くなる
//ので単純化されている

//配列
// var a =['abc','def']
//各要素を1つの箱に格納してまとめて持ってこれる
//,によって敷居を作る
//左から0,1と名前が振られる


//連想配列(オブジェクト配列)関数を配列に組み込むことが可能
//オブジェクト指向:関数をうまく使える、呼び出せる
//⇒機能別に作ることで改修や更新がラクになる

//var b = {'name':'abc','mail':'def'};
//右は値、左はラベル(名前をつけることができる)

//中身を取り出す場合
//b.name⇒'abc'を取り出す
//b['name']でも可