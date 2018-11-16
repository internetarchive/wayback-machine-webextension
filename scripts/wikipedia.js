// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.

// main method
function addCitations () {
  getWikipediaBooks(location.href).done(data => {
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
  }).fail( function( xhr, status ) {
    console.log(getErrorMessage(status))
  });
}

function addArchiveIcon(id, metadata){
  let toolTip = createTooltipWindow(metadata, id)
  let anchor = attachTooltip(createArchiveAnchor(id, metadata), toolTip)
  return anchor
}
function attachTooltip (anchor, tooltip) {
  // Modified code from https://embed.plnkr.co/plunk/HLqrJ6 to get tooltip to stay
  return anchor.attr({
    'data-toggle': 'tooltip',
    'title': tooltip
  })
  .tooltip({
    animated: false,
    placement: 'right auto',
    html: true,
    trigger: 'manual'
  })
  //Handles staying open
  .on("mouseenter", function () {

    $(anchor).tooltip("show");
    $(".popup_box").on("mouseleave", function () {
      setTimeout(function() {
        if(!$('.btn-archive[href*="' + anchor.attr('href') + '"]:hover').length){
          $(anchor).tooltip('hide');
        }
      }, 200);
    });
  })
  .on("mouseleave", function () {
    setTimeout(function () {
      if (!$(".popup_box:hover").length) {
        $(anchor).tooltip("hide");
      }
    },200);
  })
}
function createTooltipWindow (metadata, id) {
  let text_elements = $('<div>').attr({ 'class': 'text_elements' }).append(
    $('<p>').append($('<strong>').text(metadata.title)).addClass('popup-title'),
    $('<p>').addClass('text-muted').text(metadata.author)
  )
  let details = $('<div>').attr({ 'class': 'bottom_details' }).append(
    metadata.image ? $('<img>').attr({ 'class': 'cover-img', 'src': metadata.image }) : null,
    $('<p>').text('Click To Read Now').addClass('text-muted')
  )
  return $('<a>').append(text_elements, details).addClass('popup_box').attr('href', 'https://archive.org/details/' + id)[0].outerHTML
}

function createArchiveAnchor (id, metadata) {
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

// Get all books on wikipedia page through
// https://archive.org/services/context/books?url=...
function getWikipediaBooks (url) {
  return $.ajax({
    dataType: "json",
    url: 'https://archive.org/services/context/books?url=' + url,
    beforeSend: function(jqXHR, settings) {
       jqXHR.url = settings.url;
   },
    timeout: 10000
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    getISBNFromCitation: getISBNFromCitation,
    getIdentifier: getIdentifier
  }
}
