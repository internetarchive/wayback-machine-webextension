function populateBooks(url) {
  // Gets the data for each book on the wikipedia url
  getWikipediaBooks(url).then(data=>{
    $(".loader").hide();
    // No need to check the validation of data since promise is already being resolved
    for(let isbn of Object.keys(data)) {  // Iterate over each book to get data
      let metadata = getMetadata(data[isbn]);
      if (metadata){
        let book_element = addBook(metadata);
        if(metadata.readable){
          $("#resultsTray").append(book_element);
        }
      }
    }
  }).catch( function(error) {
    $(".loader").hide();
    $("#resultsTray").css("grid-template-columns", "none").append(
      $("<div>").html(error)
    );
  });
}

function addBook(metadata){
  let text_elements = $("<div>").attr({"class": "text_elements"}).append(
    $("<p>").append($("<strong>").text(metadata.title)),
    $("<p>").text(metadata.author)
  );
  let details = $("<div>").attr({"class": "bottom_details"}).append(
    metadata.image ? $("<img>").attr({"class": "cover-img", "src": metadata.image}) : $("<p>").attr({"class": "cover-img"}).text("No cover available"),
    $("<button>").attr({"class": metadata.button_class}).text(metadata.button_text).click(function(){
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
    getMetadata:getMetadata
  };
}
