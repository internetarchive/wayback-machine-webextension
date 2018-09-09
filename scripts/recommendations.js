let tray = document.getElementById('RecommendationTray');

function constructArticles(clips){
  if(clips.length == 0){
    let p = document.createElement('p');
    p.appendChild(document.createTextNode("No Related Clips Found..."));
    tray.append(p);
    return -1;
  }
  for (let entry of clips){
    let clip = entry;
    let div = document.createElement('div');
    let img = document.createElement('img');
    let anchor = document.createElement('a');
    let p = document.createElement('p');
    let show = document.createElement('p');
    let strong = document.createElement('strong');
    let showdate = document.createElement('p');

    img.classList.add("resize_fit_center");
    img.src = clip.preview_thumb;
    anchor.href = clip.preview_url;

    anchor.appendChild(img);
    p.appendChild(anchor);
    strong.appendChild(document.createTextNode(clip.station + ": "));
    show.appendChild(strong);
    show.appendChild(document.createTextNode(clip.show));
    show.classList.add('resize_fit_center');
    showdate.appendChild(document.createTextNode(
      new Date(clip.date.slice(0,4) + "-" + clip.date.slice(4,6) + "-"+clip.date.slice(6,8)).toDateString()));
    div.appendChild(show);
    div.appendChild(p);
    div.appendChild(showdate);
    tray.appendChild(div);
  }
}

function getUrlByParameter(name){
  var url=window.location.href;
  var indexOfEnd=url.length;
  var index=url.indexOf(name);
  var length=name.length;
  return url.slice(index+length+1,indexOfEnd);
}

window.onloadFuncs = [get_details];
window.onload = function(){
  for(var i in this.onloadFuncs){
   this.onloadFuncs[i]();
  }
}
function get_details(){
  var article = null;
  article = getUrlByParameter('url');
  var apiURL = "https://archive.org/services/context/tvnews?url="+article;
  var request = new XMLHttpRequest();
  request.open("GET", apiURL, true);
  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      var clips = JSON.parse(request.responseText);
      constructArticles(clips);
    }
  }
  request.send();
}


