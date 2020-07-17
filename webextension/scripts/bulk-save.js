let bookmarksList = new Set()
let newSetLength = 0
let oldSetLength = 0

function displayList() {
  newSetLength = bookmarksList.size
  if (newSetLength > oldSetLength) {
    for (let item of Array.from([...bookmarksList]).slice(oldSetLength, newSetLength)) {
      $('#list-container').append(
        $('<p>').append(item)
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

  // acces leaf nodes URLs
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
  }
  else {
    alert(`The Wayback Machine cannot archive '${url}'.`)
  }
  document.getElementById('add-url').value = ''
}

function initiateBulkSave() {
}

$('#import-bookmarks').click(importBookmarks)
$('#start-bulk-save').click(initiateBulkSave)
$('#add-to-bulk').click(addToBulkList)