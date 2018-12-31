$(document).ready(function(){

	$(".rd").delay(1000).queue(function(next) {
		$(".rd").css({"opacity":"1"});
		$(".rd2").css({"opacity":"1"})
		$(".view_logo").css({"opacity":"1","margin-top":"0%"})
		next();
		rotate();
	});

	var show_none ="show";
	$(".view_about > div:nth-child(3)").click(function(){
		if(show_none=="show"){
			$(".view_about > .abouts").css({"opacity":"1"});
			$(".view_about > div:nth-child(3)").attr("data-pos","hide")
			$(".abouts > div  > *").delay(500).queue(function(next){
				$(".abouts > div").css({"opacity":"1"})
				$(".abouts > div  > *").css({"margin-top":"0%"});
				next();
			});
			show_none ="hide";
		}else{
			$(".view_about > .abouts").css({"opacity":"0"});
			$(".view_about > div:nth-child(3)").attr("data-pos","show")
			show_none ="show";
		}	
	});

	$(".main_menu > li").click(function(){
		var pos = $(this).data("id");
		$("html").stop().animate({"scrollTop":$("#"+pos).offset().top},500)
		
	});

	$(".main_menu2 > li").click(function(){
		var pos = $(this).data("id");
		$("html").stop().animate({"scrollTop":$("#"+pos).offset().top/1.2},500)
		
	})

	$(".view_menu > li").click(function(){
		$(this).addClass("active_menu").siblings("li").removeClass("active_menu");
		if($(this).text()=="디자인"){
			$(".view2").fadeIn();
			$(".view1").css({"display":"none"})
		}else if($(this).text()=="개발"){
			$(".view1").fadeIn();
			$(".view2").css({"display":"none"})
		}else{
			$(".view1").fadeIn();
			$(".view2").fadeIn();
		}
		
	});


	$(".popup_close").click(function(){
		$(".popup_box").fadeOut();
	});


	$(".view2").click(function(){
		var img_url = $(this).data("image");
		$(".popup_img_box").find("img").attr("src",img_url);
		$(".popup_box").fadeIn();
	});


});


function obj_height(){
	var height_obj;
	if($(document).width() <= 900 && $(document).width() >= 440 ){
		 height_obj= $(".content_wrap > div > img:last-child").height();
		 
	}else{
		height_obj= $(".content_wrap > div > img:first-child").height(); 
		$("#main3_section").css({"height":height_obj+"px"});
	}
	$(".content_wrap > div:last-child").css({"height":height_obj+"px"});
	$(".abouts").css({"height":height_obj+"px"});
}

var timer;
function moon_light(num,count){
	$(".stack").find("li").eq(num).delay(count).queue(function(next) {
			$(this).css({"opacity":"1","margin-top":"7%"}); 
			next(); 
	}) ;	
}


function rotate(){
	$(".rd").css({"transform":"rotate(30deg)"});
	$(".rd2").css({"transform":"scale(1.1,1.1)"})
}

			

$(window).scroll(function(){
	var height = $(document).scrollTop();

	$(".header2").css({"position":"fixed","top":"0%","z-index":"10"});

	if(height >= $("#main3_section").offset().top/1.2){
		for(var i =0 ; i<=5;i++){
			timer +=300;
			moon_light(i,timer);				 
		}
	}
})

$( window ).resize(function() {
	obj_height();
});

