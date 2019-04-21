var key = 'dd2663f90eea8915b4119abab4159ba6';
var curr_request=null;
var base_url;
function init(){
	var totalCount = 7;
    var num = Math.ceil(Math.random() * totalCount);
    document.getElementById("whole").style.background="url('images/bg"+num+".jpg')";
    document.getElementById("whole").style.backgroundSize = ""+$(window).width()+"px auto";
    document.getElementById("whole").style.backgroundRepeat="no-repeat";
    document.getElementById("whole").style.backgroundPosition="center top";
    document.getElementById("whole").style.transition="background 1s";
	$.ajax({
		url:'https://api.themoviedb.org/3/configuration',
		data:{'api_key':key},
		method:'GET',
		"crossDomain": true,
		success:function(o){
			let t = o['images']['base_url'];
			let size = o['images']['poster_sizes'][2];
			base_url = t+size;
		},
		fail:function(){
			console.log("retrieving base_url failed!")
		}
	});
	setInterval(function(){
		let t = Math.ceil(Math.random() * (totalCount-1));
		num = (num+t)%totalCount;
	    document.getElementById("whole").style.background="url('images/bg"+num+".jpg')";
        document.getElementById("whole").style.backgroundSize = ""+$(window).width()+"px auto";
	    document.getElementById("whole").style.backgroundRepeat="no-repeat";
	    document.getElementById("whole").style.backgroundPosition="center top";
	    document.getElementById("whole").style.transition="background 1s";
	},10000);
}

function updateQuery(){
	var val = $('#search').val();
	if(val==""){
		clearSuggestions();
		return;
	}
	curr_request = $.ajax({
		url:'https://api.themoviedb.org/3/search/movie',
		data:{'api_key':key,'query':val},
		success:function(o){
			console.log(o);
			var str="";
			var results = o['results'];
			var l=results.length;
			if(results.length>20){
				l=20;
			}
			for(var i=0;i<l;i++){
				var movie = results[i];
				var year = movie['release_date'].substr(0,4);
				var overview = movie['overview'];
				if(overview.length>200){
					overview = overview.substr(0,200)+"...";
				}
				var pic = base_url+movie['poster_path'];
				var row = '<div class="row">';
				row+='<img onerror="this.src=\'images/error.jpg\';" src="'+pic+'" />';
				row+='<div class=details>'
				row+='<span class=title>'+movie['title']+' ('+year+')'+'</span><br>';
				row+='<span class=overview>'+overview+'</span>';
				row+='</div>'
				row+='</div>';
				str+=row;
			}
			var my_list=document.getElementById("suggestions");
			my_list.innerHTML = str;
		},
		beforeSend:function(){           
	        if(curr_request != null) {
	            curr_request.abort();
	        }
	    },
		fail:function(){
			console.log('retrieving movie data failed!')
		}
	});
}
function clearSuggestions(){
	var my_list=document.getElementById("suggestions");
	my_list.innerHTML = "";
}
