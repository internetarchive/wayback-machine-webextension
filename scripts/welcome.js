$(document).ready(() => {
  $('#accept').click(() => {
    chrome.storage.sync.set({ 'agreement': true }, function () {
      chrome.browserAction.setPopup({ popup: 'index.html' }, function () {
        window.close()
      })
    })
  })
  $('#decline').click(() => {
    window.close()
  })
})
