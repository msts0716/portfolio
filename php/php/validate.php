<?php
class validate{
	//LOGIN chk
	public function chkLogin($id,$pass,$onePass){
		return ($this->chkUserId($id) && $this->chkLoginPass($pass) && $this->chkOneToken($onePass)) ? true : false;
	}
	//LOGIN CHECK PARTS
	public function chkLoginPass($pass){
		return (preg_match('/j[0-9]{8}/', $pass)) ? true : false;
	}
	public function chkUserId($num){
		return (preg_match('/^[0-9]{8}/', $num)) ? true : false;
	}
	public function chkOneToken($num){
		return (preg_match('/^[0-9]{6}/', $num)) ? true : false;
	}
	
	//validation
	//NULL CHECk
	public function nullChk($str){
		if(empty($str)) return false;
		return true;
	}
	//英字・数字のみ
	public function chkInput($input){
		return (preg_match('/^[a-zA-Z0-9]*$/', $input)) ? true : false;
	}
	//英字のみ
	public function chkAlpha($text){
		return (preg_match('/^[a-zA-Z]*$/', $text)) ? true : false;
	}
	//TEL CHKECK
	public function chkTel($tel){
		return (preg_match('/^0[0-9]{9,10}/', $tel)) ? true : false;
	}
	//生年月日
	public function chkBirth($birth){

		if(!$this->chkNum($birth)) return false;
		if(strlen($birth)!=8) return false; 
		return true;
	}
	//数字のみ
	public function chkNum($num){
		return ctype_digit($num);
	}
	//ひらがなのみ
	public function chkHira($str){
		return (preg_match("/^[ぁ-んー]*$/u",$str)) ? true : false;
	}
	//特殊記号の除去（数字、かな、カナ、漢字以外を取り除く（空白も除去されるので注意
	public function replaceText($str){
		return preg_replace("/[^ぁ-んァ-ンーa-zA-Z0-9一-龠\-\r]+/u",'' ,$str);
	}
	//特殊記号有無判定（数字、かな、カナ、漢字、大文字数字、大文字記号以外
	public function chkText($str){
		return (preg_match("/[^ぁ-んァ-ンーa-zA-Z0-9一-龠\-\r]+/u", $str)) ? false : true;
	}
	//特殊記号有無判定（数字、かな、カナ、漢字以外
	public function chkText2($str){
		return (preg_match("/[^ぁ-んァ-ンーa-zA-Z0-9ａ-ｚＡ-Ｚ一-龠\-－、（）；：「」～１２３４５６７８９０@　 ＠.\r]+/u", $str)) ? false : true;
	}
	//半角記号判定
	public function chkSymbol($str){
		return (preg_match("/^[^-\/:-@\[-`\{-\~]+$/",$str)) ? true : false;
	}
	//
	public function chkSkill($str){
		return (preg_match("/[^ぁ-んァ-ンーa-zA-Z0-9ａ-ｚＡ-Ｚ一-龠\-－、()（）；：「」～１２３４５６７８９０@　 ＠.,:：・\/／。、\r\n]+/u", $str)) ? false : true;
	}
	//空白の除去
	public function removeSpace($str){
		return str_replace(array(" ", "　"), "", $str);
	} 
	//メールチェック
	//ドッとなしドメインなどには未対応なので注意(RFCに準拠)
	public function chkMail($mailaddress){
		return (filter_var($mailaddress, FILTER_VALIDATE_EMAIL)) ? true : false;
	}
	//空値チェック
	public function chkEmpty($str){
		return (!empty($str)) ? true : false;
	}
	//数値一桁チェック
	public function chkType($str){
		if(!$this->chkNum($str)) return false;
		if(strlen($birth)!=1) return false; 
		return true;
	}


	//指定文字列のカウント
	/*
	public function countStr($str,$needle){
		return mb_substr_count($str, $needle);
	}
	*/
	//エスケープ処理
	public function h($str) {
	    return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
	}
	//デバッグ出力用
	public function debugDisp($str) {
		echo "<pre>";
		var_dump($str);
		echo "</pre>";
	}
	//全角→半角変換（数字のみ
	public function zenTohan($str){
		return (preg_match('/^[0-9]*$/u', $str)) ? mb_convert_kana($str, 'n','utf-8') : $str;
	}
	//全角→半角（すべて
	public function zenTohanAll($str){
		//var_dump('chk' . $str);
		return mb_convert_kana($str, 'kvrn','utf-8');
	}
}

?>