// archive.js
// do NOT use jQuery in this file

let gCloseClicked = false
let gArchiveClicked = false
let gShadowRoot
const ERROR_CODE_DIC = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  405: 'Method Not Allowed',
  406: 'Not Acceptable',
  407: 'Proxy Auth Required',
  408: 'Request Timeout',
  410: 'Page Gone',
  429: 'Too Many Requests',
  451: 'Unavailable',
  500: 'Internal Server Error',
  502: 'Bad Gateway',
  503: 'Service Unavailable',
  504: 'Gateway Timeout',
  509: 'Bandwidth Limit Exceeded',
  520: 'Unknown Error',
  521: 'Server Is Down',
  522: 'Connection Timed Out',
  523: 'Unreachable Origin',
  524: 'Timout Occurred',
  525: 'SSL Handshake Failed',
  526: 'Invalid SSL Certificate',
  999: 'Server Not Found'
}

// appending css to the popup
function appendStyle() {
  const url = chrome.runtime.getURL('css/archive.css')
  return `<link rel="stylesheet" type="text/css" href=${url}>`
}

// appending the actual dom of popup
function appendHTML(url, code) {
  const title = ((code < 999) ? code + ' ' : '') + (ERROR_CODE_DIC[code] || 'Error')
  const close = chrome.runtime.getURL('images/close.svg')
  const logo = chrome.runtime.getURL('images/wayback-light.png')
  return `
    <div id="popup-container">
      <div id="title-txt">${title}</div>
      <img id="close-btn" src=${close}>
      <p>View a saved version courtesy of the</p>
      <img class="wm-logo" alt="Internet Archive Wayback Machine" src=${logo}>
      <a href=${url} id="archive-btn">View Archived Version</a>
    </div>`
}

function popupWayback(url, code) {
  // Using shadow DOM to encapsulate the popup
  const container = document.createElement('div')
  container.id = 'waybackmachine-container'
  gShadowRoot = container.attachShadow({ mode: 'open' })
  gShadowRoot.innerHTML = appendStyle() + appendHTML(url, code)
  document.body.insertAdjacentElement('beforeend', container)

  // Adding functionality to close and archive button
  gShadowRoot.querySelector('#close-btn')?.addEventListener('click', () => {
    gCloseClicked = true
    gShadowRoot.querySelector('#popup-container')?.style.display = 'none'
  })

  gShadowRoot.querySelector('#archive-btn')?.addEventListener('click', (e) => {
    gArchiveClicked = true
    // Work-around for myspace which hijacks the link
    if (window.location.hostname.indexOf('myspace.com') >= 0) {
      e.preventDefault()
      return false
    }
  })
}

// Polling for DOM update
function refreshWayback(url, code) {
  const container = document.querySelector('#waybackmachine-container')
  if (!gCloseClicked && !gArchiveClicked && !container) {
    popupWayback(url, code)
    setTimeout(() => { refreshWayback(url, code) }, 500)
  }
}

// Listens to SHOW_BANNER messages
chrome.runtime.onMessage.addListener(
  (request, sender, sendResponse) => {
    if (request.type === 'SHOW_BANNER' && ('status_code' in request) && ('wayback_url' in request)) {
      refreshWayback(request.wayback_url, request.status_code)
    }
  }
)
