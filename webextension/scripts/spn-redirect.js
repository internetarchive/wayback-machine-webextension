// spn-redirect.js

// submits a POST form to open SPN Wayback Machine website with url prefilled.
let params = (new URL(window.location)).searchParams;
let url = params.get('url');
document.getElementById('url-preload').value = url
document.getElementById('save-form').submit()
