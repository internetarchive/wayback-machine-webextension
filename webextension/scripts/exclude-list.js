// exclude-list.js

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, makeValidURL, cropPrefix, dateToTimestamp, checkLastError, cropScheme */

const defaultExcludeList = [
  'mail.google.com/*',
  'mail.yahoo.com/*'
]

// Removes focus outline on mouse click, while keeping during keyboard use.
function clearFocus() {
  document.activeElement.blur()
}

function closeWindow() {
  window.close()
}

// Fills textarea with URL pattern array of strings.
function fillTextArea(elist) {
  const text = elist.join('\n')
  // document.getElementById('add-url-area').value = ''
  $('#add-url-area').text(text)
}

// Reads list of URL patterns from storage then fills textarea.
function loadExcludeList() {
  chrome.storage.local.get(['exclude_list'], (items) => {
    if (('exclude_list' in items) && items.exclude_list) {
      fillTextArea(items.exclude_list)
    } else {
      // use a default list of excluded URLs
      fillTextArea(defaultExcludeList)
    }
  })
}

// Reads list from textarea and saves it to storage.
function saveExcludeList() {
  const text = document.getElementById('add-url-area').value
  const lines = text.split('\n')
  let urlSet = new Set()
  // cropping schemes from every URL, removing duplicates
  for (let line of lines) {
    if (isNotExcludedUrl(line)) {
      const curl = cropScheme(line)
      if (curl) { urlSet.add(curl) }
    }
  }
  // save the modified list
  const exlist = Array.from(urlSet)
  chrome.storage.local.set({ 'exclude_list': exlist }, () => {})
}

function resetExcludeList() {
  // chrome.storage.local.set({ 'exclude_list': null }, () => {})
  // loadExcludeList()
  fillTextArea(defaultExcludeList)
}

// onload
$(function() {
  $('.btn').click(clearFocus)
  $('#cancel-btn').click(closeWindow)
  $('#reset-btn').click(resetExcludeList)
  $('#save-btn').click((e) => {
    saveExcludeList()
    closeWindow()
  })
  loadExcludeList()
})
