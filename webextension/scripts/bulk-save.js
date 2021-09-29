// bulk-save.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, makeValidURL, cropPrefix, dateToTimestamp */

// set this value to limit number of URLs per round
let bulkSaveLimit = 25

// max concurrent saves supported by SPN
// -1 allows SPN button to work at same time
const MAX_SAVES = 5 - 1
const S_NONE = 0, S_SAVING = 1, S_DONE = 2, S_FAILED = 3
let bulkSaveMap = new Map()
// { "cropped_url" : { url: "full_url", row: jQueryObj, status: S_?, wburl: "wayback_url" }}
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
  $('#add-container').hide()
  $('#save-options-container').hide()
  $('#bulk-save-label').text('Archiving URLs...')
  $('#pause-btn').show()
  $('#pause-btn').click(pauseSaving)
  $('#save-progress-bar').show()
  $('#list-toolbar').show()
  $('#main-info').text('Archiving to the Wayback Machine...')
}

// Hide progress bar when Saving stops.
function stopSaving() {
  isSaving = false
  $('#add-container').hide()
  $('#save-options-container').hide()
  $('#save-progress-bar').hide()
  $('#pause-btn').hide()
  $('#bulk-save-label').text('Done')
  $('#bulk-save-btn').click(closeWindow)
  $('#list-container').off('click')
  $('#main-info').text('Done - Click on a link to view on the Wayback Machine.')
}

function pauseSaving() {
  isSaving = false
  $('#add-container').show()
  $('#save-progress-bar').hide()
  $('#pause-btn').hide()
  $('#bulk-save-label').text('Continue Bulk Save')
  $('#bulk-save-btn').click(doContinue)
  $('#list-container').click(doRemoveURL)
  $('#main-info').text('Archiving Paused. You may add or remove URLs.')
}

// Reset UI
function resetUI() {
  $('#pause-btn').hide()
  $('#list-toolbar').hide()
  $('#save-progress-bar').hide()
  $('#add-container').show()
  $('#save-options-container').show()
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
      updateCounts()
    })
  }
}

// Traverses the bookmark tree nodes recursively, adding URLs to Bulk Save.
// Returns count of URLs added.
//
function processTreeNode(node) {
  let count = 0
  // process child nodes
  if (node.children) {
    node.children.forEach((child) => { count += processTreeNode(child) })
  }
  // add bookmark URL from leaf node
  try {
    const url = decodeURI(node.url)
    if (url && isValidUrl(url) && isNotExcludedUrl(url) && !isDuplicateURL(url)) {
      addToBulkSave(url)
      count++
    } else {
      console.log('Bookmark skipped: ' + url)
    }
  } catch (e) {
    console.log(e)
  }
  return count
}

/* * * Save List * * */

function clearBulkSave() {
  bulkSaveMap = new Map()
  bulkSaveQueue = []
  saveSuccessCount = 0
  saveFailedCount = 0
  totalUrlCount = 0
}

// Adds a URL to Bulk Save and appends it to #list-container.
function addToBulkSave(url) {
  let curl = cropPrefix(url)
  if (curl) {
    let $row = $('<div class="url-list display-flex">')
    let $del = $('<div class="status-btn">').text('x')
    let $span = $('<div class="url-item">').text(url)
    $('#list-container').append($row.append($del, $span))
    bulkSaveMap.set(curl, { url: url, row: $row, status: S_NONE })
    bulkSaveQueue.push(curl)
  }
}

function removeFromBulkSave(url) {
  let curl = cropPrefix(url)
  if (curl && bulkSaveMap.has(curl)) {
    let obj = bulkSaveMap.get(curl)
    if (obj.status === S_DONE) {
      saveSuccessCount--
    } else if (obj.status === S_FAILED) {
      saveFailedCount--
    }
    bulkSaveMap.delete(curl)
  }
}

// Resets all pending (yellow) and failed URLs stored in bulkSaveMap, re-adds them to the queue.
function resetAllInBulkSave() {
  for (let [curl, obj] of bulkSaveMap.entries()) {
    let $row = obj.row
    if ($row && ((obj.status === S_SAVING) || (obj.status === S_FAILED))) {
      updateRow($row, '', 'purple')
      bulkSaveQueue.push(curl)
    }
  }
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
  updateCounts()
}

// Click handler to Remove a URL from Bulk Save.
function doRemoveURL(e) {
  if (e.target.classList.contains('status-btn')) {
    removeFromBulkSave(e.target.nextElementSibling.innerText)
    e.target.parentElement.remove()
    updateCounts()
  }
}

// Click handler to Clear Bulk Save.
function doClearAll(e) {
  $('#list-container').text('')
  clearBulkSave()
  updateCounts()
}

