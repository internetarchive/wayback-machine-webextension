// about.js

// from 'utils.js'
/*   global feedbackURL */
const VERSION = chrome.runtime.getManifest().version
const date = new Date().getFullYear()
$('#version').text(VERSION)
$('#year').text(date)
$('#reviews-page').attr('href', feedbackURL)
