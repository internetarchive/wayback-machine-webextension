$(document).ready(function () {
  const VERSION_NAME = chrome.runtime.getManifest().version_name
  const DATE = new Date().getFullYear()
  $('#version').text(VERSION_NAME)
  $('#year').text(DATE)
})
