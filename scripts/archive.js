// archive.js

let closeClicked = false
let linkClicked = false
let shadowRoot
const ERROR_CODE_DIC = {
  404: '404 Page not found',
  408: '408 Page request timeout',
  410: '410 Page has gone',
  451: '451 Page is illegal',
  500: '500 Server error',
  502: '502 Bad gateway',
  503: '503 Service unavailable',
  504: '504 Gateway timeout',
  509: '509 Bandwidth limit exceeded',
  520: '520 Unknown error',
  521: '521 Server is down',
  523: '523 Unreachable Origin',
  524: '524 Timout occurred',
  525: '525 SSL Handshake Failed',
  526: '526 Invalid SSL Certificate',
  999: 'DNS Error'
}
console.log('client inject')

// appending css to the popup
function appendStyle() {
  const url = chrome.extension.getURL('css/archive.css')
  return `<link rel="stylesheet" type="text/css" href=${url}>`
}

// appending the actual dom of popup
function appendHTML(url, code) {
  const logo = chrome.extension.getURL('images/logo.gif')
  const close = chrome.extension.getURL('images/close.svg')
  const info = ERROR_CODE_DIC[code]
  return `
        <div id="error">
            <div id="txt">${info}</div>
            <img id="close" src=${close}>
            <img id="logo" src=${logo}>
            <a href=${url} id="archiveBtn">view archived version</a>
        </div>
        `
}

function popup(url, code) {
  document.head.insertAdjacentHTML('beforeend', appendStyle())
  // Using shadow DOM to encapsulate the popup
  const container = document.createElement('div')
  container.id = 'waybackmachineContainer'
  shadowRoot = container.attachShadow({ mode: 'open' })
  shadowRoot.innerHTML = appendStyle() + appendHTML(url, code)
  document.body.insertAdjacentElement('beforeend', container)

  // Adding functionality to close and archive button
  const closeBtn = shadowRoot.querySelector('#close')
  closeBtn.addEventListener('click', function() {
    closeClicked = true
    const popup = shadowRoot.querySelector('#error')
    popup.style.display = 'none'
  })

  const link = shadowRoot.querySelector('#archiveBtn')
  link.addEventListener('click', function(e) {
    linkClicked = true
    // Work-around for myspace which hijacks the link
    if (window.location.hostname.indexOf('myspace.com') >= 0) {
      e.preventDefault()
      return false
    }
  })
}

// Polling for dom update
function refresh(url, code) {
  const container = document.querySelector('#waybackmachineContainer')
  if (!closeClicked && !linkClicked && !container) {
    popup(url, code)
    setTimeout(() => { refresh(url, code) }, 500)
  }
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.type === 'SHOW_BANNER') {
      if (request.wayback_url) {
        refresh(request.wayback_url, request.status_code)
      }
    }
  }
)
