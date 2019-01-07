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
      let page = getPageFromCitation(book)
      if (id) {
        let icon = addReadIcon(id, metadata)
        if (page) {
          icon[0].href += '/page/' + page
        }
        book.parentElement.append(icon[0])
      } else {
        let icon = addDonateIcon(isbn)
        book.parentElement.append(icon[0])
      }
    }
  }).fail(function (xhr, status) {
    console.log(getErrorMessage(xhr))
  })
}
// getMetadata was used to standardize data between OL and IA.
// probably can be refactored out
function getMetadata (book) {
  const MAX_TITLE_LEN = 300
  if (book) {
    if (book.metadata) {
      return {
        'title': book.metadata.title.length > MAX_TITLE_LEN ? book.metadata.title.slice(0, MAX_TITLE_LEN) + '...' : book.metadata.title,
        'author': book.metadata.creator,
        'image': 'https://archive.org/services/img/' + book.metadata.identifier,
        'link': book.metadata['identifier-access'],
        'button_text': 'Read Now',
        'button_class': 'btn btn-success resize_fit_center',
        'readable': true
      }
    } else {
      return {
        'title': book.title.length > MAX_TITLE_LEN ? book.title.slice(0, MAX_TITLE_LEN) + '...' : book.title,
        'author': book.authors_metadata ? book.authors_metadata.personal_name : '',
        'image': book.covers ? 'https://covers.openlibrary.org/w/id/' + book.covers[0] + '-M.jpg' : undefined,
        'link': 'https://archive.org/donate/',
        'button_text': 'Donate',
        'button_class': 'btn btn-warning resize_fit_center',
        'readable': false
      }
    }
  }
  return false
}
function addDonateIcon (isbn) {
  return attachTooltip(
    createDonateAnchor(isbn),
    createDonateToolTip(isbn)
  )
}
function addReadIcon (id, metadata) {
  return attachTooltip(
    createArchiveAnchor(id, metadata),
    createReadToolTip(id, metadata)
  )
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
  // Handles staying open
    .on('mouseenter', function () {
      $(anchor).tooltip('show')
      $('.popup_box').on('mouseleave', function () {
        setTimeout(function () {
          if (!$('.btn-archive[href*="' + anchor.attr('href') + '"]:hover').length) {
            $(anchor).tooltip('hide')
          }
        }, 200)
      })
    })
    .on('mouseleave', function () {
      setTimeout(function () {
        if (!$('.popup_box:hover').length) {
          $(anchor).tooltip('hide')
        }
      }, 200)
    })
}
function createDonateToolTip (isbn) {
  var text_elements = $('<div>').attr({ 'class': 'text_elements' }).append(
    $('<p>').append($('<strong>').text('Please donate $50 and we will try to purchase and digitize the book for you.'))
  )

  var details = $('<div>').attr({ 'class': 'bottom_details text-muted' }).append(
    $('<p>').text('Or if you have a copy of this book please mail it to: '),
    $('<p>').text('300 Funston, San Francisco, CA 94118'),
    $('<p>').text('so we can digitize it.')
  )

  return $('<a>').append(text_elements, details).attr({ 'class': 'popup_box popup_donate', 'href': 'https://www.archive.org/donate?isbn=' + isbn })[0].outerHTML
}

function createReadToolTip (id, metadata) {
  let text_elements = $('<div>').attr({ 'class': 'text_elements' }).append(
    $('<p>').append($('<strong>').text(metadata.title)).addClass('popup-title'),
    $('<p>').addClass('text-muted').text(metadata.author)
  )
  let details = $('<div>').attr({ 'class': 'bottom_details' }).append(
    metadata.image ? $('<img>').attr({ 'class': 'cover-img', 'src': metadata.image }) : null,
    $('<p>').text('Click To Read Now').addClass('text-muted')
  )
  return $('<a>').append(text_elements, details).attr({ 'class': 'popup_box popup_read', 'href': 'https://archive.org/details/' + id })[0].outerHTML
}
function createDonateAnchor (isbn) {
  let img = $('<img>')
    .attr({ 'alt': 'Read', 'src': chrome.extension.getURL('images/icon_color.png') })[0]
  let a = $('<a>')
    .attr({
      'href': 'https://archive.org/donate',
      'class': 'btn-archive',
      'style': 'padding: 5px;'
    })
    .prepend(img)
  return a
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

function getPageFromCitation (book) {
  var raw = book.parentElement.innerText
  var re = /p{1,2}\.\s(\d+)-?\d*/g
  var result = re.exec(raw)
  if (result) {
    return result[1]
  }
  return result
}

// Get all books on wikipedia page through
// https://archive.org/services/context/books?url=...
function getWikipediaBooks (url) {
  return $.ajax({
    dataType: 'json',
    url: 'https://archive.org/services/context/books?url=' + url,
    beforeSend: function (jqXHR, settings) {
      jqXHR.url = settings.url
    },
    timeout: 30000
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    getISBNFromCitation: getISBNFromCitation,
    getIdentifier: getIdentifier
  }
}
