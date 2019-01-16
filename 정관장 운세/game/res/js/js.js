var first_img = 'res/images/intro-';
var img_num = 0;
var animation1,animation2,animation3,animation4;
var element = document.getElementsByClassName('ch');
var state = false;
var item_ck = 0;
var sex,request_year,request_month,request_day,request_hour,request_min,solunar,youn;
var result;
var user_key;
var img_num2 = 0;

$(document).ajaxStart(function(){
	$(".ajax_start").show();
});


$("#d1").click(function(){
	$("#ui-datepicker-div").css({"display":"block"})
})

$("#h1").click(function(){
	$('#ui-timepicker-div').css({"display":"block"})
})





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
        
user_key = query_to_hash();


$("#d1").blur();


(function(){
	$( "#d1" ).datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'yy-mm-dd',
		prevText: '<',
    	nextText: '>',
    	monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    	monthNamesShort: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    	dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    	dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
    	dayNamesMin: ['일', '월', '화', '수', '목', '금', '토'],
    	showMonthAfterYear: true,
    	yearSuffix: '년',
    	yearRange: "-100:+0",
    	closeText: '&times;'
	}).on('change', function(){
         $('.datepicker').hide();
    });




	var agent = navigator.userAgent.toLowerCase();
	var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE ");

    if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
    {
        $('#h1').timepicker().on('change', function(){
        	$('#ui-timepicker-div').hide();
    	});
    }
    else if(navigator.userAgent.search ( "Safari") >= 0 && navigator.userAgent.search ( "Chrome") < 0)
    {
    	var filter = "win16|win32|win64|mac|macintel"; 
    	if ( navigator.platform ) { 
			if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) { 
		    
			}else{
				$('#h1').timepicker().on('change', function(){
			        $('#ui-timepicker-div').hide();
			    });
			}
		}
    }
    

	for(var i = 1; i <= 6; i++){
		animation1 = new Image();
		animation1.src = 'res/images/intro-5_'+i+'.png';
		animation2 = new Image();
		animation2.src = 'res/images/mix-5_'+i+'.png';
	}

	for(var j = 1; j <=4; j++){
		animation3 = new Image();
		animation3.src = 'res/images/intro-'+j+'.png';
		animation4 = new Image();
		animation4.src = 'res/images/mix-'+j+'.png';
	}
	
	var bgs = new Image();
	bgs.src ='res/images/5-mozo.png';
	bgs.src = 'res/images/result-panel.png';


	animation4.onload = function(){
		setTimeout(function(){
			$(".loding_wrap").fadeOut(function(){
				Story();
			})
		},1000);
	}
})();





// story;
var Story = function(){
	item_ck++;
 	var timer = setInterval(function(){
 		img_num++;

 		if(item_ck >= 2 && item_ck <= 3 && !state) item_add();
 		if(item_ck >= 2 && img_num >= 4 ) Story = null;

 		if (state) {
			clearInterval(timer);
		}else if (img_num >= 4) {
			img_num = 0;
 			clearInterval(timer);
 			ImgCh();

 		}else if(!state){ 
 			$(element).attr("src",first_img+(img_num+1)+".png");
 		}
 	},2000);

 }


var ImgCh = function(){	
	
	if(item_ck >= 2) $(".skip").hide();
	var img = setInterval(function(){
		img_num2++;
		if (state) {
			clearInterval(img);
		}else if (img_num2 >= 7) {
			clearInterval(img);
			if(window.User_info) User_info();
			shake();
			state = true;
		}
		else if(!state){
			$(element).attr("src",first_img+"5_"+(img_num2)+".png");
		}
	},300);
}



// user_info
var User_info =  function(vi){
	img_num = 0;
	if(vi == "true") state = true;

	$(".skip").prop("onclick",null).hide();
	$(".popup").fadeIn(1500);	
	$(".ch").eq(0).css({"opacity":"0"});
	$(element).attr('src','res/images/mix-1.png');
	$(".cover").attr('src','res/images/cover-pot.png').css({"width":"27%","margin-left":"36.5%","margin-top":"-15%"});

	first_img ='res/images/mix-';
}

