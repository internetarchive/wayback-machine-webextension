// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, wmAvailabilityCheck, hostURL */

let urlList = new Set()
let newSetLength = 0
let oldSetLength = 0
let saveSuccessCount
let saveFailedCount
let totalUrlCount

function displayList(list) {
  newSetLength = list.size
  if (newSetLength > oldSetLength) {
    for (let item of Array.from([...list]).slice(oldSetLength, newSetLength)) {
      let row = $('<div class="url-list flex-container">')
      let del = $('<div class="delete-btn">').text('X')
      let span = $('<div class="url-item">').append(item)

      $('#list-container').append(
        row.append(del, span)
      )
    }
    oldSetLength = newSetLength
  }
}

function processNode(node) {
  // recursively process child nodes
  if (node.children) {
    node.children.forEach((child) => { processNode(child) })
  }

  // access leaf nodes: Bookmarked URLs
  if (node.url) {
    if (isValidUrl(node.url) && isNotExcludedUrl(node.url)) {
      if(!isDuplicateURL(node.url)) {
        urlList.add(node.url)
        displayList(urlList)
      }
    }
  }
}

// import all bookmarked URLs
function importBookmarks() {
  $('#empty-list-err').hide()
  if (chrome.bookmarks) {
    chrome.bookmarks.getTree((itemTree) => {
      itemTree.forEach((item) => {
          processNode(item)
      })
    })
  }
}

// add URL to the list
function addToBulkList(e) {
  if ((e.keyCode === 13 || e.which === 13)) {
    let urls = document.getElementById('add-url').value
    $('#empty-list-err').hide()
    if (urls.includes('.')) {
      let addedURLs = []
      if (urls.includes('\n')) { addedURLs = urls.split('\n') }
      for (let elem of addedURLs) {
        if (elem !== ''  && isNotExcludedUrl(elem)) {
          if (!isDuplicateURL(elem)) { urlList.add(makeValidURL(elem)) }
        }
      }
      displayList(urlList)
    } else {
      alert(`The Wayback Machine cannot archive '${urls}'.`)
    }
    document.getElementById('add-url').value = ''
  }
}

// delete URL from the list
function deleteFromBulkList(e) {
  if (e.target.classList.contains('delete-btn')) {
    let delUrl = e.target.nextElementSibling.innerText
    urlList.delete(delUrl)
    e.target.parentElement.remove()
    oldSetLength--
  }
}

// clear the UI (remove buttons and other options) while saving URLs
function clearUI() {
  $('#list-container').off('click')
  $('#import-bookmarks').hide()
  $('.save-box').hide()
  $('#add').hide()
}

// crop URL
function cropURL(url) {
  let pos = 0
  if (url.slice(-1) === '/') { url = url.slice(0, -1) }
  if (url.includes('://')) {
    if (url.includes('://www.')) {
      pos = url.indexOf('://www.')
      return url.substring(pos + 7)
    } else pos = url.indexOf('://')
    return url.substring(pos + 3)
  } else if (!url.includes('://')) {
    if (url.includes('www.')) {
      pos = url.indexOf('www.')
      return url.substring(pos + 4)
    } else return url
  }
}

// check for duplicate URLs
function isDuplicateURL(url, list = urlList) {
  let newURL = cropURL(url)
  for (let elem of list) {
    let newElem = cropURL(elem)
    if (newURL === newElem) { return true}
  }
  return false
}

// check availability
function wmCheck(url, index) {
  return new Promise((resolve, reject) => {
    wmAvailabilityCheck(url, () => {
    }, () => {
      initiateBulkSave(url, index)
    })
    resolve()
  })
}

// listen to messages then save more URLs
function messageListener(urlArray, index) {
  chrome.runtime.onMessage.addListener(
    (message) => {
      // cancel save if user is not logged in
      if (message && message.error && message.error === 'You need to be logged in to use Save Page Now.') {
        $('.loader').hide()
        $('.save-box').show()
        $('#not-logged-in').show()
      } else {
        // continue save
        $('#not-logged-in').hide()
        msg = message.message
        // save next URL only when previous saving job is terminated (success/fail)
        if (msg === 'save_success' ||  msg === 'save_error') {
          if (urlArray[index]) {
            let saveUrl = urlArray[index]
            if ($('#never-saved').prop('checked') === true) {
              wmCheck(saveUrl, index)
                .then(() => {})
                .catch(() => {})
            } else {
              initiateBulkSave(saveUrl, index)
            }
            index++
          }
        }
      }
    }
  )
}

function setUpBulkSave() {
  saveSuccessCount = 0
  saveFailedCount = 0
  totalUrlCount = 0
  if (urlList && urlList.size > 0) {
    let i = 0
    let j = 5
    clearUI()
    let urlListArray = Array.from([...urlList])
    for (i = 0; i < j; i++) {
      if (urlListArray[i]) {
        let saveUrl = urlListArray[i]
        // filter and save if saving only never saved URLs
        if ($('#never-saved').prop('checked') === true) {
          wmCheck(saveUrl, i)
            .then(() => {})
            .catch(() => {})
        } else {
          // save all URLs
          initiateBulkSave(saveUrl, i)
        }
      }
    }
    messageListener(urlListArray, i)
  } else {
    $('#empty-list-err').show()
  }
}

// save the URL
function initiateBulkSave(url, index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: hostURL + 'save/',
      page_url: url,
      method: 'save'
      // tabId: tabs[0].id
    })
  })
  trackStatus(index)
}

// show the save status (saving, success, error) in UI
function updateStatus(urlIndex, symbol, bgcolor) {
  urlIndex.previousElementSibling.innerText = symbol
  urlIndex.previousElementSibling.style.backgroundColor = bgcolor
}

// track the save status
function trackStatus(index) {
  totalUrlCount++
  $('#total-elements').children().text(totalUrlCount)
  $('#total-saved').show()
  chrome.runtime.onMessage.addListener(
    (message) => {
      let msg = message.message
      let url = message.url
      let err = message.error
      let items = $('.url-item')
      if (items[index]) {
        let listItemUrl = items[index].innerText
        let posUrl
        let posHost
        let errorUrl
        if (listItemUrl.includes('://')) {
          posUrl = listItemUrl.indexOf('://')
          errorUrl = listItemUrl.slice(posUrl + 3)
          if (errorUrl.includes('/')) {
            posHost = errorUrl.indexOf('/')
          }
        }
        let errorHost = errorUrl.slice(0, posHost)
        if (msg === 'save_start' && listItemUrl === url) {
          $('.loader').show()
          updateStatus(items[index], '', 'yellow')
        } else if (msg === 'save_success' && listItemUrl === url) {
          saveSuccessCount++
          $('#saved').show().children().text(saveSuccessCount)
          updateStatus(items[index], '✓', 'green')
        } else if (msg === 'save_error' && (listItemUrl === url || err.includes(errorUrl))) {
          saveFailedCount++
          $('#failed').show().children().text(saveFailedCount)
          updateStatus(items[index], '!', 'red')
        }
      }
      if (saveSuccessCount + saveFailedCount === totalUrlCount) {
        $('.loader').hide()
      }
    }
  )
}

$('#import-bookmarks').click(importBookmarks)
$('#start-bulk-save').click(setUpBulkSave)
$('#list-container').click(deleteFromBulkList)
$('#add-url').keyup(addToBulkList)