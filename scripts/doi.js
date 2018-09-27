
function getUrlByParameter(name){
  var url=window.location.href;
  var indexOfEnd=url.length;
  var index=url.indexOf(name);
  var length=name.length;
  return url.slice(index+length+1,indexOfEnd);
}
function createList(entry, mainContainer){
  // extract data from json
  let title = entry.paper.title;
  let author = entry.paper.authors[0];
  if(entry.paper.authors.length > 1){
    author = author + " et al.";
  }
  let journal = entry.paper.journal;
  let url="#";
  if(entry.count_files>0 && entry.files.length>0 && entry.files[0].links.length>0 && entry.files[0].links[0].url){
    url = entry.files[0].links[0].url;
  }

  //create html elements
  let paperContainer = document.createElement("div");
  let titleElement = document.createElement("p");
  let authorElement = document.createElement("p");
  let journalElement = document.createElement("p");
  let linkElement = document.createElement("a");

  // add data to html elements
  let strong = document.createElement("strong");
  strong.appendChild(document.createTextNode(title));
  titleElement.appendChild(strong);
  authorElement.appendChild(document.createTextNode(author));
  journalElement.appendChild(document.createTextNode(journal));
  if(url != "#"){
    linkElement.appendChild(document.createTextNode("Read Paper"));
    linkElement.setAttribute("href", "#");
    linkElement.setAttribute("class", "btn btn-success");
    linkElement.addEventListener("click", function(){
      chrome.storage.sync.get(['show_context'],function(event1){
          if(event1.show_context==undefined){
              event1.show_context="tab";
          }
          if(event1.show_context=="tab"){
              chrome.tabs.create({url:url});
          }else{
            chrome.system.display.getInfo(function(displayInfo){
              let height = displayInfo[0].bounds.height;
              let width = displayInfo[0].bounds.width;
              chrome.windows.create({url:url, width:width/2, height:height, top:0, left:0, focused:true});
            });
          }
      });
    });

  }else{
    linkElement = document.createElement('p');
    linkElement.appendChild(document.createTextNode("Paper Unavailable"));
    linkElement.setAttribute("style", "color:red;")
  }

  // add elements to container
  paperContainer.appendChild(titleElement);
  paperContainer.appendChild(authorElement);
  paperContainer.appendChild(linkElement);
  // paperContainer.appendChild(journalElement);

  // add to list
  let spinner = document.getElementsByClassName("loader")[0];
  spinner.setAttribute("style", "display:none;");
  if(url!="#" && mainContainer.childNodes.length > 0){
    mainContainer.insertBefore(paperContainer, mainContainer.childNodes[0]);
  }else{
    mainContainer.appendChild(paperContainer);
  }
}
function createPage(){
  let mainContainer = document.getElementById('container-whole');

  var url=getUrlByParameter('url');
  var xhr=new XMLHttpRequest();
  xhr.open('GET','https://archive.org/services/context/papers?url='+url,true);
  xhr.onload=function(){
    var responseArray = JSON.parse(xhr.responseText);
    for(var i=0;i<responseArray.length;i++){
      if(responseArray[i].paper){
        createList(responseArray[i], mainContainer);
      }

    }
    if(mainContainer.children.length ==0){
      let spinner = document.getElementsByClassName("loader")[0];
      spinner.setAttribute("style", "display:none;");
      document.getElementById('doi-heading').innerHTML="No papers found";
    }
  };
  xhr.send();
}
window.onload = createPage;