// Returns true if URL is already in Bulk Save.
function isDuplicateURL(url) {
  let curl = cropPrefix(url)
  return bulkSaveMap.has(curl)
}

// Listens to SPN response messages from background.js.
function initMessageListener() {
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg && msg.error) {
      if (msg.error.indexOf('logged in') !== -1) {
        // stop if user not logged in
        isSaving = false
        resetUI()
        $('#not-logged-in').show()
      } else if (msg.error.indexOf('same snapshot') !== -1) {
        // snapshot already archived within timeframe
        // since no timestamp sent from API, use current time
        let timestamp = dateToTimestamp(new Date())
        let wbUrl = `https://web.archive.org/web/${timestamp}/${msg.url}`
        processStatus('save_archived', msg.url, wbUrl)
        checkIfFinished()
      }
    } else if (msg) {
      // respond to message
      let wbUrl = `https://web.archive.org/web/${msg.timestamp}/${msg.url}`
      processStatus(msg.message, msg.url, wbUrl)
      checkIfFinished()
    }
  })
}

// Click handler to Start Bulk Save.
function doBulkSaveAll(e) {
  // reset counts
  saveSuccessCount = 0
  saveFailedCount = 0
  updateCounts()
  if (totalUrlCount === 0) {
    $('#empty-list-err').show()
    return
  }
  // reset options
  saveOptions = {}
  // due to timeout issues, outlinks not supported right now
  // if ($('#chk-outlinks').prop('checked') === true) { saveOptions['capture_outlinks'] = 1 }
  if ($('#chk-screenshot').prop('checked') === true) { saveOptions['capture_screenshot'] = 1 }
  const savedWithin = $('#saved-within-opt').val() || '99999d'
  if ($('#saved-within-chk').prop('checked') === true) { saveOptions['if_not_archived_within'] = savedWithin }
  // start saving concurrently
  startSaving()
  for (let i = 0; i < MAX_SAVES; i++) {
    saveNextInQueue()
  }
}

// Click handler to Continue Bulk Save.
function doContinue(e) {
  updateCounts()
  if (totalUrlCount === 0) {
    $('#empty-list-err').show()
  } else {
    resetAllInBulkSave()
    startSaving()
    for (let i = 0; i < MAX_SAVES; i++) {
      saveNextInQueue()
    }
  }
}

// Pop next URL to save off the queue.
function saveNextInQueue() {
  if (!isSaving) { return }
  checkIfFinished()
  let curl = bulkSaveQueue.shift()
  if (curl) {
    if (bulkSaveMap.has(curl)) {
      const obj = bulkSaveMap.get(curl)
      saveTheURL(obj.url)
    } else {
      // rare, but could happen if user clicks on status-btn while bulk save in progress.
      // in that case, we want to prevent getting stuck.
      saveNextInQueue()
    }
  }
}

// Send a Save message to background.js.
function saveTheURL(url) {
  chrome.runtime.sendMessage({
    message: 'saveurl',
    page_url: url,
    options: saveOptions,
    silent: true
  }, () => {
    if (chrome.runtime.lastError) { /* skip */ }
  })
}

// Show the Save Status (saving, success, error) in UI.
// $row is a jQuery object.
// url is the url to save. (optional)
// wbUrl is the wayback URL of saved url. (optional)
//
function updateRow($row, symbol, bgcolor, url, wbUrl) {
  let $del = $row.children('.status-btn').first()
  $del.text(symbol)
  $del.css('background-color', bgcolor)
  if (url && wbUrl) {
    // replace url-item text with a wayback link.
    // all this needed to open in a new window in Safari.
    let $span = $row.children('.url-item').first()
    let $ahref = $(`<a href="${wbUrl}">${url}</a>`)
    $ahref.click(function(e) {
      e.preventDefault()
      window.open(this.href, '_blank')
    })
    $span.empty()
    $span.append($ahref)
  }
}

function updateCounts() {
  totalUrlCount = bulkSaveMap.size
  $('#saved-count').text(saveSuccessCount)
  $('#failed-count').text(saveFailedCount)
  $('#total-count').text(totalUrlCount)
  updateLimitCount()
}