function User_api(){
	state = false;
	User_info = null;
	$(element).css({"opacity":"1"});
	$(".skip").attr("onClick","shake()").show();
	$(".add_i").show();	

	if( jQuery.trim($("input[name=ck]:checked").val()) && jQuery.trim($("input[name=day]:checked").val()) && 
		jQuery.trim($("#d1").val()) && (jQuery.trim($("#c1:checked").val()) || jQuery.trim($("#h1").val()))){
	   var date_val = $("#d1").val();
	   date_val = date_val.split("-");
	   name = $("#name").val();
	   sex = $("input[name=ck]:checked").val();
	   solunar =  $("input[name=day]:checked").val();
	   var date = new Date();
	   var get =  new Date($("#d1").val().replace(/-/g, '/'));

	   if(solunar!="양력"){
	   		if(solunar=="음력(평달)"){
	   			youn = 0;
	   		}else{
	   			youn = 1;
	   		}
	   		solunar = "lunar";
	   }else{
	   		solunar = "solar";
	   		 youn = 0;
	   }

	   request_year = date_val[0];
	   request_month = date_val[1];
	   request_day = date_val[2];

	   if($("#c1:checked").val()){
	   		request_hour = 99;
	   		request_min =99;
	   }else{
	   		var time_val = $("#h1").val();
	   		time_val = time_val.split(":");

	   		request_hour = time_val[0];
	   		request_min = time_val[1];
	   }

	   if( Number(date) <= Number(get)  ){
	   		alert("날짜를 다시 선택해 주세요");
	   }else{
		   $.ajax({
		   		url : 'https://www.doit5.com/hvm/unse/ajax/solve.php',
		   		type :'post',
		   		data : {
		   				user_key:"1", user_name:"A", sex:sex, 
		   				request_year:request_year, request_month:request_month,
		   				request_day:request_day, request_hour:request_hour,
		   				request_min:request_min,solunar:solunar,youn:youn
		   		},
		   		success:function(data){
		   			result = data;

		   			var text_re =  result.resut.S142.replace(/<BR><BR>/gi, "a!");
						text_re =  text_re .replace(/<BR>/gi, "");
						text_re =  text_re.replace(/a!/gi, "<BR>");
					

					var text_re1 =  result.resut.S143.replace(/<BR><BR>/gi, "a!");
						text_re1 =  text_re1.replace(/<BR>/gi, "");
						text_re1 =  text_re1.replace(/a!/gi, "<BR>");


		   							
					$(".text1").html(text_re);
					$(".text2").html(text_re1);
					for(var i = 1; i <= 12; i++){
							var text_re2 =  result.resut.S110[i].replace(/<BR><BR>/gi, "a!");
							text_re2 =  text_re2.replace(/<BR>/gi, "");
							text_re2 =  text_re2.replace(/a!/gi, "<BR>");
						$(".text3").append("<div>"+i+"월:<br>"+text_re2+"</div>");
					}
					$(".popup").fadeOut()
					img_num = 0;
			   		$(".ajax_start").delay(1000).queue(function (next) { 
			   			$(".ajax_start").fadeOut();
						setTimeout(function(){
							Story();	
							next(); 
						})
					});
		   		},
		   		error : function(data){
		   			$(".ajax_start").fadeOut();
		   			alert("다시 선택해 주세요");
		   		}
		   })
		}   
	}else{
		alert("모두 입력");
		state = true;
	}	
}

function check(){
	if ($("#c1").prop("checked")) {
		$("#h1").prop("disabled",true);
	}
	else {
		$("#h1").prop("disabled",false);
	}
}

function shake(){
	if (!window.User_info) {
		state = true;
		$(".shake_info").show();
		$(".skip").hide();
		$(".add_i").hide();
		$(element).attr("src","res/images/mix-5_6.png");
		shake_view();
	}
}

function item_add(){
	var item_pos = [
		"55%",
		"30%",
		"30%"
	]

	var tr = [
		"rotate(-100deg)",
		"rotate(90deg)",
		"rotate(120deg)"
	]

	$(".item"+img_num).css({"left":item_pos[img_num-1],"transform":tr[img_num-1]});
	$(".item"+img_num).on("transitionend",function(){
		$(this).css({"opacity":"0"});

	});

}

function shake_view(){
	$(".user_wrap").css({"background-image":"url(res/images/result-panel.png)"});
	var filter = "win16|win32|win64|mac|macintel"; 
	if ( navigator.platform ) { 
		if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) { 

			var count = 0;
			var shakeEvent = new Shake({threshold: 10, timeout: 50});
			shakeEvent.start();

			window.addEventListener('shake', function(event){
				event.preventDefault();
		   		count++;
		   		if(count >= 3){
		   			stopShake();
		   			view_info();
		   		}
		   		else{
		   			$(".wrap").css({"animation-name":"shake"})
		   			$(".wrap").delay(700).queue(function (next) {
		   				$(".wrap").css({"animation-name":""})
		   				next();
		   			})
		   		}

			}, false);
			//stop listening
			function stopShake(){
			    shakeEvent.stop();
			}
		}else{
			var fo = 0;
			$(window).keyup(function(event){
				if(event.which == 37 || event.which == 39){
					fo++;
					$(".wrap").css({"animation-name":"shake"})
					$(".wrap").delay(700).queue(function (next) {
						$(".wrap").css({"animation-name":""});
						next();
					});
					if(fo >= 5){
						$(window).off('keyup');
						view_info();
					}
				}
			})
		}
	}
}


function view_info(){
	$(".user_info_wrap").css({"display":"flex"});
}	

function end(){
	$(".ending_wrap").css({"display":"block"});
	$(".user_wrap").hide();
}

function landing(){
	location.href='/hvm/event/kgc/ZZ39/index2.html?user_key='+user_key.user_key;
}

	
// 빌드된 게임의 디버그 방지를 위한 코드
/*(function() {
	eval("setInterval(function() {eval('debugger');}, 500)");
})();*/






