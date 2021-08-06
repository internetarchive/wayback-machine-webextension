// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, makeValidURL, cropPrefix, wmAvailabilityCheck, hostURL */

// max concurrent saves supported by SPN
// -1 allows SPN button to work at same time
const MAX_SAVES = 5 - 1
let bulkSaveObj = {} // { "cropped_url" : { url: "full_url", row: jQueryObj }}
let bulkSaveQueue = [] // array of cropped_url keys in the save queue
let saveSuccessCount = 0
let saveFailedCount = 0
let totalUrlCount = 0
let isSaving = false
let saveOptions = {}

/* * * UI * * */

// Change UI when Saving starts.
function startSaving() {
  isSaving = true
  $('#list-container').off('click')
  $('#bulk-save-btn').off('click').click(clearFocus)
  $('#not-logged-in').hide()
  $('.add-container').hide()
  $('.save-box').hide()
  $('#bulk-save-label').text('Archiving URLs...')
  $('#save-progress-bar').show()
  $('.count-container').show()
}

// Hide progress bar when Saving stops.
// msg = save button label.
function stopSaving() {
  isSaving = false
  $('#save-progress-bar').hide()
  $('#bulk-save-label').text('Save Finished')
  $('#bulk-save-btn').click(closeWindow)
}

// Reset UI
function resetUI() {
  $('.count-container').hide()
  $('.add-container').show()
  $('.save-box').show()
  $('#bulk-save-label').text('Start Bulk Save')
  $('#bulk-save-btn').click(doBulkSaveAll)
  $('#list-container').click(doRemoveURL)
}

// Removes focus outline on mouse click, while keeping during keyboard use.
function clearFocus() {
  document.activeElement.blur()
}

function closeWindow() {
  window.close()
}

/* * * Bookmarks * * */

// Click handler to import all bookmarks.
function doImportBookmarks(e) {
  $('#empty-list-err').hide()
  importAllBookmarks()
}

// Import all bookmarked URLs.
function importAllBookmarks() {
  let count_val = 0
  if (chrome.bookmarks) {
    chrome.bookmarks.getTree((nodeTree) => {
      nodeTree.forEach((node) => {
        count_val += processTreeNode(node)
      })
      if (count_val === 0) {
        alert('No Bookmarks Found.')
      }
    })
  }
}
// Traverses the bookmark tree nodes recursively.
function processTreeNode(node) {
  let count = 0
  // process child nodes
  if (node.children) {
    node.children.forEach((child) => { count += processTreeNode(child) })
  }
  // add bookmark URL from leaf node
  if (node.url && isValidUrl(node.url) && isNotExcludedUrl(node.url) && !isDuplicateURL(node.url)) {
    try {
      addToBulkSave(decodeURI(node.url))
      count++
    } catch(e) {
      console.log('Bookmark skipped: ', e)
    }
  }
  return count
}

/* * * Save List * * */

// Adds a URL to Bulk Save and appends it to #list-container.
function addToBulkSave(url) {
  let curl = cropPrefix(url)
  let $row = $('<div class="url-list flex-container">')
  let $del = $('<div class="delete-btn">').text('x')
  let $span = $('<div class="url-item">').text(url)
  $('#list-container').append($row.append($del, $span))
  bulkSaveObj[curl] = { url: url, row: $row }
}

// Click handler to Add URLs to Bulk Save.
function doAddURLs(e) {
  $('#empty-list-err').hide()
  let text = document.getElementById('add-url-area').value
  let c = 0
  let addedURLs = text.split('\n')
  for (let elem of addedURLs) {
    let url = makeValidURL(elem)
    if (url && !url.includes(' ') && isNotExcludedUrl(url) && !isDuplicateURL(url)) {
      addToBulkSave(url)
      c++
    }
  }
  if (c === 0) {
    alert('Please enter valid website addresses.')
  }
  document.getElementById('add-url-area').value = ''
}

// Click handler to Remove a URL from Bulk Save.
function doRemoveURL(e) {
  if (e.target.classList.contains('delete-btn')) {
    let curl = cropPrefix(e.target.nextElementSibling.innerText)
    delete bulkSaveObj[curl]
    e.target.parentElement.remove()
  }
}

