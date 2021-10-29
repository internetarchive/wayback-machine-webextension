// wikipedia.js
//
// This file is loaded every time URL matches '*.wikipedia.org/*' as defined in manifest.json.
// This script adds buttons next to isbns on wikipedia pages that will redirect
// the user to a readable digital copy of the referenced book.
//
// Must not rely on ANY dependencies outside of this js and wikipedia.css files.
// Do not use jQuery.

(function(window) {

  const hrefPatterns = {
    'simple': 'Special:BookSources',
    'ar': '%D8%AE%D8%A7%D8%B5:%D9%85%D8%B5%D8%A7%D8%AF%D8%B1_%D9%83%D8%AA%D8%A7%D8%A8',
    'de': 'Spezial:ISBN-Suche',
    'en': 'Special:BookSources',
    'es': 'Especial:FuentesDeLibros',
    'fr': 'Sp%C3%A9cial:Ouvrages_de_r%C3%A9f%C3%A9rence',
    'it': 'Speciale:RicercaISBN',
    'ja': '%E7%89%B9%E5%88%A5:%E6%96%87%E7%8C%AE%E8%B3%87%E6%96%99',
    'pl': 'Specjalna:Ksi%C4%85%C5%BCki',
    'pt': 'Especial:Fontes_de_livros',
    'ru': '%D0%A1%D0%BB%D1%83%D0%B6%D0%B5%D0%B1%D0%BD%D0%B0%D1%8F:%D0%98%D1%81%D1%82%D0%BE%D1%87%D0%BD%D0%B8%D0%BA%D0%B8_%D0%BA%D0%BD%D0%B8%D0%B3',
    'zh': 'Special:%E7%BD%91%E7%BB%9C%E4%B9%A6%E6%BA%90'
  }

  function addCitations(url) {

    // find book anchor elements in page
    const lang = extractWikiLanguage(url)
    const patt = hrefPatterns[lang] || hrefPatterns['en']
    let books = Array.from(document.querySelectorAll(`a[href^='/wiki/${patt}']`))
    const isbns = books.map((book) => {
      return book.href.split('/').pop().replace(/-/g, '')
    })
    if (isbns.length === 0) { return }
    console.log({ url, isbns }) // DEBUG

    // get matching books from API
    getWikipediaBooks(url /*, isbns */).then((data) => { // TODO: uncomment once books API supports POST
      console.log({ data }) // DEBUG
      if (!data || (data && data.status && (data.status === 'error'))) {
        // no matching books returned
        return
      } else {
        // indicate in toolbar that we have found books
        // Content scripts cannot use tabs.query, so it must be called in background.js
        chrome.runtime.sendMessage({ message: 'addToolbarStates', states: ['R', 'books'], url: url }, (result) => {
          if (chrome.runtime.lastError) { console.log(chrome.runtime.lastError.message) }
        })
      }

      // add books asynchronously so website doesn't freeze up
      setTimeout(function addBook(books) {
        let book = books.shift()
        if (book) {
          let isbn = book.href.split('/').pop().replace(/-/g, '')
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
          setTimeout(addBook, 1, books)
        }
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
        'image': 'https://archive.org/services/img/' + book.metadata.identifier
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
      <img src="${chrome.runtime.getURL('images/wiki-archive-icon.png')}" alt="Donate">
    </a>`
  }

  function createArchiveAnchor(id) {
    return `<a class="wm1996-archive-btn" target="_blank" href="https://archive.org/details/${id}">
      <img src="${chrome.runtime.getURL('images/wiki-archive-icon.png')}" alt="Read Book">
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
  function getWikipediaBooks(url, isbns = null) {
    // Encapsulate the chrome message sender with a promise object
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage({
        message: 'getWikipediaBooks',
        isbns: isbns,
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
      let x = window.pageXOffset + rect.x + (rect.width / 2)
      let y = window.pageYOffset + rect.y + (rect.height / 2)
      const halfw = 150
      // move popup left if it's over right edge
      if (x + halfw > window.innerWidth) { x = window.innerWidth - halfw }
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

  // returns the language prefix of wikipedia url, else empty string.
  function extractWikiLanguage(url) {
    if (typeof url !== 'string') { return '' }
    try {
      const hostname = new URL(url).hostname
      return hostname.split('.')[0]
    } catch (e) {
      return ''
    }
  }

  // calling direct instead of onload because of delay while injecting script
  chrome.storage.local.get(['agreement', 'wiki_setting'], (settings) => {
    if (settings && settings.agreement && settings.wiki_setting && location.href && isWikipediaUrl(location.href)) {
      addCitations(location.href)
    }
  })
})(window)
