var need_preload = 1;

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



  var urlParams = new URLSearchParams(window.location.search);
  var title = urlParams.get('t');
  var obj = localStorage.getItem(title);
  obj = JSON.parse(obj);
  console.log(obj);
  var tr = document.getElementById("reviews");
  var na = document.getElementById("name");

  var ls = "";
  for (i=0;i<6;i++){
      if(obj['reviews'][i]['feedback']=="Good"){
              ls+= '<div class="reviewbox"><a target="_blank" href="'+obj['reviews'][i]['url']+'">' + obj['reviews'][i]['review'] + "</a></div>";
      }else{
              ls+= '<div class="reviewbox darkrb"><a target="_blank" href="'+obj['reviews'][i]['url']+'">' + obj['reviews'][i]['review'] + "</a></div>";
      }
  }
  tr.innerHTML = ls;
  if(parseInt(obj["score"])>70){
      na.innerHTML = obj['title'] +" <span style=\"color:#FF5260;font-size:50px;\">"+obj["score"]+"%</span>";    
  }else{
      na.innerHTML = obj['title'] +" <span style=\"color:#84F065;font-size:50px;\">"+obj["score"]+"%</span>"; 
  }
    
}






