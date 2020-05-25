// background.js
//
// License: AGPL-3
// Copyright 2016-2020, Internet Archive

// from 'utils.js'
/*   global isNotExcludedUrl, isValidUrl, notify, openByWindowSetting, sleep, wmAvailabilityCheck, resetStorage */
/*   global getCachedWaybackCount, badgeCountText */

var manifest = chrome.runtime.getManifest()
// Load version from Manifest.json file
var VERSION = manifest.version
// Used to store the statuscode of the if it is a httpFailCodes
var globalStatusCode = ''
let toolbarIconState = {}
let tabIdPromise
var WB_API_URL = hostURL + 'wayback/available'
var newshosts = [
  'www.apnews.com',
  'www.factcheck.org',
  'www.forbes.com',
  'www.huffpost.com',
  'www.nytimes.com',
  'www.politico.com',
  'www.politifact.com',
  'www.snopes.com',
  'www.theverge.com',
  'www.usatoday.com',
  'www.vox.com',
  'www.washingtonpost.com'
]

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === 'user-agent') {
      header.value = header.value + ' Wayback_Machine_Chrome/' + VERSION + ' Status-code/' + globalStatusCode
    }
  }
  return { requestHeaders: e.requestHeaders }
}

function URLopener(open_url, url, wmIsAvailable) {
  if (wmIsAvailable === true) {
    wmAvailabilityCheck(url, function () {
      openByWindowSetting(open_url)
    }, function () {
      alert('This page has not been archived.')
    })
  } else {
    openByWindowSetting(open_url)
  }
}

function savePageNow(tabId, page_url, silent = false, options = []) {
  if (isValidUrl(page_url) && isNotExcludedUrl(page_url)) {
    const data = new URLSearchParams()
    data.append('url', encodeURI(page_url))
    options.forEach(opt => data.append(opt, '1'))
    const timeoutPromise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      fetch(hostURL + 'save/',
        {
          credentials: 'include',
          method: 'POST',
          body: data,
          headers: {
            'Accept': 'application/json'
          }
        })
      .then(resolve, reject)
    })
    return timeoutPromise
      .then(response => response.json())
      .then(function(res) {
        if (!silent) {
          notify('Saving ' + page_url)
        }
        validate_spn(tabId, res.job_id, silent)
      })
  }
}

function auth_check() {
  const timeoutPromise = new Promise(function (resolve, reject) {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 30000)
    fetch(hostURL + 'save/',
      {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        }
      })
    .then(resolve, reject)
  })
  return timeoutPromise
  .then(response => response.json())
}

async function validate_spn(tabId, job_id, silent = false) {
  let vdata
  let status = 'start'
  const val_data = new URLSearchParams()
  val_data.append('job_id', job_id)

  while ((status === 'start') || (status === 'pending')) {

    // update UI
    chrome.runtime.sendMessage({
      message: 'save_start'
    })
    if (status === 'pending') {
      setToolbarState(tabId, 'S')
    }

    await sleep(1000)
    const timeoutPromise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      if ((status === 'start') || (status === 'pending')) {
        fetch('https://web.archive.org/save/status', {
          credentials: 'include',
          method: 'POST',
          body: val_data,
          headers: {
            'Accept': 'application/json'
          }
        }).then(resolve, reject)
      }
    })
    timeoutPromise
      .then(response => response.json())
      .then(function(data) {
        status = data.status
        vdata = data
      })
  }

  if (vdata.status === 'success') {
    setToolbarState(tabId, 'check')
    chrome.runtime.sendMessage({
      message: 'save_success',
      time: 'Last saved: ' + getLastSaveTime(vdata.timestamp)
    })
    if (!silent) {
      let msg = 'Successfully saved! Click to view snapshot.'
      // replace message if present in result
      if (vdata.message && vdata.message.length > 0) {
        msg = vdata.message
      }
      notify(msg, function(notificationId) {
        chrome.notifications.onClicked.addListener(function(newNotificationId) {
          if (notificationId === newNotificationId) {
            let snapshot_url = 'https://web.archive.org/web/' + vdata.timestamp + '/' + vdata.original_url
            openByWindowSetting(snapshot_url)
          }
        })
      })
    }
  } else if (!vdata.status || (status === 'error')) {
    clearToolbarState(tabId)
    chrome.runtime.sendMessage({
      message: 'save_error',
      error: vdata.message
    })
    if (!silent) {
      notify('Error: ' + vdata.message, function(notificationId) {
        chrome.notifications.onClicked.addListener(function(newNotificationId) {
          if (notificationId === newNotificationId) {
            openByWindowSetting('https://archive.org/account/login')
          }
        })
      })
    }
  }
}

