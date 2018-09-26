
let resultsTray = document.getElementById("resultsTray");
let spinner = document.getElementsByClassName("loader")[0];
let donationWindow = {
  url:chrome.runtime.getURL("donatebook.html"),
  width:500,
  height:500,
  top:500,
  left:500,
  focused:true
}
let readWindow = {
  width:500,
  height:500,
  top:0,
  left:500,
  focused:true
}

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
  var xhr=new XMLHttpRequest();
  var new_url="https://archive.org/services/context/books?url=" + url;
  xhr.open("GET",new_url,true);
  xhr.onload=function(){
    let data=JSON.parse(xhr.response);
    if(data instanceof Array){ //checks if any ISBNs found
      for(let book of data){  // Iterate over each book to get data
        let isbn = Object.keys(book)[0];
        if(book[isbn]){
          let OLID = Object.keys(book[isbn][isbn].responses)[0];
          let archiveIdentifier = book[isbn][isbn].responses[OLID]['identifier'];
          if(archiveIdentifier){
            getMetadataFromArchive(archiveIdentifier);
          }else{
            getMetadataFromOpenLibrary(OLID, isbn);
          }
        }
      }
    }else if(data['status'] == "error"){
      spinner.setAttribute("style", "display:none;");
      let p = document.createElement("p");
      p.appendChild((document.createTextNode(data.message)));
      resultsTray.setAttribute("style", "grid-template-columns:none;");
      resultsTray.appendChild(p);
    }else{
      for(let isbn of Object.keys(data)){  // Iterate over each book to get data
        if(data[isbn]){
          let OLID = Object.keys(data[isbn][isbn].responses)[0];
          let archiveIdentifier = data[isbn][isbn].responses[OLID]['identifier'];
          if(archiveIdentifier){
            getMetadataFromArchive(archiveIdentifier);
          }else{
            getMetadataFromOpenLibrary(OLID, isbn);
          }
        }
      }
    }
  }
  xhr.send();
}

window.onload = function(){
  var url = getUrlByParameter('url');
  getBooked(url);
};

function getMetadataFromArchive(id){
  var xhr=new XMLHttpRequest();
  xhr.responseType = "json";
  var qurl="https://archive.org/metadata/" + id;
  xhr.open("GET",qurl,true);
  xhr.onload=function(){
    addBookFromArchive(xhr.response.metadata);
  }
  xhr.send();
}

function getMetadataFromOpenLibrary(olid, isbn){
  var xhr=new XMLHttpRequest();
  xhr.responseType = "json";
  isbn = isbn.replace(/\-/g, "");
  var qurl= "http://openlibrary.org/isbn/"+isbn+".json";
  // console.log(qurl);
  xhr.open("GET",qurl,true);
  xhr.onload=function(){
    addBookFromOpenLibrary(xhr.response);
  }
  xhr.send();
}

function addBookFromArchive(metadata){
  let book = document.createElement('div');
  let title = document.createElement('p');
  let strong = document.createElement('strong');
  let author = document.createElement('p');
  let details = document.createElement('a');
  let img = document.createElement("img");
  let button = document.createElement("a");

  button.setAttribute("class", "btn btn-success resize_fit_center");
  button.setAttribute("href", "#");
  button.addEventListener("click", function(){
    readWindow['url'] = "https://archive.org/details/" + metadata.identifier;
    chrome.windows.create(readWindow);
  });
  details.setAttribute("href", "https://archive.org/details/" + metadata.identifier);
  img.setAttribute("src", "https://archive.org/services/img/" + metadata.identifier);

  details.appendChild(img);
  strong.appendChild(document.createTextNode(metadata.title));
  author.appendChild(document.createTextNode(metadata.creator));
  button.appendChild(document.createTextNode("Read Now"));
  title.appendChild(strong);
  book.appendChild(title);
  book.appendChild(author)
  book.appendChild(details);
  book.appendChild(button);
  spinner.setAttribute("style", "display:none;");
  if(resultsTray.childNodes.length >0){
    resultsTray.insertBefore(book, resultsTray.childNodes[0]);
  }else{
    resultsTray.appendChild(book);
  }
}

// TODO: add support for author in metadata
function addBookFromOpenLibrary(metadata){
  let book = document.createElement('div');
  let title = document.createElement('p');
  let strong = document.createElement('strong');
  let author = document.createElement('p');
  let details = document.createElement('a');
  let img = document.createElement("img");
  let button = document.createElement("a");

  button.setAttribute("class", "btn btn-warning resize_fit_center");
  button.setAttribute("href", "#");
  button.addEventListener("click", function(){
    chrome.windows.create(donationWindow);
  });
  // details.setAttribute("href", "http://openlibrary.org" + metadata.key);
  if(metadata.covers){
    img.setAttribute("src", "http://covers.openlibrary.org/w/id/"+metadata.covers[0]+"-M.jpg");
  }else{
    img = document.createElement("p");
    img.appendChild(document.createTextNode("Book details"))
  }

  details.appendChild(img);
  strong.appendChild(document.createTextNode(metadata.title));
  // author.appendChild(document.createTextNode(getAuthorFromOpenLibrary(metadata.authors)));
  button.appendChild(document.createTextNode("Donate"));
  title.appendChild(strong);
  book.appendChild(title);
  // book.appendChild(author);
  book.appendChild(details);
  book.appendChild(button);
  spinner.setAttribute("style", "display:none;");

  resultsTray.appendChild(book);
}
