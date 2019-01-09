<?php

	/**
     * 게임 결과 저장
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
    $user_key       = urlencode($_REQUEST['user_key']);
    $user_score     = urlencode($_REQUEST['user_score']);
    $game_code      = 'ZZ37';
    $eventTable     = 'tbl_CJEM_'.$game_code.'_event';
    $rankTable      = 'tbl_CJEM_'.$game_code.'_rank';
    $rRef           = $_SERVER['HTTP_REFERER'];       // 이전 페이지 주소값
    $rIP        	= $_SERVER['REMOTE_ADDR'];        // 접속 IP
    $filev          = '1';


    $log->info2(__LINE__, '->[In ] ['.$filev.'] uk['.$user_key.'] score['.$user_score.'] IP['.$rIP.']');

    // DB - 로그 이후에 추가. 에러 발생시 로그까지 동작하는거 확인하기 위해
    $db = new Database2('rdb1');
    $security = new Security();


    // TODO
    if ($security->available($user_key)) {
    	saveScore($eventTable, $user_key, $user_score);
    	updateRank($rankTable, $user_key, $user_score);
    }
    // 비정상적인 입력 데이터
    else {
        $log->info2(__LINE__, '[ERROR] uk['.$user_key.']');
        wrongLog('user key not found...');
    }

    $FinResult = array(
        'code' => 0,
        'result' => 0
    );
    echo json_encode($FinResult, JSON_UNESCAPED_UNICODE);
    // 최종 결과 로깅
    $log->info2(__LINE__, '<-[Out] [uk]['.$user_key.']');
    exit();



    /*************************************************************************
     * 함수
     *************************************************************************/

    /**
     * 보내온 점수를 저장한다.
     *
     * @param   $msg - 메시지
     * @return  반환 결과 없음
     */
    function saveScore($eventTable, $user_key, $user_score)
    {
    	$log        = $GLOBALS['log'];
        $db         = $GLOBALS['db'];

        $rIP        = $_SERVER['REMOTE_ADDR'];        // 접속 IP
	    $rUA        = $_SERVER['HTTP_USER_AGENT'];    // 접속 UA
	    $rRef       = $_SERVER['HTTP_REFERER'];       // 이전 페이지 주소값

        $q = "INSERT INTO $eventTable (user_key, user_score, created_at, referer, ua, ip)
              VALUES ('$user_key', $user_score, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'), '$rRef', '$rUA', '$rIP')";
        $rst = $db->simple_query2($q, null);
        if ($rst == false) {
            _jandi('DB - Event INSERT FAIL', gethostname());
            $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [saveScore::] INSERT FAIL ['.$q.']');
        }
        $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [saveScore::] INSERT table rst['.($rst==true?'TRUE':'FALSE').'] score['.$user_score.']');
    }


    /**
     * 보내온 점수를 저장한다.
     *
     * @param   $msg - 메시지
     * @return  반환 결과 없음
     */
    function updateRank($rankTable, $user_key, $user_score)
    {
    	$log        = $GLOBALS['log'];
        $db         = $GLOBALS['db'];

        // 기존에 등록된 점수가 있는지 확인
        $q = "SELECT IFNULL(MAX(user_score), -9999) AS user_score
              FROM $rankTable";
        $result = $db->query2($q, null);
        $row = $result->fetch_assoc();
        $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [updateRank::] SELECT row['.$result->num_rows.'] DB_score['.$row['user_score'].'] Input_score['.$user_score.']');

        // 기록된 내용이 없다면 insert
        if ($row['user_score'] == -9999) {
        	$q = "INSERT INTO $rankTable (user_key, user_score, updated_at)
	              VALUES ('$user_key', $user_score, DATE_FORMAT(NOW(), '%Y%m%d%H%i%s'))";
	        $rst = $db->simple_query2($q, null);
	        if ($rst == false) {
	            _jandi('DB - RankTable INSERT FAIL', gethostname());
	            $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [updateRank::] INSERT FAIL ['.$q.']');
	        }
	        $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [updateRank::] INSERT table rst['.($rst==true?'TRUE':'FALSE').'] score['.$user_score.']');
        }
        // 기록된 내용이 있고 현 점수와 최고점수를 비교하여 높다면 갱신
        else {
        	if ($user_score > $row['user_score']) {
        		$q = "UPDATE $rankTable
	                  SET user_score = $user_score, updated_at = DATE_FORMAT(NOW(), '%Y%m%d%H%i%s')";
	            $rst = $db->simple_query2($q, null);
	            if ($rst == false) {
	                _jandi('DB - RankTable UPDATE FAIL', gethostname());
	                $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [updateRank::] UPDATE FAIL ['.$q.']');
	            }
	            $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [updateRank::] UPDATE ranking table rst['.($rst==true?'TRUE':'FALSE').'] score['.$user_score.']');
        	}
        }
    }



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

        $url        = 'https://wh.jandi.com/connect-api/webhook/15819801/a0373d0db1927ba53036cea95c6fe438';
        jandi_sendMsg($log, 'URL', '['.$code.'] '.$_SERVER['PHP_SELF'], $title, $msg);
    }

?>