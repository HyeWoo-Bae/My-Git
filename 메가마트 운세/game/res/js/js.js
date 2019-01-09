var first_img = 'res/images/intro-';
var img_num = 0;
var animation1,animation2,animation3;
var element = document.getElementsByClassName('ch');
var state = false;
var item_ck = 0;
var sex,request_year,request_month,request_day,request_hour,request_min,solunar,youn;
var user_key;
var result;

(function(){
	// seting
	


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
	
	/*user_key = query_to_hash().user_key;*/
	user_key = 124;


	for(var i = 1; i <= 5; i++){
		animation1 = new Image();
		animation1.src = 'res/images/intro-'+i+'.png';
	}
	for(var i = 1; i <= 2; i++){
		animation2 = new Image();
		animation2.src = 'res/images/mix-'+i+'.png';
	}

	animation3 =  new Image();
	animation3.src = 'res/images/mozo-panel.png'

	animation2.onload = function(){
		setTimeout(function(){
			$(".loding_wrap").fadeOut(function(){
				Story();
			})
		},1000)
	}
})();


// story;
function Story(){
	img_num = 0;
	item_ck++;
 	var timer = setInterval(function(){
 		img_num++;
 		if (state) {
			clearInterval(timer);
		}else if (img_num >= 5) {
 			clearInterval(timer);
 		 	if(window.User_info) User_info();

 		}else { 
 			$(element).attr("src",first_img+(img_num+1)+".png");
 		}

 	},2000);
 }


var ImgCh = function(){	
	img_num = 0;
	if(item_ck >= 2) $(".skip").hide();
	var img = setInterval(function(){
		img_num++;
		if (state) {
			clearInterval(img);
		}else if (img_num >= 3) {
			clearInterval(img);
			if(window.User_info) User_info();
			shake()
		}
		else {

			$(element).attr("src","res/images/mix-"+img_num+".png");
		}
	},2000);
}


// user_info
var User_info =  function(vi){
	if(vi == "true") state = true;

	$(".skip").prop("onclick",null).hide()
	$(".popup").fadeIn(1200);	
	$(".ch").eq(0).css({"opacity":"0"});
	$(element).attr('src','res/images/mix-1.png');
}

function User_api(){
	/*readonly*/
	User_info = null;

	$(element).css({"opacity":"1"});
	$(".skip").attr("onClick","shake()").show();

	if( $("input[name=ck]:checked").val() && $("input[name=day]:checked").val() && 
		jQuery.trim($("#d1").val()) && $("#c1:checked").val() || $("#h1").val()){
	   state = false;

	   var date_val = $("#d1").val();
	   date_val = date_val.split("-")
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
		   				user_key:user_key, user_name:"a", sex:sex, 
		   				request_year:request_year, request_month:request_month,
		   				request_day:request_day, request_hour:request_hour,
		   				request_min:request_min,solunar:solunar,youn:youn
		   		},
		   		success:function(data){
		   			result = data;
					$(".popup").fadeOut(100,function(){
						ImgCh();	
					});
					$(".text1").html(result.resut.S142);
					$(".text2").html(result.resut.S143);
					for(var i = 1; i <= 12; i++){
						$(".text3").append("<div>"+i+"월:<br>"+result.resut.S110[i]+"</div>");
					}
		   		},
		   		error : function(data){
		   			alert("다시 선택해 주세요")
		   		}
		   })
		}   
	}else{
		alert("모두 입력")
	}	
}

function check(){
	if ($("#c1").prop("checked")) {
		$("#h1").prop("disabled",true)
	}
	else {
		$("#h1").prop("disabled",false);
	}
}

function shake(){
	if (!window.User_info) {
		state = true;
		$(".shake_box").show();
		$(".skip").hide();
		$(element).attr("src","res/images/mix-2.png");
		shake_view();
	}
}



function shake_view(){
	$(".user_wrap").css({"background-image":"url(res/images/result-panel.png)"});	
	var filter = "win16|win32|win64|mac|macintel"; 
	if ( navigator.platform ) { 
		if ( filter.indexOf( navigator.platform.toLowerCase() ) < 0 ) { 
			var count = 0;

			var shakeEvent = new Shake({threshold: 10, timeout: 50});
			shakeEvent.start();
			
			var timers;
			var img_ch = 0;

			timers = setInterval(function(){
				img_ch++;
				if(img_ch >= 4){
					img_ch = 0;
				}else{
					$(".show_img").attr('src','res/images/mix-3-pa-ani'+img_ch+".png")	
				}
				
			},100);

			setTimeout(function(){
				if(count <= 1){
					$(".guid").show();
				}
			})
				
			

			window.addEventListener('shake', function(event){
				event.preventDefault();
		   		count++;
		   		if(count >= 4){
		   			stopShake();
		   			view_info()
		   			clearInterval(timers)
		   		}

			}, false);
			//stop listening
			function stopShake(){
			    shakeEvent.stop();
			}
		}
		else{
			var fo = 0;
			$(window).keyup(function(event){
				if(event.which == 37 || event.which == 39){
					
					timers = setInterval(function(){
						fo++;
						if(fo >= 4){
							img_ch = 0;
						}else{
							$(".show_img").attr('src','res/images/mix-3-pa-ani'+fo+".png")	
						}
						
					},300)
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
	$(".shake_box").hide();
	$(".user_info_wrap").show();


}	

function end(){
	$(".ending_wrap").css({"display":"block"})
	$(".user_wrap").hide();

}

function landing(){
	location.href='http://app.megamart.com/'
}


/**/
	