chrome.storage.sync.set({
  newshosts: newshosts
})
/**
 *
 * Installed callback
 */
chrome.runtime.onStartup.addListener(function(details) {
  chrome.storage.sync.get(['agreement'], function(result) {
    if (result.agreement === true) {
      chrome.browserAction.setPopup({ popup: 'index.html' })
    }
  })
})

chrome.runtime.onInstalled.addListener((details) => {
  resetExtensionStorage()
})

chrome.runtime.onInstalled.addListener(function(details) {
  chrome.storage.sync.get(['agreement'], function(result) {
    if (result.agreement === true) {
      chrome.browserAction.setPopup({ popup: 'index.html' })
    }
  })
})

chrome.browserAction.onClicked.addListener(function(tab) {
  openByWindowSetting(chrome.runtime.getURL('welcome.html'), 'tab')
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  { urls: [WB_API_URL] },
  ['blocking', 'requestHeaders']
)

chrome.webRequest.onErrorOccurred.addListener(function (details) {
  if (['net::ERR_NAME_NOT_RESOLVED', 'net::ERR_NAME_RESOLUTION_FAILED',
    'net::ERR_CONNECTION_TIMED_OUT', 'net::ERR_NAME_NOT_RESOLVED'].indexOf(details.error) >= 0 &&
    details.tabId > 0) {
    chrome.storage.sync.get(['not_found_popup'], function(event) {
      if (event.not_found_popup === true) {
        wmAvailabilityCheck(details.url, function (wayback_url, url) {
          chrome.tabs.sendMessage(details.tabId, {
            type: 'SHOW_BANNER',
            wayback_url: wayback_url,
            page_url: url,
            status_code: 999
          })
        }, function () { })
      }
    })
  }
}, { urls: ['<all_urls>'], types: ['main_frame'] })

/**
* Header callback
*/
chrome.webRequest.onCompleted.addListener(function (details) {
  function tabIsReady(isIncognito) {
    if (isIncognito === false && details.frameId === 0 &&
      details.statusCode >= 400 && isNotExcludedUrl(details.url)) {
      globalStatusCode = details.statusCode
      wmAvailabilityCheck(details.url, function (wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: 'scripts/archive.js'
        }, function () {
          if (chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('Cannot access contents of url "chrome-error://chromewebdata/')) {
            chrome.tabs.sendMessage(details.tabId, {
              type: 'SHOW_BANNER',
              wayback_url: wayback_url,
              page_url: url,
              status_code: 999
            })
          } else {
            chrome.tabs.sendMessage(details.tabId, {
              type: 'SHOW_BANNER',
              wayback_url: wayback_url,
              page_url: details.url,
              status_code: details.statusCode
            })
          }
        })
      }, function() {})
    }
  }
  if (details.tabId > 0) {
    chrome.tabs.query({ currentWindow: true }, function (tabs) {
      var tabsArr = tabs.map(tab => tab.id)
      if (tabsArr.indexOf(details.tabId) >= 0) {
        chrome.tabs.get(details.tabId, function (tab) {
          chrome.storage.sync.get(['not_found_popup'], function(event) {
            if (event.not_found_popup === true) {
              tabIsReady(tab.incognito)
            }
          })
        })
      }
    })
  }
}, { urls: ['<all_urls>'], types: ['main_frame'] })

