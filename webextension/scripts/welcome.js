// welcome.js

// from 'utils.js'
/*   global afterAcceptOptions */

$('#accept-btn').click(() => {
  afterAcceptOptions()
  browser.storage.local.set({ 'agreement': true }).then(() => {
    chrome.browserAction.setPopup({ popup: 'index.html' }, () => {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id, () => {})
      })
    })
  })
})
$('#decline-btn').click(() => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, () => {})
  })
})
