// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

chrome.storage.local.get(['wiki-resource'], (event) => {
  if (event.wiki_resource) {
    addCitations()
  }
})