function getLastSaveTime(timestamp) {
  return viewableTimestamp(timestamp)
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.message === 'openurl') {
    var page_url = message.page_url
    var wayback_url = message.wayback_url
    var url = page_url.replace(/https:\/\/web\.archive\.org\/web\/(.+?)\//g, '')
    var open_url = wayback_url + encodeURI(url)
    if (isNotExcludedUrl(page_url)) {
      if (message.method !== 'save') {
        URLopener(open_url, url, true)
      } else {
        let options = (message.options !== null) ? message.options : []
        savePageNow(null, page_url, false, options)
        return true
      }
    }
  } else if (message.message === 'getLastSaveTime') {
    // get most recent saved time, remove hash for some sites
    const url = message.page_url.split('#')[0]
    wmAvailabilityCheck(url,
      function(wb_url, url, timestamp) {
        sendResponse({
          message: 'last_save',
          time: 'Last saved: ' + getLastSaveTime(timestamp)
        })
      },
      function() {
        sendResponse({
          message: 'last_save',
          time: "Page hasn't been saved"
        })
      })
    return true
  } else if (message.message === 'auth_check') {
    auth_check()
      .then(resp => sendResponse(resp))
    return true
  } else if (message.message === 'getWikipediaBooks') {
    // wikipedia message listener
    let host = hostURL + 'services/context/books?url='
    let url = host + encodeURIComponent(message.query)
    // Encapsulate fetch with a timeout promise object
    const timeoutPromise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      fetch(url).then(resolve, reject)
    })
    timeoutPromise
      .then(response => response.json())
      .then(data => sendResponse(data))
    return true
  } else if (message.message === 'tvnews') {
    let url = hostURL + 'services/context/tvnews?url=' + message.article
    const timeoutPromise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      fetch(url).then(resolve, reject)
    })
    timeoutPromise
      .then(response => response.json())
      .then(function (clips) {
        sendResponse(clips)
      })
    return true
  } else if (message.message === 'sendurl') {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { url: tabs[0].url })
    })
  } else if (message.message === 'changeBadge') {
    // used to change badge for auto-archive feature (not used?)
  } else if (message.message === 'showall' && isNotExcludedUrl(message.url)) {
    const context_url = chrome.runtime.getURL('context.html') + '?url=' + message.url
    tabIdPromise = new Promise(function (resolve) {
      openByWindowSetting(context_url, null, resolve)
    })
  } else if (message.message === 'getToolbarState') {
    // retrieve the toolbar state
    sendResponse({ state: getToolbarState(message.tabId) })
  } else if (message.message === 'clearCount') {
    // wayback count settings unchecked
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      updateWaybackCountBadge(tabs[0].id, null)
    })
  } else if (message.message === 'clearResource') {
    // resources settings unchecked
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      clearToolbarState(tabs[0].id)
    })
  }
})

chrome.tabs.onUpdated.addListener(function (tabId, info, tab) {
  if (info.status === 'complete') {
    chrome.storage.sync.get(['wm_count', 'auto_archive'], function (event) {
      // wayback count
      if (event.wm_count === true) {
        updateWaybackCountBadge(tab.id, tab.url)
      } else {
        updateWaybackCountBadge(tab.id, null)
      }
      // auto save page
      if (event.auto_archive === true) {
        auto_save(tab.id, tab.url)
      }
    })
  } else if (info.status === 'loading') {
    var received_url = tab.url
    clearToolbarState(tab.id)
    if (isNotExcludedUrl(received_url) && !(received_url.includes('alexa.com') || received_url.includes('whois.com') || received_url.includes('twitter.com') || received_url.includes('oauth'))) {
      let contextUrl = received_url
      let tagcloudUrl = new URL(contextUrl)
      received_url = received_url.replace(/^https?:\/\//, '')
      var last_index = received_url.indexOf('/')
      var url = received_url.slice(0, last_index)
      var open_url = received_url
      if (open_url.slice(-1) === '/') { open_url = received_url.substring(0, open_url.length - 1) }
      chrome.storage.sync.get(['auto_update_context', 'show_context', 'resource'], function (event) {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          if (event.resource === true) {
            const url = tabs[0].url
            const tabId = tabs[0].id
            const news_host = new URL(url).hostname
            // checking resource of amazon books
            if (url.includes('www.amazon')) {
              fetch(hostURL + 'services/context/amazonbooks?url=' + url)
                .then(resp => resp.json())
                .then(resp => {
                  if (('metadata' in resp && 'identifier' in resp['metadata']) || 'ocaid' in resp) {
                    setToolbarState(tabId, 'R')
                    // Storing the tab url as well as the fetched archive url for future use
                    chrome.storage.sync.set({ 'tab_url': url, 'detail_url': resp['metadata']['identifier-access'] }, function () {})
                  }
                })
            // checking resource of wikipedia books and papers
            } else if (url.match(/^https?:\/\/[\w\.]*wikipedia.org/)) {
              setToolbarState(tabId, 'R')
            // checking resource of tv news
            } else if (newshosts.includes(news_host)) {
              setToolbarState(tabId, 'R')
            }
          }
        })
        if (event.auto_update_context === true) {
          if (tabIdPromise) {
            tabIdPromise.then(function (id) {
              if (tabId !== id && tab.id !== id && isNotExcludedUrl(contextUrl)) {
                chrome.tabs.update(id, { url: chrome.runtime.getURL('context.html') + '?url=' + contextUrl })
              }
            })
          }
        }
      })
    }
  }
})

