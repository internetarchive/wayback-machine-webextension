// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.


//main method
function addCitations(){
  get_ia_books(location.href).then(data => {
    let books = $('.citation.book');
    for(let book of books){
      let isbn = getISBNFromCitation(book);
      let id = getIdentifierFromISBN(isbn, data);
      if(id){
        let link = createLinkToArchive(id);
        book.append(link);
      }
    }
  });
}

//Get all books on wikipedia page through https://archive.org/services/context/books?url=...
function get_ia_books(url){
  let api = "https://archive.org/services/context/books?url=" + url;
  return fetch(api)
    .then(res => res.json())
    .catch(err => console.log(err));
}

function createLinkToArchive(id){
  let img = $('<img>')
    .attr({"alt": "Read", "src": chrome.extension.getURL("images/icon.png"), "style": "max-height:50%; max-width:50%;"})[0];
  let a = $('<a>')
    .attr({'href':"https://archive.org/details/" + id, 'class': 'btn btn-success btn-sm'})
    .text("Read").prepend(img);
  return a[0];
}

function getIdentifierFromISBN(isbn, json){
  if(json[isbn] && json[isbn][isbn]){
    let id = Object.values(json[isbn][isbn]['responses'])[0]['identifier']
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
    getIdentifierFromISBN:getIdentifierFromISBN
  };
}
