chrome.storage.sync.get(['resource'], function (event) {
  if (event.resource) {
    addCitations()
  }
})
