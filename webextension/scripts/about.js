//about.js

// from 'utils.js'
/*   global feedbackPageURL */
const VERSION = chrome.runtime.getManifest().version
const DATE = new Date().getFullYear()
$('#version').text(VERSION)
$('#year').text(DATE)
$('#reviews-page').attr('href', feedbackPageURL)
