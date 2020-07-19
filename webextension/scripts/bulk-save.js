// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, hostURL */

let bookmarksList = new Set()
let newSetLength = 0
let oldSetLength = 0

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
      bookmarksList.add(node.url)
      displayList(bookmarksList)
    }
  }
}

function importBookmarks() {
  $('#empty-list-err').hide()
  chrome.bookmarks.getTree((itemTree) => {
    itemTree.forEach((item) => {
        processNode(item)
    })
  })
}

function addToBulkList() {
  url = document.getElementById('add-url').value
  $('#empty-list-err').hide()
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    bookmarksList.add(url)
    displayList(bookmarksList)
  } else {
    alert(`The Wayback Machine cannot archive '${url}'.`)
  }
  document.getElementById('add-url').value = ''
}

function deleteFromBulkList(e) {
  if (e.target.classList.contains('delete-btn')) {
    let delUrl = e.target.nextElementSibling.innerText
    bookmarksList.delete(delUrl)
    e.target.parentElement.remove()
    oldSetLength--
  }
}

function initiateBulkSave() {
  if (bookmarksList && bookmarksList.size > 0) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      $('#list-container').off('click')
      $('#import-bookmarks').hide()
      $('#start-bulk-save').hide()
      $('#add').hide()
      $('.loader').show()
      $('#total-elements').text(bookmarksList.size)
      $('#total-saved').show()
      for (let item of Array.from([...bookmarksList])) {
        let url = item
        chrome.runtime.sendMessage({
          message: 'openurl',
          wayback_url: hostURL + 'save/',
          page_url: url,
          method: 'save',
          // tabId: tabs[0].id
        })
      }
    })
    trackStatus()
  } else {
    $('#empty-list-err').show()
  }
}

function trackStatus() {
  let saveSuccessCount = 0
  let saveFailedCount = 0
  chrome.runtime.onMessage.addListener(
    (message) => {
      msg = message.message
      url = message.url
      let items = $('.url-item')
      for (let i = 0; i < items.length; i++) {
        let listItemUrl = items[i].innerText
        if (msg === 'save_start' && url && listItemUrl === url) {
          items[i].previousElementSibling.innerText = ''
          items[i].previousElementSibling.style.backgroundColor = 'yellow'
        } else if (msg === 'save_success' && url && listItemUrl === url) {
          saveSuccessCount++
          $('#saved').show().children().text(saveSuccessCount)
          items[i].previousElementSibling.innerText = '✓'
          items[i].previousElementSibling.style.backgroundColor = 'green'
        } else if (msg === 'save_error' && url && listItemUrl === url) {
        saveFailedCount++
        $('#failed').show().children().text(saveFailedCount)
          items[i].previousElementSibling.innerText = '!'
          items[i].previousElementSibling.style.backgroundColor = 'red'
        }
      }
      if (saveSuccessCount + saveFailedCount === bookmarksList.size) {
        $('.loader').hide()
      }
    }
  )
}

$('#import-bookmarks').click(importBookmarks)
$('#start-bulk-save').click(initiateBulkSave)
$('#add-to-bulk').click(addToBulkList)
$('#list-container').click(deleteFromBulkList)