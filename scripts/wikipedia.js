// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.

//main method
function addCitations(){
  get_wikipedia_books(location.href).then(data => {
    let books = $('.citation.book');
    for(let book of books){
      let isbn = getISBNFromCitation(book);
      let id = getIdentifier(data[isbn]);
      if(id){
        let link = createLinkToArchive(id);
        book.append(link);
      }
    }
  });
}

// Get all books on wikipedia page through
// https://archive.org/services/context/books?url=...
function get_wikipedia_books (url) {
  return fetch('https://archive.org/services/context/books?url=' + url)
    .then(res => res.json())
    .catch(err => console.log(err))
}

function createLinkToArchive(id){
  let img = $('<img>')
    .attr({"alt": "Read", "src": chrome.extension.getURL("images/icon.png")})[0];
  let a = $("<a>")
    .attr({"href": "https://archive.org/details/" + id, "class":"btn-archive"})
    .prepend(img)
    .hover(
      function() {
        $(this).text(" Read Now! ").prepend(img);
      },
      function() {
        $(this).text("").prepend(img);
      })[0];

  return a;
}

function getIdentifier(book){
  //identifier can be found as metadata.identifier or ocaid
  if(book){
    if(book.metadata){
      var id = book.metadata.identifier
    } else{
      var id = book.ocaid;
    }
    if(id){
      return id;
    }
  }
  return null;
}

function getISBNFromCitation(citation){
  //Takes in HTMLElement and returns isbn number or null if isbn not found
  let html = citation.outerHTML;
  const hasTextISBN_pattern = /<a href="\/wiki\/International_Standard_Book_Number" title="International Standard Book Number">ISBN<\/a>/;
  if (hasTextISBN_pattern.test(html)){
    const extractISBNNumber_pattern = /title="Special:BookSources\/[^"]*"/;
    let isbnRaw = extractISBNNumber_pattern.exec(html)[0];
    let isbn = isbnRaw.replace(/title="Special:BookSources\//, "").replace(/-/g, "").replace(/"/g, "");
    return isbn;
  }else{
    return null;
  }
}

if(typeof module !=="undefined") {
  module.exports = {
    getISBNFromCitation:getISBNFromCitation,
    getIdentifier:getIdentifier
  };
}
