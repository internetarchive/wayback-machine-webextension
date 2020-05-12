// welcome.js

$(document).ready(function () {
  $('#accept').click(function () {
    chrome.storage.sync.set({ 'agreement': true }, function () {
      chrome.browserAction.setPopup({ popup: 'index.html' }, function () {
        chrome.tabs.getCurrent(function(tab) {
          chrome.tabs.remove(tab.id, function() {})
        })
      })
    })
  })
  $('#decline').click(function () {
    chrome.tabs.getCurrent(function(tab) {
      chrome.tabs.remove(tab.id, function() {})
    })
  })
})
