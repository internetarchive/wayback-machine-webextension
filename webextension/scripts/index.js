/* imports only, required to build scripts/build.js using webpack */
import 'bootstrap'
// don't know why this css isn't already included
import 'bootstrap/dist/css/bootstrap.min.css'
//import 'bootstrap/dist/css/bootstrap-theme.min.css'

global.$ = require('jquery')
global.jQuery = require('jquery')
global.Levenshtein = require('fast-levenshtein')
global.jsSHA = require('jssha')
