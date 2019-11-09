$(document).ready(function(){

	// TODO - IE 는 사운드 불러오기 안됨
	/*사운드*/
	// window.new_sound = {};
	// var sounds = ['vo1','vo2','vo3','vo4','vo5'];
	// for (var i = 0; i < 5; i++) {
	// 	new_sound[sounds[i]] = new Howl ({
	// 		src : ['res/sound/'+sounds[i]+'.mp3'],
	// 		duration:1
	// 	});
	// }

	var agent = navigator.userAgent.toLowerCase();
	if ( (navigator.appName == 'Netscape' && agent.indexOf('trident') != -1) || (agent.indexOf("msie") != -1)) {
     
	}else{
     	window.new_sound = {};
     	var sounds = ['vo1','vo2','vo3','vo4','vo5'];
     	/*for (var i = 0; i < 5; i++) {
     		new_sound[sounds[i]] = new Howl ({
     			src : ['res/sound/'+sounds[i]+'.mp3'],
     			duration:1	
     		});	
     	}*/	
	}




 /*	var start_sound = new Howl({
    	src: ['res/sound/start.mp3'],
    	duration:1,
    	volume: 0.2,
 	});
*/
 	// image load
 	var tmpImg1 = new Image();
 	tmpImg1.src = 'res/images/cnt-2.png';
 	var tmpImg2 = new Image();
 	tmpImg2.src = 'res/images/cnt-1.png';
 	var tmpImg3 = new Image();
 	tmpImg3.src = 'res/images/sing-start.png';


	var click_count = 0;
	var sns_title = "";
	var ext_url = "http://tvnjoyfest.tving.com/2018/Event/Game";
	var sns_url = "http://www.doit5.com/hvm/event/cjem/ZZ37/game/index.html";
	var sns_image = "http://www.doit5.com/hvm/event/cjem/ZZ37/game/res/images/sh.jpg";
	var sns_desc = "" ;
	var all_sc = 200;
	var game_code = "ZZ37";
	var en = false;

	var transitionEndEvents = "webkitTransitionEnd oTransitionEnd otransitionend transitionend msTransitionEnd"
	/*Kakao.init('0b0b84bb3d388f3ba3de01f077e7c829');*/

	setTing();
	function setTing(){

		

		popup($(".touch_pop"),"open");

		localStorage.setItem(game_code,'on');
		soundsetTing();
	}



	$(".sound_img").bind("mousedown",function(){
		if ($(this).attr("src")=="res/images/sound-off.png") {
		 	localStorage.setItem(game_code,'on');
		}else if ($(this).attr("src")=="res/images/sound-on.png") {
		 	localStorage.setItem(game_code,'off');
		}
		soundsetTing();
	});



	function soundsetTing(){
		if ( localStorage[game_code]=="" || localStorage[game_code] == undefined || localStorage[game_code]=="off" ) {
        	$(".sound_img").attr("src","res/images/sound-off.png");
        	return false;
        }
        else if(localStorage[game_code]=="on") {
        	$(".sound_img").attr("src","res/images/sound-on.png");
        	return true;
        }
	}

	var isMobile = {
        Android: function () {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function () {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function () {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function () {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function () {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function () {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };


	$(".start_btn").bind("mousedown",function(){
		$(".touch_pop").fadeOut(300,function(){
			$(".cound_popup").css({"top":"0%"});
			$(".cound_number").delay(200).queue(function (next) {
				$(".imgs").css({"animation-name":"number_count",
										"-ms-animation-name":"number_count",
								  		"-webkit-animation-name":"number_count"});
				next();
			});
			$(".cound_number").delay(3000).queue(function (next) {
				/*if (start_sound) start_sound.play();*/
			});
			$(".cound_popup").delay(4200).queue(function (next) {
				$(".cound_popup").hide();
				progress($('#progressBar'));
				$(".click_box").show();
				$(".click_eff").show();
			});
		});
	});

	$(".login_pop_header span").bind("mousedown",function(){
		$(".login_pop").fadeOut();
	});


	$(".click_box").bind("mousedown",function(event){
		event_eff();
	}); // 즐밍이 터치

	$(".click_eff").bind("mousedown",function(event){
		event_eff();
	})

	function event_eff(){
		event.preventDefault();
		click_count++;
		if (click_count >= 100) {
			$(".total_sc").css({"font-size":"15px"});
		}
		eff_view($(".eff_click"));
		$(".total_sc").text(click_count);
		shker($(".box_wrap"));
	}

	function eff_view($eff){
		$eff.css({"opacity":"1"});
		$eff.find($(".eff_wrap")).css({"animation-name":"work-loading"});
		$eff.find($(".eff_wrap")).delay(500).queue(function (next) {
			$eff.css({"opacity":"0"})
			$eff.find($(".eff_wrap")).css({"animation-name":""});
			next();
		});
	}

	function shker($obj){
		$obj.css({"animation-name":"shake"});
		var sound_ra = Math.floor(Math.random()*(5-1+1)) + 1;
		/*if(soundsetTing()){
			if (window.new_sound) {
				new_sound["vo"+sound_ra].play();
			}

		} else {
			if (window.new_sound) {
				new_sound["vo"+sound_ra].mute();
			}
		}*/

		$obj.delay(700).queue(function (next) {
    		$obj.css({"animation-name":""});
    		next();
  		});
	} // 즐밍이 터치 효과


	function progress($element) {
		$element.find('div').bind( transitionEndEvents, function(){
			popup($(".end_pop"),"end");
  		});
  		$element.find('div').css('width', '0%');
	}

    $("#sns_kakaotalk").bind("mousedown",function(){
        if(!isMobile.any()) {
            alert("모바일에서만 지원되는 공유 기능입니다.");
        }
    });



	$("#sns_facebook").bind("mousedown",function(){
		FB.ui({
      		method: 'share_open_graph',
        	// action_type: 'og.shares',
        	action_type: 'og.likes',
        	// display: 'dialog',
        	// mobile_iframe: true,
        	action_properties: JSON.stringify({
	            object: {
	            	'description':'즐밍이를 구하려면 클릭!',
                	'title': '[뽑기머신 속 즐밍이를 구하라! 에서 '+click_count+'마리를 구했어요~]',
                	'image': sns_image,
	                'url': ext_url,
	                'image:width': '600',
               		'image:height': '315',
	            }
        	})
    	})
	})

	$("#sns_twitter").bind("mousedown",function(){
    	window.open("http://twitter.com/share?url="+ext_url+"&text="+sns_title);
    });


	function uuidgen() {
		function s4() { return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1); }
		return s4() + s4()+s4()+s4()+s4()+s4()+s4()+s4();
	}

	function popup($popup,st){
		var sr = st;
		if(click_count >= all_sc ){
			$(".all_rank").text(click_count+"마리")
		}else{
			$(".all_rank").text(all_sc+"마리");
		}
		$(".user_sc").text(click_count+"마리");
		$(".my_rank").text(click_count+"마리");

		$(".click_box").hide();
		$(".click_eff").hide();

		if(click_count >=50){
			$(".change_img").attr('src','res/images/success1.png');
			en = true;
		}else{
			$(".change_img").attr('src','res/images/fail1.png');
			en = false;
		}

		if(sr == "end"){
			$popup.css({"height":"100%"});
			$popup.find(".pop_wrap").eq(0).delay(300).queue(function (next) {
				$popup.find(".pop_wrap").show().css({"animation-name":"bounceIn"});
				next();
			});

			$(".popup_co_wrap").delay(2500).queue(function(next){
				$(".popup_co_wrap").show().css({"height":"100%"});
				$(".popup_co").show();
			});
			sns_title = "[뽑기머신 속 즐밍이를 구하라! 에서 "+click_count+"마리를 구했어요~]";
			sns_desc = "즐밍이를 구하려면 클릭!";


			end();
		} else {
			$popup.stop().animate({"top":"0%"},650);
			$popup.find("div").eq(0).delay(750).fadeIn();
		}
	} //popup


    function end(){

/*

		Kakao.Link.createDefaultButton({
	        container: '#sns_kakaotalk',
	        objectType: 'feed',
	        content: {
	            title: sns_title,
	            description: sns_desc,
	            imageUrl: sns_image,
	            imageWidth: 600,
	            imageHeight: 315,
	            link: {
	                mobileWebUrl: ext_url,
	                webUrl: ext_url
	            }
	        }
	    });*/
	} //end



	$(".fail_btn").bind("mousedown",function(){
		$(".popup_co_wrap").css({"height":"0%"});
		$(".popup_co").hide();
	});

	$(".return_btn").bind("mousedown",function(){
		location.replace("/hvm/event/cjem/ZZ37/game/index.html?domain="+getUrlVars().domain);
	});


	$(".tvn_btn").bind("mousedown",function(){
		window.aodRemote.post({
    		'moveMain': 1
		});
	});




	    /*(function() {
			eval("setInterval(function() {eval('debugger');}, 500)");
		})();*/
});






