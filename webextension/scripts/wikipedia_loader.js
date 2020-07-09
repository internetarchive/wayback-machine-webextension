// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

browser.storage.local.get(['resource'], (event) => {
  if (event.resource) {
    addCitations()
  }
})
