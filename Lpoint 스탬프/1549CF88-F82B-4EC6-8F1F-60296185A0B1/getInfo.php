
<?php
	/**
     * TODO
     * 랜딩 페이지에서 사용하는 게임 정보
     *
     * 1.3 (2018-12-17)
     *     - 로그를 통한 보다 많은 정보 조회가 가능하도록 수정
     *
     * 1.2 (2018-12-14)
     *     - stamp 5개를 모은 사용자 정보 별도의 테이블에 저장
     *
     * 1.1
     *     - localhost 에서 referer 가져오기 예외처리
     *     - 결과 코드 정리
     *
     * 1.0 (base 1.3)
     *     - 최초 등록
     */
    // 에러 처리 - 개발기에서만 적용
    $rRef;
    $domain = $_SERVER['HTTP_HOST'];
    if ($domain != 'www.doit5.com' && $domain != 'doit5.com' &&
        $domain != 'doit5.lpoint.com' && $domain != 'localhost:8888') {
        error_reporting(E_ALL);
        ini_set('display_errors', 1);
    }
    else {
    	$rRef = $_SERVER['HTTP_REFERER'];
    }


    /*************************************************************************
     * 공통 항목
     *************************************************************************/

    // TODO - 로그가 남겨지는 경로 지정
    $logPath = '/home/doit5/log/LPoint/ZZ38/';

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
        $homePath = 'C:/git/Doit5_Server/www';
        $logPath = 'C:/git/Doit5_Server/log/';
    }


    // 기본 로딩 항목들 처리
    include_once $homePath.'/doit5_include_new/Database2.php';
    include_once $homePath.'/doit5_include_new/jandi.php';
    include_once $homePath.'/doit5_include_new/Security.php';
    include_once $homePath.'/doit5_include_new/util.php';

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



    /*************************************************************************
     * TODO
     * !! php 에서 post 데이터를 읽기 위해 클라이언트에서
     * Content-Type: application/x-www-form-urlencoded 으로 설정해서 발송해야함. 또한 urlencoding 처리도 필요.
     * 해당 내용이 적용되어 있지 않다면 post 데이터를 읽지 못함
     *************************************************************************/
    $user_key       = urlencode($_REQUEST['user_id']);
    $p1             = urlencode($_REQUEST['p1']);
    $webhookUrl     = 'https://wh.jandi.com/connect-api/webhook/15819801/f9b1ab1f0c6f197e8ecbb5c127478b64';
    $game_code      = 'ZZ38';
    $table     		= 'tbl_LPoint_'.$game_code.'_event';
    $stampTable     = 'tbl_LPoint_'.$game_code.'_stamp';
    $expDate        = new DateTime('2019-01-17 23:59:59');
    // $expDate        = new DateTime('2018-12-10 23:59:59');
    $isExpire       = false;


    // client 결과 전달값
    // stamp :가장 작은 포인트부터 표시.
    //          e - 비어있음, n - 신규
    // code : 0 - 정상, 99 - 이벤트 종료, 98 - 유저키 문제, 97 - 'uid 가 다름' 등 잘못된 요청
    $finResult = array(
        'user_key' => $user_key,
        'stamp' => array(),
        'code' => 0
    );

    $filev          = '8';

    $log->info2(__LINE__, '->[In ] ['.$filev.'] uk['.$user_key.'] p1['.$p1.']');


    // 이벤트 종료 시
    $chkDate = new DateTime();
    $diff = $chkDate->diff($expDate);
    if ($diff->invert == 1) {
        $log->info2(__LINE__, '  [   ] uk['.$user_key.'] today['.$chkDate->format('Y-m-d H:i:s').'] event end['.$expDate->format('Y-m-d H:i:s').']');
        $isExpire = true;
    }



    // DB - 로그 이후에 추가. 에러 발생시 로그까지 동작하는거 확인하기 위해
    $db             = new Database2('rdb1');
    $security       = new Security();
    $em;
    if ($isExpire == false && $security->available($user_key) && $security->available($p1)) {
        $data = decodeP1(urldecode($p1));
        $em = array_reverse(explode(',', $data));
        $p1_uid = array_pop($em);

        $log->info2(__LINE__, '  [   ] uk['.$user_key.'] decode data['.$data.']');
        $log->info2(__LINE__, '  [   ] uk['.$user_key.'] pid['.$p1_uid.'] ');

        // 정상적일 경우
        if ($user_key == $p1_uid && count($em) == 5) {
            $remaining = 0;
            for ($i = 0; $i < count($em); $i++) {
                // $log->info2(__LINE__, '  [   ] uk['.$user_key.'] em['.$em[$i].'] remaining['.$remaining.']');
                if ($em[$i] + $remaining >= 1) {
                    $remaining = $em[$i] + $remaining - 1;
                    $em[$i] = 1;
                }
            }
            $em = array_reverse($em);
            $log->info2(__LINE__, '  [   ] uk['.$user_key.'] after em['.implode($em, ',').']');
        }
        // uid 와 5개의 스탬프 값이 들어오지 않으면 에러로 처리
        else {
            $log->info2(__LINE__, '  [   ] uk['.$user_key.'] is not matched ['.$p1_uid.'] stamp['.implode($em, ',').']');
            $finResult['code'] = 97;
        }

        saveEvent($table, $user_key, $p1, $p1_uid, implode($em, ','));

        // 스탬프가 5개 기록된 사용자
        if (implode($em, ',') == '1,1,1,1,1') {
            $log->info2(__LINE__, '  [   ] uk['.$user_key.'] success stamp -->');
            saveStamp($stampTable, $user_key);
        }
    }
    else if ($isExpire == true) {
        $log->info2(__LINE__, '[ERROR] uk['.$user_key.'] event end....');
        $finResult['code'] = 99;
    }
    else {
    	$log->info2(__LINE__, '[ERROR] uk['.$user_key.']');
        clientFootprint('user key not found...');
        $finResult['code'] = 98;
    }


    // 스탬프 코드 처리
    if ($em != null) {
        for ($i = 0; $i < count($em); $i++) {
            array_push($finResult['stamp'], $em[$i] == 0 ? 'e' : 'n');
        }
    }

    echo json_encode($finResult);
    $log->info2(__LINE__, '<-[Out] uk['.$user_key.'] code['.$finResult['code'].'] stamp['.implode($finResult['stamp'], ',').']');
    exit();


    /*************************************************************************
     * 함수
     *************************************************************************/

    /**
     * L.Point 에서 전달한 P1 값 복호화
     * 포인트 별 선물 카운트(2,000P~30,000P순서대로 ‘,’ 콤마로 구분하여 전달) ex) 0,10,3,2,0
     *
     * @param
     * @return
     */
    function decodeP1($data)
    {
        $password   = 'c85eabc7c42803b0';
        $method     = 'aes-128-cbc';
        $iv         = chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0) . chr(0x0);
        return openssl_decrypt(urldecode($data), $method, $password, OPENSSL_ZERO_PADDING, $iv);
    }

    /**
     * 최고 점수 및 랭킹 정보 가져오기
     *
     *
     * @param
     * @return
     */
    function saveEvent($table, $user_key, $p1, $p1_uid, $em)
    {
    	$log 		= $GLOBALS['log'];
        $db 		= $GLOBALS['db'];
        $webhookUrl = $GLOBALS['webhookUrl'];
        $game_code  = $GLOBALS['game_code'];

        $sTime = getCurTime();
        $q = "INSERT INTO $table (user_key, p1, decode_uk, decode_stamp, created_at)
              VALUES ('$user_key', '$p1', '$p1_uid', '$em', NOW())";
        if ($db->simple_query2($q)) {
            $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [saveEvent::] INSERT event table ['.(getCurTime()-$sTime).']');
        }
        else {
            $log->info2(__LINE__, '  [DB ] [saveEvent::] INSERT FAIL ['.$q.'] ['.(getCurTime()-$sTime).']');
            jandi_sendMsg($log, $webhookUrl, $_SERVER['PHP_SELF'], '['.$game_code.'] DB - Event INSERT FAIL', '');
        }
    }

    function saveStamp($stampTable, $user_key)
    {
        $log        = $GLOBALS['log'];
        $db         = $GLOBALS['db'];
        $webhookUrl = $GLOBALS['webhookUrl'];
        $game_code  = $GLOBALS['game_code'];

        // 등록되어 있는지 확인
        $sTime = getCurTime();
        $q = "SELECT user_key, created_at
              FROM $stampTable
              WHERE user_key = '$user_key'";
        $result = $db->query2($q, null);
        $row = $result->fetch_assoc();
        $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [saveStamp::] SELECT row['.$result->num_rows.'] ['.(getCurTime()-$sTime).']');

        // 등록되어 있지 않다면 DB 에 추가
        if ($result->num_rows == 0) {
            $sTime = getCurTime();
            $q = "INSERT INTO $stampTable (user_key, created_at)
                  VALUES ('$user_key', NOW())";
            if ($db->simple_query2($q)) {
                $log->info2(__LINE__, '  [DB ] uk['.$user_key.'] [saveStamp::] INSERT stamp table ['.(getCurTime()-$sTime).']');
            }
            else {
                $log->info2(__LINE__, '  [DB ] [saveStamp::] INSERT FAIL ['.$q.'] ['.(getCurTime()-$sTime).']');
                jandi_sendMsg($log, $webhookUrl, $_SERVER['PHP_SELF'], '['.$game_code.'] DB - Event INSERT FAIL', '');
            }
        }
        else {
            $log->info2(__LINE__, '  [   ] uk['.$user_key.'] [saveStamp::] already user info ');
        }
    }


    /**
     * 에러 메시지. 접속 정보를 출력
     *
     * @param   $msg - 메시지
     * @return  반환 결과 없음
     */
    function clientFootprint($msg)
    {
        $log        = $GLOBALS['log'];
        $user_key   = $GLOBALS['user_key'];

        $rIP        = $_SERVER['REMOTE_ADDR'];        // 접속 IP
        $rUA        = $_SERVER['HTTP_USER_AGENT'];    // 접속 UA
        $rRef       = $_SERVER['HTTP_REFERER'];       // 이전 페이지 주소값

        $log->info2(__LINE__, '[WRONG] uk['.$user_key.'] IP['.$rIP.'] UA['.$rUA.'] REF['.$rRef.'] - '.$msg);
    }
?>