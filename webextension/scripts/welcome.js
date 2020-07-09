// welcome.js

// from 'utils.js'
/*   global afterAcceptOptions */

$('#accept').click(() => {
  afterAcceptOptions()
  browser.storage.local.set({ 'agreement': true }, () => {
    browser.browserAction.setPopup({ popup: 'index.html' }, () => {
      browser.tabs.getCurrent((tab) => {
        browser.tabs.remove(tab.id, () => {})
      })
    })
  })
})
$('#decline').click(() => {
  browser.tabs.getCurrent((tab) => {
    browser.tabs.remove(tab.id, () => {})
  })
})
