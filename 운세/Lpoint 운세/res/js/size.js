
var loadir = true;



$(document).ready(function(){

	if(typeof mbf_TransparentTitle !== "undefined"){
       mbf_TransparentTitle("", "white");     //투명 헤더 세팅
	}

	var w = $(window).width();
	var h = $(window).height();
	size(w,h);
})

$(window).resize(function(){
	var w = $(window).width();
	var h = $(window).height();
	size(w,h);
})

function size(wi,hi){

	

	var ratio = wi / hi;
	var total = 
	( Math.abs( ratio - 9 / 16 ) < Math.abs( ratio - 9 / 19 ) ) ? '9:16' : '9:19';

	if(total == '9:19' && $(window).width()  < 720){
	}
	else {
		total = (Math.abs(ratio- 9/16)<Math.abs(ratio-3/4)) ? '9:16' : '3:4';
		if(total == '9:16' && $(window).width() < 720 && $(window).width() > 500 ) {
		}
	}
	if(loadir){
		load_img();
		loadir = false;
	}
		
}