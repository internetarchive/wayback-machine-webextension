// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.


//Get all books on wikipedia page through https://archive.org/services/context/books?url=...
function getJSON(){
  let url = "https://archive.org/services/context/books?url=" + location.href;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      let books = document.getElementsByClassName('citation book');
      for(let book of books){
        let isbn = getISBNFromCitation(book);
        let id = getIdentifierFromISBN(isbn, data);
        if(id){
          let link = createLinkToArchive(id);
          book.appendChild(link);
        }
      }
    })
    .catch(err=> console.log(err));
}

function createLinkToArchive(id){
  let a = document.createElement('a');
  a.className = "btn btn-primary";
  a.href = "https://archive.org/details/" + id;
  a.innerHTML = "Read Now";
  return a;
}

function getIdentifierFromISBN(isbn, json){
  if(json[isbn] && json[isbn][isbn]){
    let id = Object.values(json[isbn][isbn]['responses'])[0]['identifier']
    if(id){
      return id;
    }else{
      return null;
    }
  }
  else{
    return null;
  }
}

function getISBNFromCitation(citation){
  //Takes in HTMLElement and returns isbn number or null if isbn not found
  let html = citation.outerHTML;
  let hasTextISBN_pattern = /<a href="\/wiki\/International_Standard_Book_Number" title="International Standard Book Number">ISBN<\/a>/;
  if (hasTextISBN_pattern.test(html)){
    let extractISBNNumber_pattern = /title="Special:BookSources\/.*"/;
    let isbnRaw = extractISBNNumber_pattern.exec(html)[0];
    let isbn = isbnRaw.replace(/title="Special:BookSources\//, "").replace(/-/g, "").replace(/"/g, "");
    return isbn;
  }else{
    return null;
  }
}

if(typeof module !=="undefined") {module.exports = {
  getISBNFromCitation:getISBNFromCitation,
  getIdentifierFromISBN:getIdentifierFromISBN
};}


getJSON();
