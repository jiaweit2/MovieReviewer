var key = 'dd2663f90eea8915b4119abab4159ba6';
var curr_request=null;
var need_preload = 1;
var base_url;

function init(){
	var totalCount = 9;
    var num = Math.ceil(Math.random() * totalCount);
    document.getElementById("whole").style.backgroundImage="url('images/bg"+num+".jpg')";
    document.getElementById("whole").style.backgroundSize = "cover";
    document.getElementById("whole").style.backgroundRepeat="no-repeat";
    document.getElementById("whole").style.backgroundPosition="center top";
    document.getElementById("whole").style.transition="background-image 1s ease-in-out";
    //preloading
    var img = new Image;
    img.src = 'images/bg'+(num+1)%(totalCount+1)+'.jpg';

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
		num = (num+1)%(totalCount+1);
	    document.getElementById("whole").style.backgroundImage="url('images/bg"+num+".jpg')";
        document.getElementById("whole").style.backgroundSize = "cover";
	    document.getElementById("whole").style.backgroundRepeat="no-repeat";
	    document.getElementById("whole").style.backgroundPosition="center top";
	    document.getElementById("whole").style.transition="background-image 1s ease-in-out";
	    if(need_preload<=totalCount){
		    //preloading
		    img = new Image;
		    img.src = 'images/bg'+(num+1)%(totalCount+1)+'.jpg';
		    need_preload++;
	    }
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
				var title = movie['title'].replace('\'','');
				var pic = base_url+movie['poster_path'];
				var row = '<div class="row" onclick="crawl(\''+title+'\');">';
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
function crawl(title){
	let newTab = window.open("wait.html");
	$.ajax({
		url:"http://uiuccssait.web.illinois.edu/movierater/get_rate",
		type:"POST",
		data:({
			name:title
		}),
		success:function(o){
			if(o=="NOTHING"){
				newTab.close();
				document.getElementById("open-modal").style.display="initial";
				document.getElementById("open-modal").style.opacity="1";
				return;
			}
			localStorage.setItem(title, o);
			var url = 'pullreview.html?t='+title;
			newTab.location.href = url;
		},
		fail:function(o){
			console.log(o);
			alert("failed, plz try again!");
		},
		onerror:function(o){
			alert("Server Error!")
		}
	});
}

function closemo(){
	document.getElementById("open-modal").style.opacity="0";
	document.getElementById("open-modal").style.display="none";
}




