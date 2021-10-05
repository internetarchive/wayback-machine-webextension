// wikipedia.js
// This file is loaded every time URL matches '*.wikipedia.org/*' as defined in manifest.json.
// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.

// from 'utils.js' CAN REMOVE
/*   global attachTooltip, isNotExcludedUrl */

(function(window, $) {

  function addCitations(url) {
    getWikipediaBooks(url).then((data) => {
      //let books = $("a[title^='Special:BookSources']") // $
      let books = document.querySelectorAll("a[title^='Special:BookSources']") // js DOM NodeList of HTMLElements
      for (let book of books) {
        //let isbn = book.text.replace(/-/g, '') // is text $ or js?
        let isbn = book.innerText.replace(/-/g, '')
        let id = getIdentifier(data[isbn]) // string or null
        let metadata = getMetadata(data[isbn]) // js obj
        let page = getPageFromCitation(book) // string?
        if (id) {
          let icon = addReadIcon(id, metadata) // $ now DOM element
          //if (page) {
          //  icon[0].href += '/page/' + page // $ or js? TODO: Do inside addReadIcon()
          //}
          //book.parentElement.append(icon[0]) // parentElement is js
          book.parentElement.append(icon)
        } else {
          let icon = addDonateIcon(isbn) // $ now DOM element
          //book.parentElement.append(icon[0]) // $ or js?
          book.parentElement.append(icon)
        }
      }
    }).catch((error) => {
      console.log(error)
    })
  }

function getMetadata(book) { // js
  const MAX_TITLE_LEN = 300
  if (book && book.metadata) {
    return {
      'title': (book.metadata.title.length > MAX_TITLE_LEN) ? book.metadata.title.slice(0, MAX_TITLE_LEN) + '...' : book.metadata.title,
      'author': book.metadata.creator,
      'image': 'https://archive.org/services/img/' + book.metadata.identifier,
      'link': book.metadata['identifier-access'],
      'button_text': 'Read Book',
      'button_class': 'btn btn-auto btn-blue',
      'readable': true
    }
  }
  return false
}

function addDonateIcon(isbn) { // $ now DOM HTMLElement
  return attachTooltip2(
    createDonateAnchor(isbn),
    createDonateToolTip(isbn)
  )
}
function addReadIcon(id, metadata) { // $ now DOM HTMLElement
  return attachTooltip2(
    createArchiveAnchor(id),
    createReadToolTip(id, metadata)
  )
}

/*
function createDonateToolTip (isbn) {
  return $('<a>')
    .attr({
      'class': 'popup_box popup_donate',
      'href': 'https://www.archive.org/donate?isbn=' + isbn,
      'target': '_blank'
    })
    .append(
      $('<div>')
        .addClass('text-elements')
        .append(
          $('<p>').append(
            $('<strong>').text('Please donate $50 and we will try to purchase and digitize the book for you.')
          )
        ),
      $('<div>')
        .addClass('bottom-details text-muted')
        .append(
          $('<p>').text('Or if you have a copy of this book please mail it to: '),
          $('<p>').text('300 Funston, San Francisco, CA 94118'),
          $('<p>').text('so we can digitize it.')
        )
    )[0].outerHTML
}
// */

function createDonateToolTip(isbn) { // js
  return `<a class="popup_box popup_donate" target="_blank" href="https://www.archive.org/donate?isbn=${isbn}">
    <div class="text-elements">
      <p><strong>Please donate $50 and we will try to purchase and digitize the book for you.</strong></p>
    </div>
    <div class="bottom-details text-muted">
      <p>Or if you have a copy of this book please mail it to: </p>
      <p>300 Funston, San Francisco, CA 94118</p>
      <p>so we can digitize it.</p>
    </div>
  </a>`
}

/*
function createReadToolTip (id, metadata) {
  return $('<a>')
    .attr({ 'class': 'popup_box popup_read', 'href': 'https://archive.org/details/' + id, 'target': '_blank' })
    .append(
      $('<div>')
        .addClass('text-elements')
        .append(
          $('<p>').append($('<strong>').text(metadata.title)).addClass('popup-title'),
          $('<p>').addClass('text-muted').text(metadata.author)
        ),
      $('<div>')
        .addClass('bottom-details')
        .append(
          metadata.image ? $('<img>').attr({ 'class': 'cover-img', 'src': metadata.image }) : null,
          $('<p>').text('Click To Read Now').addClass('text-muted')
        )
    )[0].outerHTML
}
// */

function createReadToolTip(id, metadata) { // js
  return `<a class="popup_box popup_read" target="_blank" href="https://www.archive.org/details/${id}">
    <div class="text-elements">
      <p class="popup-title"><strong>${metadata.title}</strong></p>
      <p class="text-muted">${metadata.author}</p>
    </div>
    <div class="bottom-details">`
      + (metadata.image ? `<img class="cover-img" src="${metadata.image}">` : '') +
      `<p class="text-muted">Click To Read Now</p>
    </div>
  </a>`
}

/*
function createDonateAnchor (isbn) {
  return $('<a>')
    .attr({
      'href': 'https://archive.org/donate',
      'class': 'btn-archive',
      'style': 'padding: 5px;',
      'target': '_blank'
    })
    .prepend(
      $('<img>')
        .attr({ 'alt': 'Read', 'src': chrome.runtime.getURL('images/icon_color.png') })[0]
    )
}
// */

function createDonateAnchor(isbn) { // js
  return `<a class="btn-archive" target="_blank" style="padding: 5px" href="https://archive.org/donate">
    <img alt="Read" src="${chrome.runtime.getURL('images/icon_color.png')}">
  </a>`
}

/*
function createArchiveAnchor (id) {
  return $('<a>')
    .attr({
      'href': 'https://archive.org/details/' + id,
      'class': 'btn-archive',
      'style': 'padding: 5px;',
      'target': '_blank'
    })
    .prepend(
      $('<img>')
        .attr({ 'alt': 'Read', 'src': chrome.runtime.getURL('images/icon.png') })[0]
    )
}
// */

function createArchiveAnchor(id) { // js
  return `<a class="btn-archive" target="_blank" style="padding: 5px" href="https://archive.org/details/${id}">
    <img alt="Read" src="${chrome.runtime.getURL('images/icon.png')}">
  </a>`
}

function getIdentifier(book) { // js
  // identifier can be found as metadata.identifier
  if (book && book.metadata) { return book.metadata.identifier }
  return null
}

function getPageFromCitation(book) { // js
  let raw = book.parentElement.innerText // TODO: is parentElement jQuery?
  let re = /p{1,2}\.\s(\d+)-?\d*/g
  let result = re.exec(raw)
  if (result) {
    return result[1]
  }
  return result // TODO: check this value
}

// Get all books on wikipedia page through
// https://archive.org/services/context/books?url=...
//
function getWikipediaBooks(url) { // js
  // Encapsulate the chrome message sender with a promise object
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage({
      message: 'getWikipediaBooks',
      query: url
    }, (books) => {
      if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message) }
      if (books) {
        resolve(books)
      } else {
        reject(new Error('error'))
      }
    })
  })
}

