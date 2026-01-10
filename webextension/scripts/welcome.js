// welcome.js

// from 'utils.js'
/*   global afterAcceptTerms, checkLastError */

$('#accept-btn').click(() => {
  try {
    afterAcceptTerms()
  }
  catch (error) {
    // Some browsers may not support the menu API.
    console.log('afterAcceptTerms ERROR: ', error)
  }
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, checkLastError)
  })
})
$('#decline-btn').click(() => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, checkLastError)
  })
})
