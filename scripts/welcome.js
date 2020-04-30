// welcome.js

$(document).ready(function () {
  $('#accept').click(function () {
    chrome.storage.sync.set({ 'agreement': true }, function () {
      chrome.browserAction.setPopup({ popup: 'index.html' }, function () {
        window.close()
      })
    })
  })
  $('#decline').click(function () {
    window.close()
  })
})