// TODO: replace with non-jQuery version.
function attachTooltip(anchor, tooltip, pos = 'right', time = 200) { // $
  // Modified code from https://embed.plnkr.co/plunk/HLqrJ6 to get tooltip to stay
  const janchor = $(anchor)
  return janchor.attr({
    'data-toggle': 'tooltip',
    'title': tooltip
  })
  .tooltip({
    animated: false,
    placement: `${pos} auto`,
    html: true,
    trigger: 'manual'
  })
  // Handles staying open
  .on('mouseenter', () => {
    janchor.tooltip('show')
    $('.popup_box').on('mouseleave', () => { // wouldn't this cause every popup to have n mouseleave events? O(n^2)?
      setTimeout(() => {
        if (!$(`.${janchor.attr('class')}[href*="${janchor.attr('href')}"]:hover`).length) { // WTF does this mean?
          janchor.tooltip('hide')
        }
      }, time)
    })
  })
  .on('mouseleave', () => {
    setTimeout(() => {
      if (!$('.popup_box:hover').length) {
        janchor.tooltip('hide')
      }
    }, time)
  })
}

// This tooltip uses pure CSS.
// args are plain strings of HTML.
// returns a DOM element.
//
function attachTooltip2(anchorHtml, tooltipHtml, pos = 'right') {
  let span = document.createElement('span')
  span.className = 'wm1996-tooltip ' + pos
  span.innerHTML = anchorHtml
  //span.dataset.text = tooltipHtml
  span.dataset.text = 'This is a test popup.'

  // TEST
  let span2 = document.createElement('span')
  span2.className = 'wm1996-tooltip-text'
  span2.innerHTML = tooltipHtml
  span.append(span2)

  return span
}


  function isWikipediaUrl(url) { // js
    if (typeof url !== 'string') { return false }
    try {
      const hostname = new URL(url).hostname
      return (hostname === 'wikipedia.org') || hostname.endsWith('.wikipedia.org')
    } catch (e) {
      return false
    }
  }

  // calling direct instead of onload because of delay while injecting script
  chrome.storage.local.get(['agreement', 'wiki_setting'], (settings) => {
    if (settings && settings.agreement && settings.wiki_setting && location.href && isWikipediaUrl(location.href)) {
      addCitations(location.href)
    }
  })

})(window, jQuery)
