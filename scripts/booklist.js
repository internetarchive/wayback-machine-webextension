let resultsTray = document.getElementById("resultsTray");

//Used to extact the current URL
function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function getBooked(url){
  // Gets the data for each book on the wikipedia url
  get_ia_books(url).then((data)=>{
    $(".loader").hide();
    if (data['status'] === 'error') {
      let p = document.createElement("p");
      p.appendChild((document.createTextNode(data.message)));
      resultsTray.setAttribute("style", "grid-template-columns:none;");
      resultsTray.appendChild(p);
    } else {
      for(let isbn of Object.keys(data)) {  // Iterate over each book to get data
        if (data[isbn]) {
          //if book has field: metadata, addBookFromArchive
          if(data[isbn].metadata){
            addBookFromArchive(data[isbn].metadata);
          }//else if book has id, addBookFromArchive using getMetadataFromArchive
          else if(getIdentifier(data[isbn])){
            getMetadataFromArchive(getIdentifier(data[isbn]));
            //TODO add this identifier to OL perhaps
          }//else add book from OL
          else{
              addBookFromOpenLibrary(data[isbn]);
          }
        }
      }
    }
  });
}

function getMetadataFromArchive (id) {
  $.getJSON('https://archive.org/metadata/' + id, function (data) {
    addBookFromArchive(data.metadata);
  });
}

function getMetadataFromOpenLibrary (olid, isbn) {
  isbn = isbn.replace(/\-/g, '');
  $.getJSON('http://openlibrary.org/isbn/' + isbn + '.json', function (data) {
    addBookFromOpenLibrary(data);
  });
}

function addBookFromArchive(metadata){
  let book = document.createElement('div');
  let title = document.createElement('p');
  let strong = document.createElement('strong');
  let author = document.createElement('p');
  let details = document.createElement('div');
  let text_elements = document.createElement('div');
  let img = document.createElement("img");
  let button = document.createElement("a");

  details.setAttribute("class", "bottom_details");
  text_elements.setAttribute("class", "text_elements");
  button.setAttribute("class", "btn btn-success resize_fit_center");
  button.setAttribute("href", "#");
  button.addEventListener("click", function(){
    chrome.storage.sync.get(['show_context'],function(event1){
        if(event1.show_context==undefined){
            event1.show_context="tab";
        }
        if(event1.show_context=="tab"){
            chrome.tabs.create({url:"https://archive.org/details/" + metadata.identifier});
        }else{
          chrome.system.display.getInfo(function(displayInfo){
            let height = displayInfo[0].bounds.height;
            let width = displayInfo[0].bounds.width;
            chrome.windows.create({url:"https://archive.org/details/" + metadata.identifier, width:width/2, height:height, top:0, left:0, focused:true});
          });
        }
    });
  });
  img.setAttribute("src", "https://archive.org/services/img/" + metadata.identifier);
  img.setAttribute("class", "cover-img");
  button.appendChild(document.createTextNode("Read Now"));
  details.appendChild(img);
  details.appendChild(button);
  strong.appendChild(document.createTextNode(metadata.title));
  author.appendChild(document.createTextNode(metadata.creator));
  title.appendChild(strong);
  text_elements.appendChild(title);
  text_elements.appendChild(author);
  book.appendChild(text_elements);
  book.appendChild(details);
  if(resultsTray.childNodes.length >0){
    resultsTray.insertBefore(book, resultsTray.childNodes[0]);
  }else{
    resultsTray.appendChild(book);
  }
}

function addBookFromOpenLibrary(metadata){
  let book = document.createElement('div');
  let title = document.createElement('p');
  let strong = document.createElement('strong');
  let author = document.createElement('p');
  let details = document.createElement('div');
  let text_elements = document.createElement('div');
  let img = document.createElement("img");
  let button = document.createElement("a");

  text_elements.setAttribute("class", "text_elements");
  img.setAttribute("class", "cover-img");
  details.setAttribute("class", "bottom_details");
  button.setAttribute("class", "btn btn-warning resize_fit_center");
  button.setAttribute("href", "#");

  button.addEventListener("click", function(){
    chrome.storage.sync.get(['show_context'],function(event1){
        if(event1.show_context==undefined){
            event1.show_context="tab";
        }
        if(event1.show_context=="tab"){
            chrome.tabs.create({url:"https://archive.org/donate/"});
        }else{
          chrome.system.display.getInfo(function(displayInfo){
            let height = displayInfo[0].bounds.height;
            let width = displayInfo[0].bounds.width;
            chrome.windows.create({url:"https://archive.org/donate/", width:width/2, height:height, top:0, left:0, focused:true});
          });
        }
    });
  });

  if(metadata.covers){
    img.setAttribute("src", "http://covers.openlibrary.org/w/id/"+metadata.covers[0]+"-M.jpg");
  }else{ //TODO: find cover
    img = document.createElement("p");
    img.appendChild(document.createTextNode("No cover available"));
    img.setAttribute("class", "cover-img");
  }
  button.appendChild(document.createTextNode("Donate"));
  details.appendChild(img);
  details.appendChild(button);
  strong.appendChild(document.createTextNode(metadata.title));
  title.appendChild(strong);
  if(metadata.authors_metadata){
    author.appendChild(document.createTextNode(metadata.authors_metadata.name));
  }
  text_elements.appendChild(title);
  text_elements.appendChild(author);
  book.appendChild(text_elements);
  book.appendChild(details);
  resultsTray.appendChild(book);
}

function getAuthorFromOpenLibrary(key){
  let url = "http://openlibrary.org"+ key + ".json";
  return fetch(url)
    .then(res=>res.json())
    .then(json => json.name)
    .catch(err => console.log(err));
}

if(typeof module !=="undefined") {module.exports = {getUrlByParameter:getUrlByParameter};}
