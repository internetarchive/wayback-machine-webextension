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

        let icon = addArchiveIcon(id, metadata)
        book.parentElement.append(icon[0])
      }
    }
  })
}

function addArchiveIcon(id, metadata){
  // let link = createLinkToArchive(id, metadata)
  return addTooltip(id, metadata).tooltip({
    animated: false,
    placement: 'top',
    html: true,
    trigger: 'manual'
  })
  .on("mouseenter", function () {
    var _this = this;
    $(this).tooltip("show");
    $(".popup_box").on("mouseleave", function () {
      $(_this).tooltip('hide');
    });
  }).on("mouseleave", function () {
    var _this = this;
    setTimeout(function () {
      if (!$(".popup_box:hover").length) {
        $(_this).tooltip("hide");
      }
    }, 300);
  })
}
function addTooltip (id, metadata) {
  return createLinkToArchive(id, metadata).attr({
    'data-toggle': 'tooltip',
    'title': createTooltipWindow(metadata).attr('href', 'https://archive.org/details/' + id)[0].outerHTML
  })
}
function createTooltipWindow (metadata) {
  let text_elements = $('<div>').attr({ 'class': 'text_elements' }).append(
    $('<p>').append($('<strong>').text(metadata.title)),
    $('<p>').addClass('text-muted').text(metadata.author)
  )
  let details = $('<div>').attr({ 'class': 'bottom_details' }).append(
    metadata.image ? $('<img>').attr({ 'class': 'cover-img', 'src': metadata.image }) : null,
    $('<p>').text('Click To Read Now')
  )
  return $('<a>').append(text_elements, details).addClass('popup_box')
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
  return a
}

function getIdentifier (book) {
  // identifier can be found as metadata.identifier or ocaid
  if (book) {
    var id = ''
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
