// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

chrome.storage.sync.get(['resource'], function (event) {
  if (event.resource) {
    addCitations()
  }
})
