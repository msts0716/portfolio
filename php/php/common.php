<?php

class chkCommon{
	function __construct(){
	    ini_set('display_errors', 1);
	   	error_reporting(E_ALL);
	   	$expires = 86400;	// キャッシュ時間 60*60*24 ->  1 day
	   	header('Cache-Control: no-store, no-cache, must-revalidate');
	   	header('Cache-Control: post-check=0, pre-check=0', FALSE);
	   	header('Pragma: no-cache');
	   	header('Expires: ' . gmdate('D, d M Y H:i:s T', time() + $expires));
	   	header('Last-Modified: '. gmdate('D, d M Y H:i:s T', time() + $expires) .' GMT');
	}
	public function sessionChk(){
		$session = $_SESSION;
	}
	//リファラチェック
	public function referChk($target_url){
		$refer = $_SERVER["HTTP_REFERER"];
		$url = parse_url($refer);
		$host = $url['host'];
		return ($target_url==$host) ? true : false;
	}
	//TOKEN 生成
	public function genToken(){
		$str = '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPUQRSTUVWXYZ';
		$csrf_token = substr(str_shuffle($str), 0, 15);
		$_SESSION['TOKENID'] = $csrf_token;
		return $csrf_token;
	}
	//TOKEN 除去
	public function delToken(){
		$_SESSION['TOKENID'] = '';
		$csrf_token = '';
		return $csrf_token;
	}
	//GET TOKEN 
	public function chkToken($token){
		if(!isset($_SESSION['TOKENID'])) return false;
		if($token==null) return false;
		if($_SESSION['TOKENID']==$token) return true;
		return false;
	}
	//htmlspecialchars
	public function h($str){
		return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
	}
	//ERROR MAIL
	public function errorMail($message,$mail){
		$now = date('Y/m/d H:i:s');
		$ip = $_SERVER['REMOTE_ADDR'];
		error_log('[ TIME:' . $now . ', IP:'. $ip . ' ] '. $message . ";\n", 1, $mail);	//1:メール　で出力
	}
	//SJIS 変換処理
	public function sjisReplace($arr,$encode){
		foreach($arr as $key => $val){
			$key = str_replace('＼','ー',$key);
			$resArray[$key] = $val;
		}
		return $resArray;
	}
}

?>