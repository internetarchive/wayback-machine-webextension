// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, wmAvailabilityCheck, hostURL */

let urlList = new Set()
let newSetLength = 0
let oldSetLength = 0
let saveSuccessCount
let saveFailedCount
let totalUrlCount
let isSaving = false

function displayList(list) {
  newSetLength = list.size
  if (newSetLength > oldSetLength) {
    for (let item of Array.from([...list]).slice(oldSetLength, newSetLength)) {
      let row = $('<div class="url-list flex-container">')
      let del = $('<div class="delete-btn">').text('x')
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

// add URLs to the list
function addToBulkList(e) {
    let urls = document.getElementById('add-url-area').value
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
      alert('Please enter valid website addresses.')
    }
    document.getElementById('add-url-area').value = ''
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

// clear all URLs from the list
function clearBulkList() {
  urlList.clear()
  oldSetLength = 0
  newSetLength = 0
  $('#list-container').text('')
}

// clear the UI (remove buttons and other options) while saving URLs
function clearUI() {
  $('#list-container').off('click')
  $('.save-box').hide()
  $('.add-container').hide()
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
        isSaving = false
        hideSaving('Start Bulk Save')
        $('#bulk-save-btn').click(doBulkSaveAll)
        // $('.save-box').show() // TODO: Currently not implemented
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

function doBulkSaveAll() {
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
        // TODO: FIXME: Option not implemented!
        if ($('#never-saved').prop('checked') === true) {
          wmCheck(saveUrl, i)
            .then(() => {})
            .catch(() => {})
        } else {
          // save all URLs
          if ((i === 0) && !isSaving){
            isSaving = true
            showSaving()
          }
          saveTheURL(saveUrl, i)
        }
      }
    }
    messageListener(urlListArray, i)
  } else {
    $('#empty-list-err').show()
  }
}

// save the URL
function saveTheURL(url, index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: hostURL + 'save/',
      page_url: url,
      method: 'save',
      isBulkSave: 'true'
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
  $('#total-count').text(totalUrlCount)
  $('.count-container').show()
  chrome.runtime.onMessage.addListener(
    (message) => {
      let msg = message.message
      let url = message.url
      let items = $('.url-item')
      if (items[index]) {
        let listItemUrl = items[index].innerText
        if (msg === 'save_start' && listItemUrl === url) {
          updateStatus(items[index], '', 'yellow')
        } else if (msg === 'save_success' && listItemUrl === url) {
          saveSuccessCount++
          $('#saved-count').text(saveSuccessCount)
          updateStatus(items[index], '✔', 'green')
        } else if (msg === 'save_error' && (listItemUrl === url)) {
          saveFailedCount++
          $('#failed-count').text(saveFailedCount)
          updateStatus(items[index], '!', 'red')
        }
      }
      if (isSaving && (saveSuccessCount + saveFailedCount === totalUrlCount)) {
        isSaving = false
        hideSaving('Save Finished')
      }
    }
  )
}

function showSaving() {
  $('#bulk-save-btn').off('click')
  $('#save-progress-bar').show()
  $('#bulk-save-label').text('Archiving URLs...')
}

function hideSaving(msg) {
  $('#save-progress-bar').hide()
  $('#bulk-save-label').text(msg)
}

$('.save-box').hide() // TODO: Remove once this is implemented

$('#import-bookmarks-btn').click(importBookmarks)
$('#bulk-save-btn').click(doBulkSaveAll)
$('#list-container').click(deleteFromBulkList)
$('#add-url-btn').click(addToBulkList)
$('#clear-all-btn').click(clearBulkList)
