<?php
//セッションの開始
session_start();
//トークンチェック　クラスモジュール引用
require_once dirname(__FILE__) . '/php/common.php';
$comm = new chkCommon();
$encode = "UTF-8";
//POST,GET,COOKIEなどのノイズを除去
if(isset($_COOKIE)) $_COOKIE = sanitize($_COOKIE);						//NULLバイト除去//
if(isset($_POST)) $_POST = sanitize($_POST);							//NULLバイト除去//
if(isset($_GET)) $_GET = sanitize($_GET);								//NULLバイト除去//
if($encode == 'SJIS') $_POST = $comm -> sjisReplace($_POST,$encode);	//Shift-JISの場合に誤変換文字の置換実行

//確認、再入力、完了時（半角指定のものを半角に変換処理
if(isset($_POST)){
	foreach ($_POST as $key => $value) {
		$_POST[$key] = zenkaku2hankaku($value);
	}
}
//変数化
$post = $_POST;
//クリティカルなエラーメッセージ格納用
$errmsg = '';
//送信元URLの設定
$url = $_SERVER["REQUEST_URI"];
//----------------------------------------------------------------------------------------------------------------------------------------------
/*
//		必須設定項目
//		↓↓↓↓↓↓↓↓↓↓↓
*/
//----------------------------------------------------------------------------------------------------------------------------------------------
//GLOBAL 変数用設定
$top_page = 'https://office-kagent.com';																			//トップページURL（送信完了後リンク先）
$title_arr = ['name'=>'氏名','mail'=>'メールアドレス','phone'=>'電話番号','tag'=>'件名','contents'=>'お問い合わせ内容'];	//項目・項目名セット
$req_items = ['name'=>'req','mail'=>'req','phone'=>'req','tag'=>'req','contents'=>'req'];							//必須項目設定（reqは必須、''は任意
$err_message = resetItems($req_items);																				//エラーメッセージ用（！編集非推奨！）
// text => 記号禁止、mail => メールアドレス形式チェック、tel =>　電話番号形式チェック 
$val_items = ['name'=>'text','mail'=>'mail','phone'=>'tel','tag'=>'text','contents'=>'text'];						//validate方法選択
$hankaku_array = array('phone','mail');																				//半角化に変換処理を行う、POSTデータ（各nameを記述）
//メール設定
$to_mail = 'msts0716@outlook.jp';										//送信先（管理者宛）メールアドレス(to)
$err_mail = $to_mail;														//エラーログ・不正パラメータ送信用メールアドレス（デフォルトでは送信先メールアドレスと同じ
$subject = "ホームページからのお問い合わせ";										//件名（管理者受信メール）
//リファラチェック用
$referUrl = 'excitingworks.jp';
$referCheck = 1;
//----------------------------------------------------------------------------------------------------------------------------------------------
/*
//		↑↑↑↑↑↑↑↑↑↑↑
//		必須設定項目
*/
//----------------------------------------------------------------------------------------------------------------------------------------------
//画面遷移経路図（入力・再入力画面：initHtml、確認画面：verifyHtml、完了画面：finishHtml、（入力画面が別ページである場合、入力内容エラー画面：errorHtml()にinitHtml()を変更）
if(isset($post['submit'])){
	//isset(変数or配列):()が存在する⇒true,ない⇒falseで返す
	if($referCheck==1){
		if(!$comm ->referChk($referUrl)) { initHtml($comm,$post); exit; };
	}

	if(isset($post['back'])) { header('Location:https://office-kagent.com'); exit; }
	if(isset($post['send']) && !empty($post['token'] && isset($post['token']))){
		if(validate($comm)) {
			finishHtml($comm); //完了画面
		} else {
			$GLOBALS['errmsg'] = '送信項目に不正値が検出されました。ご確認ください。';
			errorSendMail($comm, $GLOBALS['errmsg']);
			header('Location:https://office-kagent.com');
		}
		exit();  // 処理終了  
	}else{
		(validate($comm)) ? verifyHtml($comm) : header('Location:https://office-kagent.com');
		exit();
	}
}else{
	//errorHtml(); //initHtml($comm)を入力画面として利用しない場合使用
	//initHtml($comm);
	header('Location:https://office-kagent.com');
	exit();
}
//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
//MAIL FORMAT 設定
//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
//送信内容セット
function bodySet($comm){
	global $encode;
	$adminBody= "URL (" . $_SERVER['HTTP_REFERER'] . ")からお問い合わせ<br>";
	$adminBody .="＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br>";
	$adminBody.= postToMail($comm) . "<br>";//POSTデータを関数からセット
	$adminBody.="<br>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝<br>";
	$adminBody.="送信日時：".date( "Y/m/d (D) H:i:s", time() )."<br>";
	$adminBody.="送信者のIPアドレス：".@$_SERVER["REMOTE_ADDR"]."<br>";
	$adminBody.="送信者のホスト名：".getHostByAddr(getenv('REMOTE_ADDR'))."<br>";
	$adminBody.="問い合わせのページURL：".@$_SERVER['HTTP_REFERER']."<br>";
	return mb_convert_encoding($adminBody,"UTF-8",$encode);
}
//POSTデータ整形
function postToMail($comm){
	global $hankaku, $hankaku_array, $title_arr, $post;
	$resArray = '';
	foreach($title_arr as $key => $val) {
		$message = $post[$key];
		if(get_magic_quotes_gpc()) { $message = stripslashes($message); }
		//各項目の送信メッセージ格納
		if($key=='contents'){
			$message = str_replace(array("\r\n", "\r", "\n"), '<br>', $message);
			$resArray .= "【 " . $comm -> h($val) ." 】 " . $message . "<br>";	
		}else{
			$resArray .= "【 " . $comm -> h($val) ." 】 " . $comm -> h($message) . "<br>";	
		}
	}
	return $resArray;
}
//通常メール送信
function sendMail($comm){
	global $subject, $encode, $post, $bcc_mail;
	//宛先（受信先）、送信先セット
	$to = $GLOBALS['to_mail'];
	$from_name = $comm -> h($post['name']);
	$encodedFrom = mb_convert_encoding($from_name, 'UTF-8', 'AUTO');
	$fromMail = $comm -> h($post['mail']);
 	if($bcc_mail!='') $bccMail = 'y_kondo@office-kagent.com';
 	//内容セット（HTMLメール形式）
 	$message = bodySet($comm);
	$message = "<html><body>". $message ."</body></html>";
	$headers = "From: " . mb_encode_mimeheader($encodedFrom) . "<" . $fromMail . ">";
	$headers .= "\n";
	if($bcc_mail!=''){	
		$headers .="Bcc: " . $bccMail;
		$headers .= "\n";
	}
	$headers .= "Content-type: text/html; charset=UTF-8";
	return mail($to, $subject, $message, $headers);
}
//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
//全角→半角変換
function zenkaku2hankaku($val){
	global $encode,$hankaku_array;
	$out = $val;
	if(is_array($hankaku_array) && function_exists('mb_convert_kana')){
		foreach($hankaku_array as $hankaku_array_val){
			if($key == $hankaku_array_val) $out = mb_convert_kana($out,'a',$encode);
		}
	}
	return $out;
}
//エラーログメール送信
function errorSendMail($comm,$message){
	$err_mail = $GLOBALS['err_mail'];
	$message .= '送信履歴：' . "\n";
	$message .= 'アクセスIP：'. $_SERVER["REMOTE_ADDR"] ."\n";
	$message .= "アクセスホスト名：".getHostByAddr(getenv('REMOTE_ADDR'))."\n";
	$adminBody.="アクセス元URL：".@$_SERVER['HTTP_REFERER']."\n";
	$comm -> errorMail($message, $err_mail);
	return true;
}
//+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-
//----------------------------------------------------------------------------------------------------------------------------------------------
//
//		以下表示用HTML 設定部（入力画面「initHtml」、確認画面「verifyHtml」、完了画面、ヘッダー部分、フッター部分
//
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
//入力画面 HTML　body内のみ記述
//----------------------------------------------------------------------------------------------------------------------------------------------
function initHtml($comm, $post=null){
global $url, $errmsg;
if($post==null || !isset($post['token'])){
	$token = $comm -> genToken();
}else{
	$token = $post['token'];
}
$token = $comm -> h($token);
//エラーメッセージセット
$errArr = $GLOBALS['err_message'];
//HEAD読込
commmonHead();
?>
<body>
	<p class="heading">入力画面</p>
	<div class="form">
		<p class="alert"><?php echo $comm -> h($errmsg); ?></p>
		<form action="<?php echo $url ?>" method="post" autocomplete="off">
			<div class="name_div">氏名<span class="req">（必須）</span><span class="err_msg"><?php echo $errArr['name']; ?></span></div>
			<div><input type="text" name="name" id="name" placeholder="(必須) 株式会社ＫＡｇｅｎｔ" maxlength="30" value="<?php if(isset($post['name'])) echo $comm -> h($post['name']); ?>" required></div>
			<div class="mail_div">メールアドレス<span class="req">（必須）</span><span class="err_msg"><?php echo $errArr['mail']; ?></span></div>
			<div><input type="mail" name="mail" id="mail" placeholder="(必須) sample@mail.com" maxlength="255" value="<?php if(isset($post['mail'])) echo $comm -> h($post['mail']); ?>" required></div>
			<div class="tel_div">電話<span class="req">（必須）</span><span class="err_msg"><?php echo $errArr['tel']; ?></span></div>
			<div><input type="tel" name="tel" id="tel" placeholder="(必須) 01234567890" maxlength="12" value="<?php if(isset($post['tel'])) echo $comm -> h($post['tel']); ?>" required></div>
			<div class="subject_div">件名<span class="req">（必須）</span><span class="err_msg"><?php echo $errArr['subject']; ?></span></div>
			<div><input type="text" name="subject" id="subject" placeholder="(必須) 見積依頼" maxlength="100" value="<?php if(isset($post['subject'])) echo $comm -> h($post['subject']); ?>" required></div>
			<div class="contents_div">お問い合わせ内容<span class="req">（必須）</span><span class="err_msg"><?php echo $errArr['contents']; ?></span></div>
			<textarea maxlength="255" name="contents" id="contents" placeholder="(必須) お問い合わせ内容&#13;&#10;問い合わせ"><?php if(isset($post['contents'])) echo $comm -> h($post['contents']); ?></textarea>
			<div class="submit_btn">
				<input type="submit" name="submit" value="submit" id="submit" disabled><label for="submit">確認画面へ</label>
			</div>
			<input type="hidden" name="token" value="<?php echo $token; ?>">
			<input type="hidden" name="verify" value="0">
			<!-- <a href="javascript:history.back();" style="">BACK</a> -->
		</form>
	</div>
</body>
	<?php
closeHTML();	
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここまで入力画面
//----------------------------------------------------------------------------------------------------------------------------------------------
//確認画面 HTML
//----------------------------------------------------------------------------------------------------------------------------------------------
function verifyHtml($comm, $err_message=null){
global $url, $errmsg;
$post = $_POST;
$itemArr = $GLOBALS['title_arr'];
$token = isset($_POST['token']) ? $_POST['token'] : null;
//トークンチェック
if($comm -> chkToken($token)){
	$token = $comm -> h($token);
}else{
	initHtml($comm);
	exit();
}
commmonHead();
?>
<body>
	<div class="form">
		<p class="heading">確認画面</p>
<?php
if($errmsg!='') {
	echo '<p>' . $comm -> h($errmsg) . '</p>';
} 
foreach ($itemArr as $key => $value) {
?>		
		<div class="table">
			<div class="titleCell"><?php echo $value; ?></div>
			<div class="paramCell"><?php echo nl2br($comm->h($post[$key])); ?></div>
		</div>
<?php
}
?>
<div class="btn_table">
<!-- 再入力 -->
		<form action="<?php echo $url ?>" method="post" autocomplete="off">
<?php
foreach ($post as $key => $value) {
?>
		<input type="hidden" name="<?php echo $key; ?>" value="<?php echo $value; ?>">
<?php
}
?>
		<input type="submit" name="back" value="back" id="back"><label for="back">戻る</label>
		</form>
<!-- 再入力 -->
<!-- 送信 -->
		<form action="<?php echo $url ?>" method="post">
<?php
foreach ($post as $key => $value) {
?>
		<input type="hidden" name="<?php echo $key; ?>" value="<?php echo $value; ?>">
<?php
}
?>
		<input type="submit" name="send" value="send" id="send"><label for="send">送信する</label>
		</form>
<!-- .送信 -->

</div>
	</div>
</body>
<?php
closeHTML();
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここまで確認画面
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここから完了画面
//----------------------------------------------------------------------------------------------------------------------------------------------
function finishHtml($comm, $err_message=null){
//トークン設定
$token = isset($_POST['token']) ? $_POST['token'] : null;
if($token==null) { 
	initHtml($comm);
	exit();
}
//トークンチェック(二重送信防止用)
if($comm -> chkToken($token)){
	$token = $comm -> h($token);
}else{
	initHtml($comm);
	exit();
}
//送信
if(!sendMail($comm)) {
	exit('<p>通信障害が発生いたしました。時間を少しあけてから再度実行してください。</p><p>改善されない場合、直接メールでお問い合わせいただきますようお願いいたします。</p><a href="mailto:'.$to_mail.'">管理メールリンク</a>');
}
//リセット
completeMail();

//以下HTML部
commmonHead();
$top_page = $GLOBALS['top_page'];
?>
<body>
	<div class="form">
		<p class="heading">完了画面</p>
		<p>送信完了しました。</p>
		<a href="<?php echo $top_page ?>">TOPページへ戻る</a>
	</div>
</body>
<?php
closeHTML();
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここまで完了画面
//----------------------------------------------------------------------------------------------------------------------------------------------
//
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここから入力エラー画面
//----------------------------------------------------------------------------------------------------------------------------------------------
function errorHtml(){
	global $top_page, $title_arr, $hankaku_array, $req_items, $errmsg;	//入力項目名配列、半角のみ対象配列、必須入力項目配列
	//以下HTML部
	commmonHead();
	?>
	<body>
		<div class="form">
			<p class="heading">入力内容エラー</p>
			<p><?php if($errmsg!=''){echo '入力内容に不備があります。'; }else{ echo $errmsg; } ?></p>
			<p>下記項目は必須入力項目です。</p>
<p class="errmsg">「
<?php
	$cnt = 0;
	foreach ($req_items as $key => $val) {
		$cnt++;
		foreach ($title_arr as $k => $v) {
			if($key==$k){
				$reqItemName = ($cnt == count($req_items)) ? $title_arr[$key] : $title_arr[$key] . '・';
				echo $reqItemName;	
			}
		}
	}
?>
」</p>

<p>また、下記項目は半角のみです。</p>
<p class="errmsg">「
<?php
	$cnt = 0;
	foreach ($hankaku_array as $key => $val) {
		$cnt++;
		foreach ($title_arr as $k => $v) {
			if($val==$k){
				$reqItemName = ($cnt==count($hankaku_array)) ? $title_arr[$val] : $title_arr[$val] . '・';
				echo $reqItemName;
				
			}
		}
		
	}
?>
」</p>
			<div class="errorPage">
				<a href="<?php echo $top_page ?>" class="topPage">TOPページへ戻る</a>
				<a href="javascript:history.back();">前のページへ戻る</a>
			</div>
		</div>
	</body>
	<?php
	closeHTML();
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//ここまで入力エラー画面
//----------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------------------------------------------------------------------------------------------------------------------
// HEAD 部　共通
//----------------------------------------------------------------------------------------------------------------------------------------------
function commmonHead(){
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="Pragma" content="no-cache" />
	<meta http-equiv="cache-control" content="no-cache" />
	<meta http-equiv="expires" content="0" />
	<title>問い合わせフォーム</title>
	<!-- COMMON JS -->
	<script type="text/javascript" src="./js/jquery-3.4.1.min.js"></script>
	<script type="text/javascript" src="./js/validate.js"></script>
	<!-- CSS -->
	<link rel="stylesheet" type="text/css" href="./css/form.css">
</head>
	<?php
}

//----------------------------------------------------------------------------------------------------------------------------------------------
// FOOT 部　共通
//----------------------------------------------------------------------------------------------------------------------------------------------
function closeHTML(){
?>
</html>
<?php
}
//----------------------------------------------------------------------------------------------------------------------------------------------
// FOOT 部　ここまで
//----------------------------------------------------------------------------------------------------------------------------------------------

//----------------------------------------------------------------------------------------------------------------------------------------------
//
//		以下関数設定（編集任意）
//
//----------------------------------------------------------------------------------------------------------------------------------------------
//メインバリデーション関数
function validate($comm){
	require_once dirname(__FILE__) . '/php/validate.php';
	$valid = new validate();
	//必須チェック
	if(!nullChk($comm, $valid)) return false;
	//各送信データフォーマットチェック
	if(!formatChk($comm, $valid)) return false;
	return true;

}
//POST, SESSIONパラメータの除去
function completeMail(){
	$_POST = '';
	// セッションに保存しておいたトークンの削除
	unset($_SESSION['TOKENID']);
	// セッションの保存
	session_write_close();
}
//エラーメッセージ用リセット関数
function resetItems($arr){
	foreach ($arr as $key => $value) {
		$arr[$key] = '';
	}
	return $arr;
}
//NULLチェック
function nullChk($comm, $valid){
	$post = $_POST;
	global $errmsg;
	$reqItems = $GLOBALS['req_items'];
	$titleArr = $GLOBALS['title_arr'];
	$valArr = $GLOBALS['val_items'];

	$errCnt = 0;
	foreach ($reqItems as $key => $value) {
		if($value='req'){
			//パラメータ設定確認
			if(!isset($post[$key])){
				$errmsg = '必須入力項目パラメータの値に不正値があります。ご確認ください。';
				if(!errorSendMail($comm, 'js操作の疑い有')) exit('<p>通信に障害が発生した可能性があります。少し時間を空けたのち再度問い合わせのほどよろしくお願いいたします。</p>');
				return false;
			}
			//NULL チェック　エラーメッセージセット
			if(!$valid -> nullChk($post[$key])){
				$errCnt++;
				$GLOBALS['err_message'][$key] = $titleArr[$key] . 'は必須項目です。';
			}
			if($errCnt>0) return false;
		}
		//必須項目以外は NULL CHECK なし
	}
	return true;
}
//形式チェック
function formatChk($comm, $valid){
	global $req_items, $val_items, $title_arr;
	$post = $_POST;

	foreach ($post as $key => $value) {
		$chk = 0;
		foreach ($val_items as $k => $v) {
			if(($key==$k) && isset($post[$k])){
				$chk = $chk + 1;
				if(!paramCheck($value, $v, $valid)) return false;
			}
		}
		if($chk!=1){
			if(!paramCheck($value, 'text', $valid)) return false;
		}
	}
	return true;
}
//パラメータ仕分
function paramCheck($val, $type, $valid){
	if($type=='text')	return $valid -> chkSymbol($val);
	if($type=='tel')	return $valid -> chkTel($val);
	if($type=='mail')	return $valid -> chkMail($val);
	return false;
}
//サニタイズ処理
function sanitize($arr){
	if(is_array($arr)){
		return array_map('sanitize',$arr);
	}
	return str_replace("\0","",$arr);
}
//----------------------------------------------------------------------------------------------------------------------------------------------
//
//		関数設定部　ここまで
//
//----------------------------------------------------------------------------------------------------------------------------------------------
?>