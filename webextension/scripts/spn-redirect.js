// spn-redirect.js
console.log('spn-redirect.js start') // DEBUG

// submits a POST form to open SPN Wayback Machine website with url prefilled.
let params = (new URL(window.location)).searchParams
console.log(params) // DEBUG
let url = params.get('url')
console.log(url) // DEBUG
document.getElementById('url-preload').value = url
// document.getElementById('save-form').submit()
console.log('waiting') // DEBUG

// TEST
setTimeout(() => {
  console.log('submit form') // DEBUG
  // BUG in Safari: form is not POSTing url_preload! (neither private nor normal modes)
  document.getElementById('save-form').submit()
}, 20000)
