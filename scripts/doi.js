
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

  let paper = $('<div>').append(
    $('<p class="text_elements">').append(
      $("<p><strong>").append(title),
      $("<p>").append(author),
      // Journal was also commented out in the previous version.
      // $("<p>").append(journal)
    )
  );
  if(url != "#") {
    paper.append(
      $("<a>").attr({"href":"#", "class":"btn btn-success"})
              .text("Read Paper")
              .click(function() {
                chrome.storage.sync.get(['show_context'],function(event1){
                    if(event1.show_context==undefined){
                      event1.show_context="tab";
                    }
                    if(event1.show_context=="tab") {
                      chrome.tabs.create({url:url});
                    } else {
                      chrome.system.display.getInfo(function(displayInfo){
                        let height = displayInfo[0].bounds.height;
                        let width = displayInfo[0].bounds.width;
                        chrome.windows.create({url: url, width: width/2,
                                               height: height, top: 0, left: 0,
                                               focused: true});
                      });
                    }
                  });
                })
    );
  } else {
    paper.append($("<p>").text("Paper Unavailable").addClass("not_found"));
  }
  /**
  //create html elements
  let paperContainer = document.createElement("div");
  let titleElement = document.createElement("p");
  let authorElement = document.createElement("p");
  let journalElement = document.createElement("p");
  let linkElement = document.createElement("a");
  let text_elements = document.createElement("div");
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
    linkElement.setAttribute("class", "not_found");
  }

  // add elements to container
  text_elements.setAttribute("class", "text_elements");
  text_elements.appendChild(titleElement);
  text_elements.appendChild(authorElement);
  paperContainer.appendChild(text_elements);
  paperContainer.appendChild(linkElement);
  // paperContainer.appendChild(journalElement);
  **/

  // add to list
  let spinner = document.getElementsByClassName("loader")[0];
  spinner.setAttribute("style", "display:none;");
  let container = $('#container-whole');
  if(url!="#" && container.children().length > 0){
    container.prepend(paper);
  }else{
    container.append(paper);
  }
}
function createPage(){
  let mainContainer = document.getElementById('container-whole');
  const url=getUrlByParameter('url');
  $.getJSON('https://archive.org/services/context/papers?url='+url, function(data) {
    for(var i=0;i<data.length;i++){
      if(data[i].paper){
        createList(data[i]);
      }
    }
    if(mainContainer.children.length == 0){
      $('.loader').hide();
      $('#doi-heading').html("No papers found");
    }
  });
}
if(typeof module !=="undefined") {module.exports = {getUrlByParameter:getUrlByParameter};}
