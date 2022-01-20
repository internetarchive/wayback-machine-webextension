// welcome.js

// from 'utils.js'
/*   global afterAcceptOptions, checkLastError */

$('#accept-btn').click(() => {
  afterAcceptOptions()
  chrome.storage.local.set({ 'agreement': true }, () => {
    chrome.browserAction.setPopup({ popup: 'index.html' }, () => {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id, checkLastError)
      })
    })
  })
})
$('#decline-btn').click(() => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, checkLastError)
  })
})
