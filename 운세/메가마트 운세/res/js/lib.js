var first = '';
var game_start_url;
var user_info;
var options;
var urls;
var sns_op;
var heart_op


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
var user_key = query_to_hash().user_key;


function setTing(sever_url, option, heart_option, sns){
    urls = sever_url;
    options = option;
    game_start_url = '/hvm/event/'+options.project+'/'+options.code+'/game/index.html';
    console.log(game_start_url);
    var first = '/hvm/event'+options.pr+urls.op+urls.first+"?user_key="+user_key;
    

    /*$.getJSON(first,function(result){*/

        /*user_info = result;*/
        user_info = {"user_key": "4","heart": "3","share": "5","coins": "0","total_coins": "0",
            "code": 0,
            "rank": 0,
            "record": [0,0,0,0,0]
        }

        if(option.rank){
            rank();
        }

        if(option.heart){
            heart_op = heart_option;
            heart(heart_op);
        } 

        sns_op = sns;

        code_al(user_info.code)

        
   /* });*/
}

function code_al(cd){
    console.log(cd);
}

function tag(btn_wrap){
   $(btn_wrap.start[0]).click(function(){
        /*console.log(game_start_url)*/
        location.replace(game_start_url);
   });

   $(btn_wrap.kakao[0]).click(function(){
        if (!isMobile.any()) {
            alert("모바일에서만 지원되는 공유 기능입니다.");
        }
        else {
            if(options.sns_count) sns_count("kakao"); 
            
        }
   });

   $(btn_wrap.facebook[0]).click(function(){
        if(options.sns_count) sns_count("fb"); 
        var url = 'http://dev.doit5.com/hvm/event/megamart/ZZ40/share.html'
        window.open(
            "https://www.facebook.com/sharer/sharer.php?u=" + url + "&t=" + sns_op.sns_title,"_blank","width=630,height=430,scrollbars=0,toolbar=0,resizable=1"
        );
   });
}

function sns_count(type){
    $.getJSON('/hvm/event/'+options.project+"/"+options.code+urls.op+urls.share+'?user_key='+user_key+'&type='+type, function(result){
         user_info.heart = result.heart;
         heart(heart_op)
    });
}

function rank(){
    $(options.rank_tag).text(user_info.user_rank+"등")
    $(options.score_tag).text(user_info.user_score+"개")
}

function heart(option){
   $(option.wrap).find("img").remove();
    for(var i = 0; i < user_info.heart;i++){
        $(option.wrap).prepend("<img src='"+option.on+"'>");
    }

    for(var j = option.max ; j > user_info.heart; j--){
        $(option.wrap).append("<img src='"+option.off+"'>");
    }
    
    $(option.wrap).find("img").css({"width": (100/option.max)-option.gap+"%","margin":"0%"+option.gap/2+"%"})
}








