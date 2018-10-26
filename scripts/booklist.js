

//Used to extact the current URL
function getUrlByParameter(name){
    var url=window.location.href;
    var indexOfEnd=url.length;
    var index=url.indexOf(name);
    var length=name.length;
    return url.slice(index+length+1,indexOfEnd);
}

function populateBooks(url){
  // Gets the data for each book on the wikipedia url
  get_ia_books(url).then((data)=>{
    $(".loader").hide();
    if (data['status'] === 'error') {
      $("#resultsTray").css("grid-template-columns", "none").append(
        $("<p></p>").text(data.message)
      );
    } else {
      for(let isbn of Object.keys(data)) {  // Iterate over each book to get data
        let metadata = getMetadata(data[isbn]);
        if (metadata){
          let book_element = addBook(metadata);
          if(metadata.readable){
            $("#resultsTray").prepend(book_element);
          } else {
            $("#resultsTray").append(book_element);
          }
        }
      }
    }
  });
}

function getMetadata(book){
  if (book) {
    if(book.metadata){
      return {
        "title" : book.metadata.title,
        "author" : book.metadata.creator,
        "image" : "http://archive.org/services/img/" + book.metadata.identifier,
        "link" : book.metadata["identifier-access"],
        "button_text": "Read Now",
        "button_class": "btn btn-success resize_fit_center",
        "readable" : true
      }
    }else{
      return {
        "title" : book.title,
        "author" : book.authors_metadata ? book.authors_metadata.personal_name : "",
        "image" : book.covers ? "http://covers.openlibrary.org/w/id/"+ book.covers[0]+"-M.jpg" : undefined,
        "link" : "https://archive.org/donate/",
        "button_text": "Donate",
        "button_class": "btn btn-warning resize_fit_center",
        "readable" : false
      }
    }
  }
  return false;
}

function addBook(metadata){
  let text_elements = $("<div>").attr({"class": "text_elements"}).append(
    $("<p>").append($("<strong>").text(metadata.title)),
    $("<p>").text(metadata.author)
  );
  let details = $("<div>").attr({"class": "bottom_details"}).append(
    metadata.image ? $("<img>").attr({"class": "cover-img", "src": metadata.image}) : $("<p>").attr({"class": "cover-img"}).text("No cover available"),
    $("<a>").attr({"class": metadata.button_class, "href": "#"}).text(metadata.button_text).click(function(){
      chrome.storage.sync.get(['show_context'],function(event1){
          if(event1.show_context==undefined){
              event1.show_context="tab";
          }
          if(event1.show_context=="tab"){
              chrome.tabs.create({url:metadata.link});
          }else{
            chrome.system.display.getInfo(function(displayInfo){
              let height = displayInfo[0].bounds.height;
              let width = displayInfo[0].bounds.width;
              chrome.windows.create({url:metadata.link, width:width/2, height:height, top:0, left:0, focused:true});
            });
          }
      });
    })
  );
  return $("<div>").append(text_elements, details);
}

if(typeof module !=="undefined") {
  module.exports = {
    getUrlByParameter:getUrlByParameter,
    getMetadata:getMetadata
  };
}
