var first_url = '/hvm/event/LPoint/ZZ38/1549CF88-F82B-4EC6-8F1F-60296185A0B1/';
var array1;
var new_count = 0;
var sp_snd = new Howl({src: ['res/snd/sp.mp3'],});

var img = ['1', '2', '2', '2', '2', '3'];
var txt = ['0', '1', '2', '3', '4', '5'];

var y = ['10%', '10%', '36.5%', '36.5%', '36.5%'];
var x = ['left:23%', 'right:22.5%', 'left:7.5%', 'left:38.5%', 'right:7.5%'];

(function(ck) {
	eval(" if(ck){ setInterval(function() {eval('debugger');}, 200)}");
})(false)


// LPoint 투명헤더 및 타이틀 삭제
if (window.mbf_TransparentTitle) {
    window.mbf_TransparentTitle('LPoint 스템프', 'white');
    location.href='lms://title?{"title":"","type":"transparent_white"}';
}


function query_to_hash() {
    var j, q;
    q = window.location.search.replace(/\?/, "").split("&");
    j = {};
    $.each(q, function (i, arr) {
        arr = arr.split('=');
        return j[arr[0]] = arr[1];
    });
    return j;
}

var qString = query_to_hash();
var user_id = ! qString.user_id ? 'abcde' : qString.user_id;
var p1 =  encodeURI(! qString.p1 ? 'UGoyCWNn04TiQ6ZeFaVjDQ==' :  qString.p1);
var code;
var cl = false;
var counts;
var e_code = 0;
// 98 - 잘못된 요청
// 99 - 이벤트 끝
// 0 - 정상



$.getJSON(first_url+'getInfo.php?user_id='+user_id+'&p1='+p1, function(result){
	array1 = result.stamp;

	code = result.code;

	if (code == 99) {
		alert("이벤트 기간 종료");
	}
	else if (code == 98 && code == 97) {
		alert("잘못된 요청");
	}
	else if (code == 0 ) {
		/*eff('nm');
		window.addEventListener("scroll", function(){
			if( $(this).scrollTop() >= ($(".height_box").offset().top * 0.3)  && cl == false ){
				eff()
				cl = true;
			}
		});*/
		eff()
	}
	else if (code == "" ) {
		alert("새로고침")
	}
});


function eff (){
	for (var i = 0; i <= array1.length-1; i++ ) {
		if(array1[i] == 'n' ){
			new_count++;
			view('n',i);
			ch_ch()
		}
	}

	for (var i =0 ; i <= array1.length-1; i++){
		if(array1[i] == 'e'){
			e_code++;
		}
	}

	if(array1.length <= 0 || !array1 || e_code >= 5){
		new_count = 0;
		console.log(new_count)
		ch_ch()
	}
	
}




function ch_ch(){
	$(".sp_count > div ").text(new_count);
	$(".ch").find("img").attr('src','res/images/lpoy_'+img[new_count]+'.png');
	$(".take").find("img").attr('src','res/images/stamp_text_'+txt[new_count]+'.png');

}


function view (eff, idx){
	var delay = 300;

	if (eff === 'n' ) {
		setTimeout(function(){
			tag  = "<img src='res/images/clear.png' class='on' style='top:"+y[idx]+";"+x[idx]+"'>";
			$(".step_wrap").append(tag);
			sp_snd.play();
		},  (new_count) * delay);

	}
}

// L.Point 선물하러 가기 버튼 클릭
$(".btn_wrap").click(function(){
	window.location.href = 'lms://move?{"page":"GIFT", "clearHistory":"true"}';
})

