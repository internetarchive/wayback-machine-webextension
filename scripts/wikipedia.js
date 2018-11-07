// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.

// main method
function addCitations () {
  getWikipediaBooks(location.href).then(data => {
    let books = $("a[title^='Special:BookSources']")
    for (let book of books) {
      let isbn = getISBNFromCitation(book)
      let id = getIdentifier(data[isbn])
      let metadata = getMetadata(data[isbn])
      if (id) {
        let link = createLinkToArchive(id, metadata)
        // link.attr(addTooltip(metadata))
        let tooltip = addTooltip(metadata).append(link).tooltip({
          animated: 'fade',
          placement: 'auto top',
          html: true,
          delay:500
        });
        book.parentElement.append(tooltip[0])
      }
    }
  })
}
function addTooltip(metadata){
  return $('<a>').attr({
    'data-toggle': 'tooltip',
    'title': createTooltipWindow(metadata)[0].outerHTML
  })
}
function createTooltipWindow(metadata){
  let text_elements = $("<div>").attr({"class": "text_elements"}).append(
    $("<p>").append($("<strong>").text(metadata.title)),
    $("<p>").css('color', '#c3c3c3').text(metadata.author)
  );
  let details = $("<div>").attr({"class": "bottom_details"}).append(
    metadata.image ? $("<img>").attr({"class": "cover-img", "src": metadata.image}) : $("<p>").attr({"class": "cover-img"}).text("No cover available"),
    $("<p>").text('Click to Read')
  );
  return $("<div>").append(text_elements, details);
}
// Get all books on wikipedia page through
// https://archive.org/services/context/books?url=...
function getWikipediaBooks (url) {
  return fetch('https://archive.org/services/context/books?url=' + url)
  .then(res => res.json())
  .catch(err => console.log(err))
}

function createLinkToArchive (id, metadata) {
  let img = $('<img>')
  .attr({ 'alt': 'Read', 'src': chrome.extension.getURL('images/icon.png') })[0]
  let a = $('<a>')
  .attr({
    'href': 'https://archive.org/details/' + id,
    'class': 'btn-archive',
    'style': 'padding: 5px;'
  })
  .prepend(img)
  // .hover(() => openModal(metadata))
  return a
}

function getIdentifier (book) {
  // identifier can be found as metadata.identifier or ocaid
  if (book) {
    var id = '';
    if (book.metadata) {
      id = book.metadata.identifier
    } else {
      id = book.ocaid
    }
    if (id) {
      return id
    }
  }
  return null
}

function getISBNFromCitation (citation) {
  // Takes in HTMLElement and returns isbn number or null if isbn not found
  let rawISBN = citation.text
  let isbn = rawISBN.replace(/-/g, '')
  return isbn
}

if (typeof module !== 'undefined') {
  module.exports = {
    getISBNFromCitation: getISBNFromCitation,
    getIdentifier: getIdentifier
  }
}
