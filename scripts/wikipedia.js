// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.

function addModal(){
  $('body').append(
    $('<div>').addClass('modal').prop('id', 'myModal').append(
      $('<div>').addClass('modal-content')
    ).click(closeModal)
  )
}

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
        link.attr('title', addBook(getMetadata(book[isbn]))[0].outerHTML)
        console.log(addBook(getMetadata(book[isbn]))[0].outerHTML)
        book.parentElement.append(link[0])
      }
    }
  })
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
    'style': 'padding: 5px;',
    'data-toggle': 'tooltip',
    'data-placement':'top',
    'data-html': 'true'
  })
  .prepend(img)
  // .hover(() => openModal(metadata))
  return a
}
function openModal(metadata){

  $('.modal-content').empty().append(
    $('<div>').addClass('modal-header').append(
      $('<span>').addClass('close').text('x').click(closeModal),
      $('<h2>').text(metadata.title)
    ),
    $('<div>').addClass('modal-body').append(
      metadata.image ? $("<img>").attr({"class": "cover-img", "src": metadata.image}) : $("<p>").attr({"class": "cover-img"}).text("No cover available")
    ),
    $('<div>').addClass('modal-footer').append(
      $('<a>').addClass(metadata.button_class).attr('href', metadata.link).text(metadata.button_text)
    )
  )
  $('#myModal').show()
}
function closeModal(){
  $('.modal-content').empty()
  $('#myModal').hide()
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
