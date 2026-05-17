// welcome.js

// from 'utils.js'
/*   global afterAcceptTerms, checkLastError */

$('#accept-btn').on('click', () => {
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
$('#decline-btn').on('click', () => {
  chrome.tabs.getCurrent((tab) => {
    chrome.tabs.remove(tab.id, checkLastError)
  })
})
