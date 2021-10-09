// wikipedia.js
//
// This file is loaded every time URL matches '*.wikipedia.org/*' as defined in manifest.json.
// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.
//
// Must not rely on ANY dependencies outside of this js and wikipedia.css files.
// Do not use jQuery.

(function(window) {
  function addCitations(url) {
    getWikipediaBooks(url).then((data) => {
      let books = Array.from(document.querySelectorAll("a[title^='Special:BookSources']"))

      // add books asynchronously so website doesn't freeze up
      setTimeout(function addBook(books) {
        let book = books.shift()
        if (book) {
          let isbn = book.innerText.replace(/-/g, '')
          let id = getIdentifier(data[isbn])
          let metadata = getMetadata(data[isbn])
          let page = getPageFromCitation(book)
          if (id) {
            let id_page = (page) ? `${id}/page/${page}` : id
            let icon = addReadIcon(id_page, metadata)
            book.parentElement.append(icon)
          } else {
            // Skipping display of donate button
            // let icon = addDonateIcon(isbn)
            // book.parentElement.append(icon)
          }
        }
        setTimeout(addBook, 1, books)
      }, 1, books)

    }).catch((error) => {
      console.log(error)
    })
  }

  function getMetadata(book) {
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

  function addDonateIcon(isbn) {
    return attachTooltip(
      createDonateAnchor(isbn),
      createDonateToolTip(isbn)
    )
  }

  function addReadIcon(id, metadata) {
    return attachTooltip(
      createArchiveAnchor(id),
      createReadToolTip(id, metadata)
    )
  }

  function createDonateToolTip(isbn) {
    return `<a href="https://www.archive.org/donate?isbn=${isbn}" target="_blank">
      <div class="wm1996-tooltip-header">
        <p class="wm1996-tooltip-title">Please donate $50 and we will try to buy &amp; digitize the book for you.</p>
      </div>
      <div class="wm1996-tooltip-details">
        <p>Or if you have a copy of this book please mail it to: </p>
        <p class="wm1996-address">Internet Archive <br>300 Funston Ave <br>San Francisco, CA 94118</p>
      </div>
    </a>`
  }

  function createReadToolTip(id, metadata) {
    return `<a href="https://www.archive.org/details/${id}" target="_blank">
      <div class="wm1996-tooltip-header">
        <p class="wm1996-tooltip-title">${metadata.title}</p>
        <p class="wm1996-tooltip-author">${metadata.author}</p>
      </div>
      <div class="wm1996-tooltip-details">` +
        (metadata.image ? `<div class="wm1996-book-outer"><img class="wm1996-book-img" src="${metadata.image}" alt="Read Book"></div>` : '') +
        `<button class="wm1996-btn wm1996-btn-auto wm1996-btn-blue">Read Book</button>
      </div>
    </a>`
  }

  function createDonateAnchor(isbn) {
    return `<a class="wm1996-archive-btn" target="_blank" href="https://archive.org/donate">
      <img src="${chrome.runtime.getURL('images/icon_color.png')}" alt="Donate">
    </a>`
  }

  function createArchiveAnchor(id) {
    return `<a class="wm1996-archive-btn" target="_blank" href="https://archive.org/details/${id}">
      <img src="${chrome.runtime.getURL('images/app-icon/app-icon32.png')}" alt="Read Book">
    </a>`
  }

  function getIdentifier(book) {
    // identifier can be found as metadata.identifier
    if (book && book.metadata) { return book.metadata.identifier }
    return null
  }

  function getPageFromCitation(book) {
    let raw = book.parentElement.innerText
    let re = /p{1,2}\.\s(\d+)-?\d*/g
    let result = re.exec(raw)
    if (result) {
      return result[1]
    }
    return result
  }

  // Get all books on wikipedia page through
  // https://archive.org/services/context/books?url=...
  //
  function getWikipediaBooks(url) {
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

  // This tooltip uses pure CSS.
  // args are plain strings of HTML.
  // returns a DOM element.
  //
  function attachTooltip(anchorHtml, tooltipHtml) {
    // create icon
    let span = document.createElement('span')
    span.className = 'wm1996-tooltip'
    span.innerHTML = anchorHtml
    span.dataset.tooltip = tooltipHtml
    // create popup
    span.addEventListener('mouseover', (e) => {
      const target = e.currentTarget
      let div = document.createElement('div')
      div.className = 'wm1996-tooltip-body'
      if (target.dataset && target.dataset.tooltip) {
        div.innerHTML = target.dataset.tooltip
      }
      // use absolute position of tooltip icon relative to document
      let rect = target.getBoundingClientRect()
      let x = window.pageXOffset + rect.x
      let y = window.pageYOffset + rect.y
      div.style.left = `${x}px`
      div.style.top = `${y}px`
      // remove popup
      div.addEventListener('mouseleave', (e) => {
        e.currentTarget.remove()
      })
      document.body.insertAdjacentElement('beforeend', div)
    })
    return span
  }

  function isWikipediaUrl(url) {
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
})(window)
