// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

chrome.storage.local.get(['wiki_setting'], (event) => {
  if (event.wiki_setting) {
    addCitations()
  }
})
