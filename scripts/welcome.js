// welcome.js

// from 'utils.js'
/*   global afterAcceptOptions */

$('#accept').click(() => {
  afterAcceptOptions()
  chrome.storage.local.set({ 'agreement': true }, () => {
    chrome.browserAction.setPopup({ popup: 'index.html' }, () => {
      chrome.tabs.getCurrent((tab) => {
        chrome.tabs.remove(tab.id, () => {})
      })
    })
  })
})
$('#decline').click(() => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, () => {})
  })
})