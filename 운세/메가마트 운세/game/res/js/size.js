$(document).ready(function(){
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
			( Math.abs( ratio- 9 / 16 ) < Math.abs( ratio - 9 / 19 ) ) ? '9:16' : '9:19';

			if(total == '9:19' && $(window).width()  < 720){
				console.log(total)
				$(".user_wrap > div:first-child").css({"top":"38%","height":"38%"})

			}
			else {
				total = (Math.abs(ratio- 9/16)<Math.abs(ratio-3/4)) ? '9:16' : '3:4';
				if(total == '3:4'){
					console.log(total)
				}
				else if(total == '9:16' && $(window).width() < 720 && $(window).width() >500 ) {
					console.log(total)
					$(".user_wrap > div:first-child").css({"top":"35.5%","height":"50%"});

				}
			}
		}