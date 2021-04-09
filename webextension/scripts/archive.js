// archive.js

let gCloseClicked = false
let gArchiveClicked = false
let gShadowRoot
const ERROR_CODE_DIC = {
  404: '404 Page Not Found',
  408: '408 Page Request Timeout',
  410: '410 Page Has Gone',
  451: '451 Page Is Illegal',
  500: '500 Server Error',
  502: '502 Bad Gateway',
  503: '503 Service Unavailable',
  504: '504 Gateway Timeout',
  509: '509 Bandwidth Limit Exceeded',
  520: '520 Unknown Error',
  521: '521 Server Is Down',
  523: '523 Unreachable Origin',
  524: '524 Timout Occurred',
  525: '525 SSL Handshake Failed',
  526: '526 Invalid SSL Certificate',
  999: 'Server Not Found'
}

// appending css to the popup
function appendStyle() {
  const url = chrome.extension.getURL('css/archive.css')
  return `<link rel="stylesheet" type="text/css" href=${url}>`
}

// appending the actual dom of popup
function appendHTML(url, code) {
  const title = ERROR_CODE_DIC[code]
  const close = chrome.extension.getURL('images/close.svg')
  const logo = chrome.extension.getURL('images/wayback-light.png')
  const caption = 'View a saved version courtesy of the'
  const archive = 'View Archived Version'
  return `
    <div id="popup-container">
      <div id="title-txt">${title}</div>
      <img id="close-btn" src=${close}>
      <p>${caption}</p>
      <img class="wm-logo" alt="Internet Archive Wayback Machine" src=${logo}>
      <a href=${url} id="archive-btn">${archive}</a>
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
  const closeBtn = gShadowRoot.querySelector('#close-btn')
  closeBtn.addEventListener('click', () => {
    gCloseClicked = true
    let popup = gShadowRoot.querySelector('#popup-container')
    popup.style.display = 'none'
  })

  const archiveBtn = gShadowRoot.querySelector('#archive-btn')
  archiveBtn.addEventListener('click', (e) => {
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
    if (request.type === 'SHOW_BANNER') {
      if (request.wayback_url) {
        refreshWayback(request.wayback_url, request.status_code)
      }
    }
  }
)
