$(document).ready(function () {
  const VERSION = chrome.runtime.getManifest().version
  const DATE = new Date().getFullYear()
  $('#version').text(VERSION)
  $('#year').text(DATE)
})
