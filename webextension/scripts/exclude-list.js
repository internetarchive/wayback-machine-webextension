// exclude-list.js

// from 'utils.js'
/*   global isNotExcludedUrl, cropScheme */

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
  document.getElementById('exclude-list-area').value = text
}

// Reads exclude list of URL patterns from storage then fills textarea.
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

// Saves exclude list from textarea to storage.
function saveExcludeList() {
  const text = document.getElementById('exclude-list-area').value
  const lines = text.split('\n')
  let urlSet = new Set()
  // crop schemes from every URL and skip duplicates
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
  fillTextArea(defaultExcludeList)
}

function clearExcludeList() {
  fillTextArea([])
}

// onload
$(function() {
  $('.btn').click(clearFocus)
  $('#clear-btn').click(clearExcludeList)
  $('#reset-btn').click(resetExcludeList)
  $('#cancel-btn').click(closeWindow)
  $('#save-btn').click((e) => {
    saveExcludeList()
    closeWindow()
  })
  loadExcludeList()
})
