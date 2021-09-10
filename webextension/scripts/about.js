// about.js

// from 'utils.js'
/*   global feedbackURL */

const VERSION = chrome.runtime.getManifest().version
const YEAR = new Date().getFullYear()

// onload
$(function() {
  $('#version').text(VERSION)
  $('#year').text(YEAR)
  $('#reviews-page').attr('href', feedbackURL)
})
