	
    
	$(window).on("resize",function(){
		startGraph();
	});


	var i;
	var color =["#ffe577","#fec051","#ff8866","#fd6051","#5c2c3a"];
	var per =  ["60","60","60","70","50"]; 
	var text = ["HTML","CSS","jQuery ","wordpress","PHP"];
	var text2 =["HTML5 하드코딩 모바일 페이지 제작","반응형 레이아웃 (부트스트랩 가능)"," jQuery UI,AJAX","페이지 하드코딩,숏코드 작성",""];
	var size = ["45","30","40","65","25"];
	var size2 = ["115","105","55","90","80"];
	var ctxs = [];
	
	var c,ctx,check = true;
	for( i =0 ;i <=4;i++){
		
		$(".cans").append("<div><canvas  class='can' style='border-bottom:1px solid #999' id='c"+i+"' data-value='"+text[i]+"'></canvas></div>");
			width_resize(i,$(".cans").find("div").width());
			
	}

	function width_resize(num,widths){
		c = document.getElementById('c'+num);
		ctx = c.getContext('2d');
		c.width = widths;
		c.height ='450';
		
		ctx.translate(c.width/2 , c.height/2);
		ctxs.push(ctx);	
		
	}
	
	var maxTerm = 10;
	var intTerm = 1;

	function startGraph()
	{
		var	intervalId = setInterval( ghInterval, 10); //0.01초간격으로 드로우.
	
		setTimeout(clearGH, 2000); //1초후 인터벌 종료
		function clearGH(){
			clearInterval(intervalId);
		}
	}
	
	
	function ghInterval()
	{
		if(intTerm > maxTerm * 10)
			return;
		console.log("인터벌 실행중");
		for(var i = 0; i <= 4; i++){
			var lCtx = ctxs[i];
			
			lCtx.translate(-c.width/2 , -c.height/2);
			lCtx.clearRect(0,0,c.width, c.height);	
			lCtx.translate(c.width/2 , c.height/2);		
			
			var percentage = 100;
			var width = 10;
			
			lCtx.beginPath();
			lCtx.font="40px 맑은 고딕";
			lCtx.fillStyle = color[i];
			lCtx.strokeStyle = color[i];
			lCtx.arc(0, 0 , 120 , 0, Math.PI * 2);
			lCtx.fillText(per[i]+"%",-40,10)
			
			
				lCtx.font ="30px 맑은 고딕";
				lCtx.fillStyle = "#e9562a";
				lCtx.fillText(text[i],-size[i],170);
				
				lCtx.font ="15px 맑은 고딕";
				lCtx.fillStyle ="#999";
				lCtx.fillText(text2[i],-size2[i],220);
			
			lCtx.lineWidth = width;
			lCtx.lineCap = "round";
			lCtx.stroke();
			lCtx.innerHTML = text[i];
				
			percentage  =per[i];
			width = 4;
			
			lCtx.rotate( -0.5 * Math.PI);
			lCtx.beginPath();
			lCtx.arc(0, 0 , 100 , 0, Math.PI / 100 * (percentage / (maxTerm * 10) * intTerm)  * 2);
					lCtx.lineWidth = width;
					lCtx.lineCap = "round";
					lCtx.strokeStyle = color[i];
					lCtx.stroke();
			lCtx.rotate( 0.5 * Math.PI);
		}
		intTerm++;	
	}
	
	function gh(){
				if(check){
					var percentage = 100;
					var width = 10;
					ctx.translate(c.width/2 , c.height/2);
					check = false;
					
					ctx.beginPath();
					ctx.font="40px 맑은 고딕";
					ctx.fillStyle = color[i];
					ctx.strokeStyle = color[i];
					ctx.arc(0, 0 , 120 , 0, Math.PI / 100 * percentage * 2);
					ctx.fillText(per[i]+"%",-40,10)
					
					ctx.font ="30px 맑은 고딕";
					ctx.fillStyle = "#000";
					ctx.fillText(text[i],-size[i],170);
					
					ctx.font ="15px 맑은 고딕";
					ctx.fillStyle ="#999";
					ctx.fillText(text2[i],-size2[i],220);
					
					ctx.rotate( -0.5 * Math.PI);
					ctx.lineWidth = width;
					ctx.lineCap = "round";
					ctx.stroke();
					ctx.innerHTML = text[i];

				}else{
					
					var percentage  =per[i];
					var width = 4;
					check = true;
					
					ctx.beginPath();
					ctx.arc(0, 0 , 100 , 0, Math.PI / 100 * percentage * 2);
					ctx.lineWidth = width;
					ctx.lineCap = "round";
					ctx.strokeStyle = color[i];
					ctx.stroke();

				}	
	}