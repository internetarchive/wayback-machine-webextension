// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

chrome.storage.local.get(['resource'], (event) => {
  if (event.resource) {
    addCitations()
  }
})
