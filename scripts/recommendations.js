let tray = document.getElementById('RecommendationTray');
let spinner = document.getElementsByClassName("loader")[0];

function constructArticles(clips){
  if(clips.length == 0){
    let p = document.createElement('p');
    p.appendChild(document.createTextNode("No Related Clips Found..."));
    spinner.setAttribute("style", "display:none;");
    tray.append(p);
    // return -1;
  }
  for (let clip of clips){
    let div = document.createElement('div');
    let img = document.createElement('img');
    let anchor = document.createElement('a');
    let p = document.createElement('p');
    let show = document.createElement('p');
    let strong = document.createElement('strong');
    let showdate = document.createElement('p');

    img.classList.add("resize_fit_center");
    img.src = clip.preview_thumb;
    anchor.href = "#";
    anchor.addEventListener("click", function(){
      chrome.storage.sync.get(['show_context'],function(event1){
          if(event1.show_context==undefined){
              event1.show_context="tab";
          }
          if(event1.show_context=="tab"){
              chrome.tabs.create({url:clip.preview_url});
          }else{
            chrome.system.display.getInfo(function(displayInfo){
              let height = displayInfo[0].bounds.height;
              let width = displayInfo[0].bounds.width;
              chrome.windows.create({url:clip.preview_url, width:width/2, height:height, top:0, left:0, focused:true});
            });
          }
      });
    });

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
    spinner.setAttribute("style", "display:none;");
    tray.appendChild(div);
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
      if(clips.status!="error"){
        constructArticles(clips);
      }else{
        spinner.setAttribute("style", "display:none;");
        let p = document.createElement("p");
        p.setAttribute("style", "width:300; margin-left:auto;margin-right:auto;");
        p.appendChild(document.createTextNode(clips.message));
        tray.setAttribute("style", "grid-template-columns:none;")
        tray.appendChild(p);
      }
    }
  }
  request.send();
}
