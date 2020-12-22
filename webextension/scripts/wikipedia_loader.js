// wikipedia_loader.js

// from 'wikipedia.js'
/*   global addCitations */

browser.storage.local.get(['wiki_setting']).then((settings) => {
  if (settings.wiki_setting) {
    addCitations()
  }
})