// updates UI for any bulk save limits
function updateLimitCount() {
  // max count
  let countLeft = bulkSaveLimit - totalUrlCount
  if (bulkSaveLimit === 0) {
    // bulk save is unavailable
    $('#error-msg').text('Bulk Save is currently Unavailable!')
    $('#bulk-save-label').text('Close')
    $('#bulk-save-btn').click(closeWindow)
    $('#add-container').find('*').attr('disabled', true)
    $('#save-options-container').find('*').attr('disabled', true)
  } else if (bulkSaveLimit < 0) {
    // no limits if negative
    $('#limit-count-info').text(`${totalUrlCount}`)
  } else {
    // show count limits
    $('#limit-count-info').text(`${countLeft} left out of ${bulkSaveLimit}`)
    if (countLeft < 0) {
      $('#limit-count-info').addClass('highlight-color')
      $('#bulk-save-btn').attr('disabled', true)
    } else {
      $('#limit-count-info').removeClass('highlight-color')
      $('#bulk-save-btn').removeAttr('disabled')
    }
  }
}

/**
 * Fetches Limit Count from API & updates bulkSaveLimit.
 * expects API to return: { "bulk-save-max": 100 }
 * @return Promise
 */
function fetchLimitCount() {
  // may need a random number added to url avoid caching?
  const url = '' // TODO: enter URL of API here
  const promise = fetch(url, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    const num = data['bulk-save-max']
    if (typeof num === 'number') {
      bulkSaveLimit = num
    }
  })
  return promise
}

// Update an individual URL item in the list container.
function processStatus(msg, url, wbUrl) {
  let curl = cropPrefix(url)
  if (curl && bulkSaveMap.has(curl) && (bulkSaveMap.get(curl).status !== S_DONE)) {
    let obj = bulkSaveMap.get(curl)
    let $row = obj.row
    if ($row) {
      if (msg === 'save_start') {
        updateRow($row, '', 'yellow')
        obj.status = S_SAVING
      } else if (msg === 'save_success') {
        updateRow($row, '✔', 'green', url, wbUrl)
        obj.status = S_DONE
        obj.wburl = wbUrl
        saveSuccessCount++
        updateCounts()
        saveNextInQueue()
      } else if (msg === 'save_error') {
        console.log('error saving url: ' + url)
        updateRow($row, '!', 'red')
        obj.status = S_FAILED
        saveFailedCount++
        updateCounts()
        saveNextInQueue()
      } else if (msg === 'save_archived') {
        // url was already archived
        updateRow($row, '•', 'green', url, wbUrl)
        obj.status = S_DONE
        obj.wburl = wbUrl
        saveSuccessCount++
        updateCounts()
        saveNextInQueue()
      }
      bulkSaveMap.set(curl, obj)
    }
  } else {
    console.log('url not valid? ' + url)
  }
}

// Stop saving when counts reach total count.
function checkIfFinished() {
  if ((totalUrlCount > 0) && (saveSuccessCount + saveFailedCount >= totalUrlCount)) {
    stopSaving()
    if (saveFailedCount === 0) { $('#copy-unsaved-btn').attr('disabled', true) }
  }
}

// Copy all URLs in bulk save list to clipboard, separated by newlines.
function doCopyAll() {
  let text = Array.from(bulkSaveMap.values()).map(obj => obj.url).join('\n')
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('All links copied to the clipboard.')
    }).catch(err => {
      console.log('Not copied to clipboard: ', err)
    })
  }
}

// Copy the Wayback links to the finished and skipped (green) archived URLs.
function doCopySaved() {
  let text = Array.from(bulkSaveMap.values()).filter(obj => (obj.status === S_DONE)).map(obj => obj.wburl).join('\n')
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Saved links to the Wayback Machine copied to the clipboard.')
    }).catch(err => {
      console.log('Not copied to clipboard: ', err)
    })
  }
}

// Copy the original URLs of the unsaved, stuck or URLs (yellow & red) that had errors.
function doCopyUnsaved() {
  let text = Array.from(bulkSaveMap.values()).filter(obj => (obj.status !== S_DONE)).map(obj => obj.url).join('\n')
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      alert('Unsaved links copied to the clipboard.')
    }).catch(err => {
      console.log('Not copied to clipboard: ', err)
    })
  }
}

// onload
$(function() {
  if (chrome.bookmarks) {
    $('#import-bookmarks-btn').click(doImportBookmarks)
    $('#main-info').text('Enter a list of URLs below or import from your bookmarks.')
  } else {
    // Safari doesn't support reading bookmarks
    $('#import-bookmarks-btn').hide()
    $('#main-info').text('Enter a list of URLs below.')
  }
  $('.btn').click(clearFocus)
  $('#add-url-btn').click(doAddURLs)
  $('#clear-all-btn').click(doClearAll)
  $('#copy-all-btn').click(doCopyAll)
  $('#copy-saved-btn').click(doCopySaved)
  $('#copy-unsaved-btn').click(doCopyUnsaved)
  resetUI()
  initMessageListener()
  updateLimitCount()
  // fetchLimitCount().then(data => { updateLimitCount() }) // uncomment to fetch limit from API
})
