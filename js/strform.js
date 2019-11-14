$(function(){ 
	$('.chk').on('blur',function(){
		var name = $(this).attr('name');
				//直線にクリックした「これ」という形で指定が可能
			if($(this).val()==''){
					$('.err_'+name).html('入力してください');//NULLチェック
			}else{
				var result = null;
				var message = '';
				//入力値チェック
				if(name=='phone'){//電話番号チェック
					result = $(this).val().match(/^\d{10,11}$/);
					message =　'電話番号の形式が異なります';
				}else if(name=='mail'){//メールアドレスチェック
					result = $(this).val().match(/^[A-Za-z0-9]{1}[A-Za-z0-9_.-]*@{1}[A-Za-z0-9]{1,}[A-Za-z0-9_.-]{1,}\.[A-Za-z0-9_.-]{1,}$/);
					message =　'メールアドレスの形式が異なります';
				}else{		  //不正文字チェック
					result = $(this).val().match(/[^!"#$%&'()\*\+\-\.,\/:;<=>?@\[\\\]^_`{|}~]+/);
					message = '不正な記号が含まれています';
				}
					
				if(result==null){//エラー出力及び削除処理
					$('.err_'+name).html(message);
				}else{
					$('.err_'+name).html('');
				}

			}
	});
})