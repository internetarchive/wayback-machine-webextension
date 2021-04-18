// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

// This file is loaded every time URL matches '*.wikipedia.org/*' as defined in manifest.json.

chrome.storage.local.get(['wiki_setting'], (settings) => {
  if (settings && settings.wiki_setting) {
    addCitations()
  }
})
