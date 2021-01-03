// about.js

// from 'utils.js'
/*   global feedbackURL */
const VERSION = browser.runtime.getManifest().version
const DATE = new Date().getFullYear()
$('#version').text(VERSION)
$('#year').text(DATE)
$('#reviews-page').attr('href', feedbackURL)