// Click handler to Clear Bulk Save.
function doClearAll(e) {
  bulkSaveObj = {}
  $('#list-container').text('')
}

// Returns true if URL is already in Bulk Save.
function isDuplicateURL(url) {
  let curl = cropPrefix(url)
  return (curl in bulkSaveObj)
}

// Listens to SPN response messages from background.js.
function initMessageListener() {
  chrome.runtime.onMessage.addListener((message) => {
    if (message && message.error) {
      if (message.error.indexOf('logged in') !== -1) {
        // stop if user not logged in
        stopSaving()
        resetUI()
        $('#not-logged-in').show()
      } else if (message.error.indexOf('same snapshot') !== -1) {
        // snapshot already archived within timeframe
        processStatus('archived', message.url)
        checkIfFinished()
      }
    } else if (message) {
      // respond to message
      processStatus(message.message, message.url)
      checkIfFinished()
    }
  })
}

// Click handler to Start Bulk Save.
function doBulkSaveAll(e) {
  // prepare queue, exit if empty
  bulkSaveQueue = Object.keys(bulkSaveObj)
  if (bulkSaveQueue.length === 0) {
    $('#empty-list-err').show()
    return
  }
  // reset counts
  saveSuccessCount = 0
  saveFailedCount = 0
  totalUrlCount = bulkSaveQueue.length
  $('#total-count').text(totalUrlCount)
  // reset options
  saveOptions = {}
  // due to timeout issues, outlinks not supported right now
  // if ($('#chk-outlinks').prop('checked') === true) { saveOptions['capture_outlinks'] = 1 }
  if ($('#chk-screenshot').prop('checked') === true) { saveOptions['capture_screenshot'] = 1 }
  if ($('#never-saved').prop('checked') === true) { saveOptions['if_not_archived_within'] = '99999d' }
  // start saving concurrently
  startSaving()
  for (let i = 0; i < MAX_SAVES; i++) {
    saveNextInQueue()
  }
}

// Pop next URL to save off the queue.
function saveNextInQueue() {
  let curl = bulkSaveQueue.shift()
  if (curl && (curl in bulkSaveObj)) {
    let saveUrl = bulkSaveObj[curl].url
    saveTheURL(saveUrl)
  }
}

// Send a Save message to background.js.
function saveTheURL(url) {
  chrome.runtime.sendMessage({
    message: 'openurl',
    wayback_url: hostURL + 'save/',
    page_url: url,
    options: saveOptions,
    method: 'save',
    silent: true
  })
}

// Show the Save Status (saving, success, error) in UI.
// $row is a jQuery object
function updateRow($row, symbol, bgcolor) {
  let $del = $row.children('.delete-btn').first()
  $del.text(symbol)
  $del.css('background-color', bgcolor)
}

// Update an individual URL item in the list container.
function processStatus(msg, url) {
  let curl = cropPrefix(url)
  if (curl && (curl in bulkSaveObj)) {
    let $row = bulkSaveObj[curl].row
    if ($row) {
      if (msg === 'save_start') {
        updateRow($row, '', 'yellow')
      } else if (msg === 'save_success') {
        updateRow($row, '✔', 'green')
        saveSuccessCount++
        $('#saved-count').text(saveSuccessCount)
        saveNextInQueue()
      } else if (msg === 'save_error') {
        updateRow($row, '!', 'red')
        saveFailedCount++
        $('#failed-count').text(saveFailedCount)
        saveNextInQueue()
      } else if (msg === 'archived') {
        // url was already archived
        updateRow($row, '•', 'green')
        saveSuccessCount++
        $('#saved-count').text(saveSuccessCount)
        saveNextInQueue()
      }
    }
  }
}

// Stop saving when counts reach total count.
function checkIfFinished() {
  if (isSaving && (saveSuccessCount + saveFailedCount >= totalUrlCount)) {
    stopSaving()
  }
}

function main() {
  $('.btn').click(clearFocus)
  $('#add-url-btn').click(doAddURLs)
  $('#import-bookmarks-btn').click(doImportBookmarks)
  $('#clear-all-btn').click(doClearAll)
  resetUI()
  initMessageListener()
}

main()
