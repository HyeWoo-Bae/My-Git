var first_img = 'res/images/intro-';
var img_num = 0;
var animation1,animation2,animation3,animation4;
var element = document.getElementsByClassName('ch');
var state = false;
var sex,request_year,request_month,request_day,request_hour,request_min,solunar,youn;
var user_key;
var result;




(function(){
	// seting
	
	
	var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    if (/windows phone/i.test(userAgent) || /android/i.test(userAgent)) {
  		$("#d1").prop('readonly',true);
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
	         $("#tds").removeClass("date_t")
			 $("#tds").addClass("revmoe");
	    });
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        $("#d1").attr("type","date");
        $("#d1").prop('readonly',false);
    }

	//달력	
})();



 var load_img =  function(){
	animation1 = new Image();
	animation2 = new Image();
	animation3 = new Image();
	animation4 = new Image();
	animation5 = new Image();
	animation4.src = 'res/images/btn-radio-on.png?ver=1';
	animation5.src = 'res/images/btn-check-on.png?ver=1';
	animation1.src = 'res/images/mozo-panel.png';
	animation1.src = 'res/images/result-panel.png';



	for(var i = 1; i <= 5; i++){
		animation1.src = 'res/images/intro-'+i+'.png';
	}
	for(var i = 1; i <= 2; i++){
		animation1.src = 'res/images/mix-'+i+'.png';
	}
	for(var i = 1; i <= 4; i++){
		animation2.src = 'res/images/mix-ani'+i+'.png';
		animation3.src = 'res/images/dosa-eff-'+i+'.png';
	}

	animation3.onload = function(){
		Background()
		setTimeout(function(){
			$(".loding_wrap").fadeOut(function(){
				guid();
			});

		},1500);
	}
}


$(window).resize(function(){
	Background();
});

function Background(){
		var sizes  = ($("body").height() - $(".i1").height() - $(".i3").height() - $(".i5").height())/2;
				
				$(".i2-1").css({"height":sizes+"px"});
				$(".i2").css({"height":sizes+"px"});
}

function guid(){
	$(".loding_end").fadeIn();
}


function start_game(){
	$(".clode").show();
	$(".loding_end").fadeOut(function(){
		dosa_eff();
	});	
}

// story;
var Story = function() {
	img_num = 0;
	$(".skip").show();
 	var timer = setInterval(function(){
 		img_num++;
 		if (state) {
			clearInterval(timer);
		} else if (img_num >= 5) {
 			clearInterval(timer);
 			User_info();
 		} else { 
 			$(element).attr("src",first_img+(img_num+1)+".png");
 		}
 	},2000);
}




var dosa_eff = function(){
	var timer = setInterval(function(){
		img_num++;
		if(img_num >= 4){
			clearInterval(timer);
			$(".clode").fadeOut('300');
			if(window.Story){
				Story();	
			}else{
				shake();
			}
		} else if (img_num >=2) {
			$(".wrap").fadeIn('200');
			$(".clode > img").attr('src','res/images/dosa-eff-'+(img_num+1)+'.png');
		} else {
			$(".clode > img").attr('src','res/images/dosa-eff-'+(img_num+1)+'.png');
		}
	},200);
}


var ImgCh = function(){
	state = true;	
	var timer = setInterval(function(){
 		img_num++;
		if(img_num >= 3){
			clearInterval(timer);
			img_num = 0;
			$(".clode").show();
			dosa_eff();
		} else {
			
			$(element).attr("src",first_img+(img_num)+".png");
		}	
 	},2000);
}


// user_info
var User_info =  function(vi){
	if (vi == "true") state = true;
	numbers = 2;
	Story = null;
	img_num = 0;

	first_img = 'res/images/mix-';
	$(".skip").prop("onclick",null).hide();
	$(".popup").fadeIn(1200);	
	$(".ch").eq(0).css({"opacity":"0"});
	$(element).attr('src','res/images/mix-1.png');
	$(".clode > img").attr('src','res/images/dosa-eff-1.png');
	
}

function User_api(){
	$(element).css({"opacity":"1"});
	User_info = null;

	if ( jQuery.trim($("input[name=ck]:checked").val()) && jQuery.trim($("input[name=day]:checked").val()) && 
		jQuery.trim($("#d1").val()) && (jQuery.trim($("#c1:checked").val()) || jQuery.trim($("#h1").val()))){

	    state = false;

	   var date_val = $("#d1").val();
	   date_val = date_val.split("-");
	   sex = $("input[name=ck]:checked").val();
	   solunar =  $("input[name=day]:checked").val();
	   var date = new Date();
	   var get =  new Date($("#d1").val().replace(/-/g, '/'));

	    if(solunar!="양력"){
	   		if (solunar=="음력(평달)") {
	   			youn = 0;
	   		} else{
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

	    if ($("#c1:checked").val()) {
	   		request_hour = 99;
	   		request_min =99;
	    } else {
	   		var time_val = $("#h1").val();
	   		time_val = time_val.split(":");

	   		request_hour = time_val[0];
	   		request_min = time_val[1];
	    }
 
	    if ( Number(date) <= Number(get)  ) {
	   		alert("날짜를 다시 선택해 주세요!");
	    } else {
		   $.ajax({
		   		url : 'https://www.doit5.com/hvm/unse/ajax/solve.php',
		   		type :'post',
		   		data : {
		   				user_key:'123', user_name:"a", sex:sex, 
		   				request_year:request_year, request_month:request_month,
		   				request_day:request_day, request_hour:request_hour,
		   				request_min:request_min,solunar:solunar,youn:youn
		   		},
		   		success:function(data){
		   			result = data;
					$(".popup").fadeOut(100,function(){
						ImgCh();	
					});
					
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
		   		},
		   		error : function(data){
		   			alert("다시 선택해 주세요!");
		   		}
		   });
		}   
	}else{
		alert("입력하지 않은 정보가 없는지 다시 확인 해 주세요!");
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
	$(".text_info").addClass("remove_view");
	if (!window.User_info) {
		$(".skip").hide();
		$(element).attr("src","res/images/mix-2.png");
		shake_view();
	}
}



function shake_view(){
	
	setTimeout(function(){
		view_info();	
	},200)
	
}


function view_info(){
	$("#end_popup").fadeIn();
}	

function end(){
	$(".user_wrap").hide();
	$(".ending_wrap").fadeIn();

}

function landing(){
	history.back();
}

	