// Updating the context page based on every tab the user is selecting
chrome.tabs.onActivated.addListener(function (info) {
  chrome.storage.sync.get(['auto_update_context', 'resource', 'wm_count'], function (event) {
    if ((event.resource === false) && (getToolbarState(info.tabId) === 'R')) {
      // reset toolbar if resource setting turned off
      clearToolbarState(info.tabId)
    } else {
      updateToolbarIcon(info.tabId)
    }
    if (event.wm_count === false) {
      // clear badge if wayback count setting turned off
      updateWaybackCountBadge(info.tabId, null)
    }
    if (event.auto_update_context === true) {
      chrome.tabs.get(info.tabId, function (tab) {
        if (tabIdPromise) {
          tabIdPromise.then(function (id) {
            if (info.tabId === tab.id && tab.tabId !== id && tab.url && isNotExcludedUrl(tab.url)) {
              chrome.tabs.update(id, { url: chrome.runtime.getURL('context.html') + '?url=' + tab.url })
            }
          })
        }
      })
    }
  })
})

function auto_save(tabId, url) {
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    wmAvailabilityCheck(url,
      function () {
        // check if page is now in archive after auto-saved
        if (getToolbarState(tabId) === 'S') {
        }
      },
      function () {
        // set auto-save toolbar icon if page doesn't exist, then save it
        if (getToolbarState(tabId) !== 'S') {
          savePageNow(tabId, url, true)
        }
      }
    )
  }
}

function updateWaybackCountBadge(tabId, url) {
  if (!url) {
    // clear badge
    chrome.browserAction.setBadgeText({ tabId: tabId, text: '' })
  } else {
    getCachedWaybackCount(url, (total) => {
      if (total > 0) {
        // display badge
        let text = badgeCountText(total)
        chrome.browserAction.setBadgeBackgroundColor({ color: '#9A3B38' }) // red
        chrome.browserAction.setBadgeText({ tabId: tabId, text: text })
      } else {
        // clear badge
        chrome.browserAction.setBadgeText({ tabId: tabId, text: '' })
      }
    })
  }
}

/**
 * Sets the toolbar icon.
 * Name string is based on PNG image filename in images/toolbar/
 * @param name {string} = one of 'archive', 'check', 'R', or 'S'
 */
function setToolbarIcon(name) {
  const path = 'images/toolbar/toolbar-icon-'
  let n = ((name !== 'R') && (name !== 'S') && (name !== 'check')) ? 'archive' : name
  let details = {
    '16': (path + n + '16.png'),
    '24': (path + n + '24.png'),
    '32': (path + n + '32.png'),
    '64': (path + n + '64.png')
  }
  chrome.browserAction.setIcon({ path: details })
}

function setToolbarState(tabId, name) {
  toolbarIconState[tabId] = name
  setToolbarIcon(name)
}

function getToolbarState(tabId) {
  return toolbarIconState[tabId]
}

function clearToolbarState(tabId) {
  if (toolbarIconState[tabId]) {
    delete toolbarIconState[tabId]
  }
  setToolbarIcon('archive')
}

function updateToolbarIcon(tabId) {
  setToolbarIcon(getToolbarState(tabId))
}

// Right-click context menu "Wayback Machine" inside the page.
chrome.contextMenus.create({
  'id': 'first',
  'title': 'First Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
})
chrome.contextMenus.create({
  'id': 'recent',
  'title': 'Recent Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
})
chrome.contextMenus.create({
  'id': 'all',
  'title': 'All Versions',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
})
chrome.contextMenus.create({
  'id': 'save',
  'title': 'Save Page Now',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
})
chrome.contextMenus.onClicked.addListener(function (click) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (['first', 'recent', 'save', 'all'].indexOf(click.menuItemId) >= 0) {
      const pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g
      const page_url = tabs[0].url.replace(pattern, '')
      let wayback_url
      let wmIsAvailable = true
      if (isValidUrl(page_url) && isNotExcludedUrl(page_url)) {
        if (click.menuItemId === 'first') {
          wayback_url = 'https://web.archive.org/web/0/' + encodeURI(page_url)
        } else if (click.menuItemId === 'recent') {
          wayback_url = 'https://web.archive.org/web/2/' + encodeURI(page_url)
        } else if (click.menuItemId === 'save') {
          wmIsAvailable = false
          wayback_url = hostURL + 'save/' + encodeURI(page_url)
        } else if (click.menuItemId === 'all') {
          wmIsAvailable = false
          wayback_url = 'https://web.archive.org/web/*/' + encodeURI(page_url)
        }
        URLopener(wayback_url, page_url, wmIsAvailable)
      } else {
        alert('This URL is in the list of excluded URLs')
      }
    }
  })
})
