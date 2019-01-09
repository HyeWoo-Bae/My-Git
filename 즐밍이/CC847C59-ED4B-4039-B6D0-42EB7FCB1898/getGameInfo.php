<?php
	/**
     * 최고 점수 구하기
     *
     * 1.0
     *     - 최초 등록(base 1.2)
     */
    // 에러 처리 - 개발기에서만 적용
    $domain = $_SERVER['HTTP_HOST'];
    if ($domain != 'www.doit5.com' && $domain != 'doit5.com') {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }


    /*************************************************************************
     * 공통 항목
     *************************************************************************/

    // TODO - 로그가 남겨지는 경로 지정
    $logPath = '/home/doit5/log/CJEM/ZZ37/';

    // 공통 항목. 캐쉬 방지
    header('Pragma: no-cache');
    header('Cache-Control: post-check=0, pre-check=0', false);
    header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

    // OS 에 따른 디렉토리 정보 설정
    $homePath = '/home/doit5/www';
    if (strtoupper(PHP_OS) === 'DARWIN') {                  // OSX
        $homePath = '/Users/shindongho/Work/Github/Doit5_Server/www';
        $logPath = '/Users/shindongho/Work/Github/Doit5_Server/log/';
    }
    else if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {  // Window
        $homePath = 'C:/work/github/Doit5_Server/www';
        $logPath = 'C:/work/github/Doit5_Server/log/';
    }


    // 기본 로딩 항목들 처리
    include_once $homePath.'/doit5_include_new/Database2.php';
    include_once $homePath.'/doit5_include_new/jandi.php';
    include_once $homePath.'/doit5_include_new/Security.php';

    // 게임 데이터 암복호화
    include_once $homePath.'/doit5_include_new/aes/aes.class.php';
    include_once $homePath.'/doit5_include_new/aes/aesctr.class.php';

    require $homePath.'/doit5_include_new/vendor/autoload.php';
    use \Monolog\Logger as Logger;
    use \Monolog\Formatter\LineFormatter;
    use \Monolog\Handler\RotatingFileHandler;

    date_default_timezone_set('Asia/Seoul');

    // 로거 채널 생성
    $log = new Logger('');
    $formatter = new LineFormatter(null, null, false, true);
    $rotateHandler = new RotatingFileHandler($logPath.basename($_SERVER['PHP_SELF'], '.php').'.log', Logger::INFO);
    $rotateHandler->setFormatter($formatter);
    $log->pushHandler($rotateHandler);

    // TODO
    // 로그 디렉토리가 없다면 생성. 하위 디렉토리까지 생성
    /*if (!is_dir($logPath)) {
        mkdir($logPath, 0777, true);
    }*/


    /*************************************************************************
     * TODO
     * !! php 에서 post 데이터를 읽기 위해 클라이언트에서
     * Content-Type: application/x-www-form-urlencoded 으로 설정해서 발송해야함. 또한 urlencoding 처리도 필요.
     * 해당 내용이 적용되어 있지 않다면 post 데이터를 읽지 못함
     *************************************************************************/
    $game_code      = 'ZZ37';
    $eventTable     = 'tbl_CJEM_'.$game_code.'_rank';
    $rRef           = $_SERVER['HTTP_REFERER'];       // 이전 페이지 주소값
    $rIP        	= $_SERVER['REMOTE_ADDR'];        // 접속 IP
    $filev          = '1';


    $log->info2(__LINE__, '->[In ] ['.$filev.'] IP['.$rIP.']');


    // DB - 로그 이후에 추가. 에러 발생시 로그까지 동작하는거 확인하기 위해
    $db = new Database2('rdb1');
    $security = new Security();


    $finResult = array(
    	'user_key' => '',
    	'score' => 0,
    	'update' => ''
    );

    // 최고점수 구하기
    $q = "SELECT user_key, user_score, updated_at
    	  FROM tbl_CJEM_ZZ37_rank";
    $result = $db->query2($q, null);
    $row = $result->fetch_assoc();
    $log->info2(__LINE__, '  [DB ] IP['.$rIP.'] SELECT row['.$result->num_rows.'] updated_at['.$row['updated_at'].']');

    if ($result->num_rows != 0) {
        $log->info2(__LINE__, '  [DB ] IP['.$rIP.'] score['.$row['user_score'].']');

    	$finResult['user_key'] = $row['user_key'];
    	$finResult['score'] = $row['user_score'];
    	$finResult['update'] = $row['updated_at'];
    }

    echo json_encode($finResult);
    $log->info2(__LINE__, '<-[Out] IP['.$rIP.']');
    exit();



    /*************************************************************************
     * 함수
     *************************************************************************/

    /**
     * 에러 메시지. 접속 정보를 출력
     *
     * @param   $msg - 메시지
     * @return  반환 결과 없음
     */
    function wrongLog($msg)
    {
        $log        = $GLOBALS['log'];
        $user_key   = $GLOBALS['user_key'];

        $rIP        = $_SERVER['REMOTE_ADDR'];        // 접속 IP
        $rUA        = $_SERVER['HTTP_USER_AGENT'];    // 접속 UA
        $rRef       = $_SERVER['HTTP_REFERER'];       // 이전 페이지 주소값

        $log->info2(__LINE__, '[WRRONG] uk['.$user_key.'] IP['.$rIP.'] UA['.$rUA.'] REF['.$rRef.'] - '.$msg);
    }



    /**
     * jandi 메시지 통보
     * wrongLog 보다 더 큰 문제. 알림 통보가 필요한 내용
     *
     * @param   $title - 메시지 타이틀
     * @param   $msg - 메시지
     * @return  반환 결과 없음
     */
    function _jandi($title, $msg)
    {
        $log        = $GLOBALS['log'];
        $code       = $GLOBALS['game_key'];

        jandi_sendMsg($log, 'URL', '['.$code.'] '.$_SERVER['PHP_SELF'], $title, $msg);
    }


?>