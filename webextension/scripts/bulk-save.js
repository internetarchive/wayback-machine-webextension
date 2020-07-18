// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, hostURL */

let bookmarksList = new Set()
let newSetLength = 0
let oldSetLength = 0

function displayList() {
  newSetLength = bookmarksList.size
  if (newSetLength > oldSetLength) {
    for (let item of Array.from([...bookmarksList]).slice(oldSetLength, newSetLength)) {
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
      displayList()
    }
  }
}

function importBookmarks() {
  chrome.bookmarks.getTree((itemTree) => {
    itemTree.forEach((item) => {
        processNode(item)
    })
  })
}

function addToBulkList() {
  url = document.getElementById('add-url').value
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    bookmarksList.add(url)
    displayList()
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
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    for (let item of Array.from([...bookmarksList])) {
      let url = item
      chrome.runtime.sendMessage({
        message: 'openurl',
        wayback_url: hostURL + 'save/',
        page_url: url,
        method: 'save',
        tabId: tabs[0].id
      })
    }
  })
}

$('#import-bookmarks').click(importBookmarks)
$('#start-bulk-save').click(initiateBulkSave)
$('#add-to-bulk').click(addToBulkList)
$('#list-container').click(deleteFromBulkList)