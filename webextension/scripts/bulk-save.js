// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, openByWindowSetting, checkAuthentication, wmAvailabilityCheck, hostURL */

let urlList = new Set()
let newSetLength = 0
let oldSetLength = 0
let saveSuccessCount = 0
let saveFailedCount = 0
let totalUrlCount = 0

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
      urlList.add(node.url)
      displayList(urlList)
    }
  }
}

// import all bookmarked URLs
function importBookmarks() {
  $('#empty-list-err').hide()
  chrome.bookmarks.getTree((itemTree) => {
    itemTree.forEach((item) => {
        processNode(item)
    })
  })
}

// add URL to the list
function addToBulkList() {
  url = document.getElementById('add-url').value
  $('#empty-list-err').hide()
  if (url.includes('.') && isNotExcludedUrl(url)) {
    urlList.add(makeValidURL(url))
    displayList(urlList)
  } else {
    alert(`The Wayback Machine cannot archive '${url}'.`)
  }
  document.getElementById('add-url').value = ''
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
  $('.loader').show()
}

function wmCheck(url, index) {
  new Promise((resolve, reject) => {
    wmAvailabilityCheck(url, () => {
    }, () => {
      initiateBulkSave(url, index)
    })
  })
}

// filter out URLs if any checkbox is selected
function setUpBulkSave() {
  if (urlList && urlList.size > 0) {
    let i = 0
    let j = 5
    clearUI()
    let urlListArray = Array.from([...urlList])
    for (i = 0; i < j; i++) {
      if (urlListArray[i]) {
        let saveUrl = urlListArray[i]
        if ($('#never-saved').prop('checked') === true) {
          wmCheck(saveUrl, i)
        } else {
          initiateBulkSave(saveUrl, i)
        }
      }
    }
    chrome.runtime.onMessage.addListener(
      (message) => {
        // cancel save if user is not logged in
        if (message && message.error && message.error === 'You need to be logged in to use Save Page Now.') {
          $('.loader').hide()
          $('.save-box').show()
          $('#not-logged-in').show()
        } else {
          ('#not-logged-in').hide()
          // continue save
          msg = message.message
          if (msg === 'save_success' ||  msg === 'save_error') {
            if (i < urlListArray.length) {
              let saveUrl = urlListArray[i]
              if ($('#never-saved').prop('checked') === true) {
                wmAvailabilityCheck(saveUrl, () => {
                }, () => {
                  initiateBulkSave(saveUrl, i)
                })
              } else {
                initiateBulkSave(saveUrl, i)
              }
              i++
            }
          }
        }
      }
    )
  } else {
    $('#empty-list-err').show()
  }
}

// save the URLs
function initiateBulkSave(url, index) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: hostURL + 'save/',
      page_url: url,
      method: 'save',
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
      msg = message.message
      url = message.url
      let items = $('.url-item')
      if (items[index]) {
        let listItemUrl = items[index].innerText
        if (msg === 'save_start' && listItemUrl === url) {
          updateStatus(items[index], '', 'yellow')
        } else if (msg === 'save_success' && listItemUrl === url) {
          saveSuccessCount++
          $('#saved').show().children().text(saveSuccessCount)
          updateStatus(items[index], '✓', 'green')
        } else if (msg === 'save_error' && listItemUrl === url) {
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
$('#add-to-bulk').click(addToBulkList)
$('#list-container').click(deleteFromBulkList)