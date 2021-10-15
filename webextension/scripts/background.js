// background.js
//
// License: AGPL-3
// Copyright 2016-2020, Internet Archive

// from 'utils.js'
/*   global isNotExcludedUrl, getCleanUrl, isArchiveUrl, isValidUrl, notify, openByWindowSetting, sleep, wmAvailabilityCheck, hostURL, isFirefox */
/*   global initDefaultOptions, afterAcceptOptions, badgeCountText, getWaybackCount, newshosts, dateToTimestamp, gBrowser, fixedEncodeURIComponent, checkLastError */

let manifest = chrome.runtime.getManifest()
// Load version from Manifest.json file
let VERSION = manifest.version
// Used to store the statuscode of the if it is a httpFailCodes
let globalStatusCode = ''
let gToolbarStates = {}
let waybackCountCache = {}
let globalAPICache = new Map()
const API_CACHE_SIZE = 5
const API_LOADING = 'LOADING'
const API_TIMEOUT = 10000
const API_RETRY = 1000
let tabIdPromise
let WB_API_URL = hostURL + 'wayback/available'
const SPN_RETRY = 6000

let private_before_default = new Set([
  'not-found-setting'
])

function rewriteUserAgentHeader(e) {
  for (let header of e.requestHeaders) {
    if (header.name.toLowerCase() === 'user-agent') {
      header.value = header.value + ' Wayback_Machine_' + gBrowser.charAt(0).toUpperCase() + gBrowser.slice(1) + '/' + VERSION + ' Status-code/' + globalStatusCode
    }
  }
  return { requestHeaders: e.requestHeaders }
}

function URLopener(open_url, url, wmIsAvailable) {
  if (wmIsAvailable === true) {
    wmAvailabilityCheck(url, () => {
      openByWindowSetting(open_url)
    }, () => {
      const msg = 'This page has not been archived.'
      if (isFirefox) { notify(msg) } else { alert(msg) }
    })
  } else {
    openByWindowSetting(open_url)
  }
}

/* * * API Calls * * */

function savePageNow(atab, page_url, silent = false, options = {}) {
  if (isValidUrl(page_url) && isNotExcludedUrl(page_url)) {
    const data = new URLSearchParams(options)
    data.append('url', page_url) // this is correct!
    const timeoutPromise = new Promise((resolve, reject) => {
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
      .then((res) => {
        // notifications depending on status
        let msg = res.message || 'Please Try Again'
        if (('job_id' in res) && (res.job_id !== null)) {
          if (msg.indexOf('same snapshot') !== -1) {
            // snapshot already archived within timeframe
            chrome.runtime.sendMessage({ message: 'save_archived', error: msg, url: page_url, atab: atab }, checkLastError)
            if (!silent) { notify(msg) }
          } else {
            // call status during save
            validate_spn(atab, res.job_id, silent, page_url)
            if (!silent) {
              notify('Saving ' + page_url)
              // show resources during save
              chrome.storage.local.get(['resource_list_setting'], (settings) => {
                if (settings && settings.resource_list_setting) {
                  const resource_list_url = chrome.runtime.getURL('resource_list.html') + '?url=' + page_url + '&job_id=' + res.job_id + '#not_refreshed'
                  openByWindowSetting(resource_list_url, 'windows')
                }
              })
            }
          }
        } else {
          // handle error
          chrome.runtime.sendMessage({ message: 'save_error', error: msg, url: page_url, atab: atab }, checkLastError)
          if (!silent) { notify('Error: ' + msg) }
        }
      })
      .catch((err) => {
        // handle http errors
        console.log(err)
        chrome.runtime.sendMessage({ message: 'save_error', error: 'Save Error', url: page_url, atab: atab }, checkLastError)
      })
  }
}

// not currently used, but may in the future?
function authCheckAPI() {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('timeout'))
    }, 30000)
    fetch(hostURL + 'save/', {
      credentials: 'include',
      method: 'POST',
      headers: { 'Accept': 'application/json' }
    })
    .then(resolve, reject)
  })
  return timeoutPromise
  .then(response => response.json())
}

async function validate_spn(atab, job_id, silent = false, page_url) {
  let vdata
  let status = 'start'
  const val_data = new URLSearchParams()
  val_data.append('job_id', job_id)
  let wait_time = 1000
  while ((status === 'start') || (status === 'pending')) {
    // update UI
    chrome.runtime.sendMessage({
      message: 'save_start',
      atab: atab,
      url: page_url
    }, checkLastError)
    addToolbarState(atab, 'S')

    await sleep(wait_time)
    const timeoutPromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      if ((status === 'start') || (status === 'pending')) {
        fetch(hostURL + 'save/status', {
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
      .then((response) => {
        let value = response.headers.get('Retry-After')
        let secs = (value) ? parseInt(value, 10) : null
        wait_time = (secs) ? (secs * 1000) : SPN_RETRY
        return response.json()
      })
      .then((data) => {
        status = data.status
        vdata = data
        chrome.runtime.sendMessage({
          message: 'resource_list_show',
          data: data,
          url: page_url
        }, checkLastError)
      })
      .catch((err) => {
        // only report non-timeout errors for now, since timeouts aren't canceled, causing a bug
        if (err.message !== 'timeout') {
          chrome.runtime.sendMessage({
            message: 'resource_list_show_error',
            data: err,
            url: page_url
          }, checkLastError)
        }
      })
  }
  // update when done
  removeToolbarState(atab, 'S')

  if (vdata.status === 'success') {
    incrementCount(vdata.original_url)
    // update UI
    addToolbarState(atab, 'check')
    chrome.runtime.sendMessage({
      message: 'save_success',
      timestamp: vdata.timestamp,
      atab: atab,
      url: page_url
    }, checkLastError)
    // notify
    if (!silent) {
      let msg = 'Successfully saved! Click to view snapshot.'
      // replace message if present in result
      if (vdata.message && vdata.message.length > 0) {
        msg = vdata.message
      }
      notify(msg, (notificationId) => {
        chrome.notifications && chrome.notifications.onClicked.addListener((newNotificationId) => {
          if (notificationId === newNotificationId) {
            let snapshot_url = 'https://web.archive.org/web/' + vdata.timestamp + '/' + vdata.original_url
            openByWindowSetting(snapshot_url)
          }
        })
      })
    }
  } else if (!vdata.status || (status === 'error')) {
    // update UI
    chrome.runtime.sendMessage({
      message: 'save_error',
      error: vdata.message,
      url: page_url,
      atab: atab
    }, checkLastError)
    // notify
    if (!silent) {
      notify('Error: ' + vdata.message, (notificationId) => {
        chrome.notifications && chrome.notifications.onClicked.addListener((newNotificationId) => {
          if (notificationId === newNotificationId) {
            openByWindowSetting('https://archive.org/account/login')
          }
        })
      })
    }
  }
}

/**
 * Encapsulate fetching a url with a timeout promise object.
 * @param url {string}
 * @param onSuccess(json): json = root object from API call.
 * @param onFail(error): error = Error object or null.
 * @return Promise
 */
function fetchAPI(url, onSuccess, onFail) {
  const timeoutPromise = new Promise((resolve, reject) => {
    setTimeout(() => { reject(new Error('timeout')) }, API_TIMEOUT)
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(resolve, reject)
  })
  return timeoutPromise
    .then(response => response.json())
    .then(data => {
      if (data) {
        onSuccess(data)
      } else {
        if (onFail) { onFail(null) }
      }
    })
    .catch(error => {
      if (onFail) { onFail(error) }
    })
}

/**
 * Returns cached API call, or fetches url if not in cache.
 * @param url {string}
 * @param onSuccess(json): json = root object from API call.
 * @param onFail(error): error = Error object or null.
 * @return Promise if calls API, json data if in cache, null if loading in progress.
 */
function fetchCachedAPI(url, onSuccess, onFail) {
  let data = globalAPICache.get(url)
  if (data === API_LOADING) {
    // re-call after delay if previous fetch hadn't returned yet
    setTimeout(() => {
      fetchCachedAPI(url, onSuccess, onFail)
    }, API_RETRY)
    return null
  } else if (data !== undefined) {
    onSuccess(data)
    return data
  } else {
    // if cache full, remove first object which is the oldest from the cache
    if (globalAPICache.size >= API_CACHE_SIZE) {
      globalAPICache.delete(globalAPICache.keys().next().value)
    }
    globalAPICache.set(url, API_LOADING)
    return fetchAPI(url, (json) => {
      globalAPICache.set(url, json)
      onSuccess(json)
    }, (error) => {
      globalAPICache.delete(url)
      onFail(error)
    })
  }
}

function getCachedBooks(url, onSuccess, onFail) {
  const requestUrl = hostURL + 'services/context/books?url=' + fixedEncodeURIComponent(url)
  fetchCachedAPI(requestUrl, onSuccess, onFail)
}

function getCachedPapers(url, onSuccess, onFail) {
  const requestUrl = hostURL + 'services/context/papers?url=' + fixedEncodeURIComponent(url)
  fetchCachedAPI(requestUrl, onSuccess, onFail)
}

function getCachedTvNews(url, onSuccess, onFail) {
  const requestUrl = hostURL + 'services/context/tvnews?url=' + fixedEncodeURIComponent(url)
  fetchCachedAPI(requestUrl, onSuccess, onFail)
}

function getCachedFactCheck(url, onSuccess, onFail) {
  const requestUrl = 'https://data.our.news/api/?partner=wayback&factcheck=' + fixedEncodeURIComponent(url)
  fetchCachedAPI(requestUrl, onSuccess, onFail)
}

/* * * Startup related * * */

// Runs whenever extension starts up, except during incognito mode.
chrome.runtime.onStartup.addListener((details) => {
  chrome.storage.local.get({ agreement: false }, (settings) => {
    if (settings && settings.agreement) {
      chrome.browserAction.setPopup({ popup: chrome.runtime.getURL('index.html') }, checkLastError)
    }
  })
})

// Runs when extension first installed or updated, or browser updated.
chrome.runtime.onInstalled.addListener((details) => {
  initDefaultOptions()
  chrome.storage.local.get({ agreement: false }, (settings) => {
    if (settings && settings.agreement) {
      afterAcceptOptions()
      chrome.browserAction.setPopup({ popup: chrome.runtime.getURL('index.html') }, checkLastError)
    }
  })
})

// Opens Welcome page if popup not yet set.
chrome.browserAction.onClicked.addListener((tab) => {
  openByWindowSetting(chrome.runtime.getURL('welcome.html'), 'tab')
})

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  { urls: [WB_API_URL] },
  ['blocking', 'requestHeaders'] // FIXME: not supported in Safari
)

// Checks for error in page loading such as when a domain doesn't exist.
// Currently not supported in Safari.
//
chrome.webRequest.onErrorOccurred.addListener((details) => {
  if (['net::ERR_NAME_NOT_RESOLVED', 'net::ERR_NAME_RESOLUTION_FAILED',
    'net::ERR_CONNECTION_TIMED_OUT', 'net::ERR_NAME_NOT_RESOLVED', 'NS_ERROR_UNKNOWN_HOST'].indexOf(details.error) >= 0 &&
    (details.tabId >= 0)) {
    chrome.storage.local.get(['not_found_setting', 'agreement'], (settings) => {
      if (settings && settings.not_found_setting && settings.agreement) {
        wmAvailabilityCheck(details.url, (wayback_url, url) => {
          chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('dnserror.html') + '?wayback_url=' + wayback_url + '&page_url=' + url })
        }, () => {})
      }
    })
  }
}, { urls: ['<all_urls>'], types: ['main_frame'] })

// Listens for website loading completed for 404-Not-Found popups.
chrome.webRequest.onCompleted.addListener((details) => {
  function tabIsReady(tabId) {
    if ((details.statusCode >= 400) && isNotExcludedUrl(details.url)) {
      globalStatusCode = details.statusCode
      // insert script first, then check wayback machine, then show banner
      chrome.tabs.executeScript(tabId, { file: '/scripts/archive.js' }, () => {
        wmAvailabilityCheck(details.url, (wayback_url, url) => {
          if (chrome.runtime.lastError && chrome.runtime.lastError.message.startsWith('Cannot access contents of url "chrome-error://chromewebdata/')) {
            chrome.tabs.sendMessage(tabId, {
              type: 'SHOW_BANNER',
              wayback_url: wayback_url,
              page_url: url,
              status_code: 999
            })
          } else {
            chrome.tabs.sendMessage(tabId, {
              type: 'SHOW_BANNER',
              wayback_url: wayback_url,
              page_url: details.url,
              status_code: details.statusCode
            })
          }
        }, () => {}) // wmAvailabilityCheck
      }) // executeScript
    } // if
  } // function

  if (details.tabId >= 0) {
    chrome.storage.local.get(['not_found_setting', 'agreement'], (settings) => {
      if (settings && settings.not_found_setting && settings.agreement) {
        tabIsReady(details.tabId)
      }
    })
  }
}, { urls: ['<all_urls>'], types: ['main_frame'] })

// Listens for messages to call background functions from other scripts.
// note: return true only if sendResponse() needs to be kept around.
//
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (!message) { return }
  if (message.message === 'saveurl') {
    // Save Page Now
    if (isValidUrl(message.page_url) && isNotExcludedUrl(message.page_url)) {
      let page_url = getCleanUrl(message.page_url)
      let silent = message.silent || false
      let options = (message.options && (message.options !== null)) ? message.options : {}
      savePageNow(message.atab, page_url, silent, options)
    }
  }
  else if (message.message === 'openurl') {
    // open URL in new tab or window depending on setting
    if (isValidUrl(message.page_url) && isNotExcludedUrl(message.page_url)) {
      let page_url = getCleanUrl(message.page_url)
      let open_url = message.wayback_url + page_url
      URLopener(open_url, page_url, true)
    }
  } else if (message.message === 'getLastSaveTime') {
    // get most recent saved time
    getCachedWaybackCount(message.page_url,
      (values) => { sendResponse({ message: 'last_save', timestamp: values.last_ts }) },
      () => { sendResponse({ message: 'last_save', timestamp: '' }) }
    )
    return true
  } else if (message.message === 'auth_check') {
    // auth check using cookies
    chrome.cookies.get({ url: 'https://archive.org', name: 'logged-in-sig' }, (result) => {
      let loggedIn = (result && result.value && (result.value.length > 0)) || false
      sendResponse({ auth_check: loggedIn })
    })
    return true
  } else if (message.message === 'getWikipediaBooks') {
    // retrieve wikipedia books
    getCachedBooks(message.query,
      (json) => { sendResponse(json) },
      (error) => { sendResponse({ error: error }) }
    )
    return true
  } else if (message.message === 'getCitedPapers') {
    // retrieve wikipedia papers
    getCachedPapers(message.query,
      (json) => { sendResponse(json) },
      (error) => { sendResponse({ error: error }) }
    )
    return true
  } else if (message.message === 'tvnews') {
    // retrieve tv news clips
    getCachedTvNews(message.article,
      (json) => { sendResponse(json) },
      (error) => { sendResponse({ error: error }) }
    )
    return true
  } else if (message.message === 'sendurl') {
    // sends a url to webpage under current tab (not used)
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        let url = getCleanUrl(tabs[0].url)
        chrome.tabs.sendMessage(tabs[0].id, { url: url })
      }
    })
  } else if (message.message === 'showall' && isNotExcludedUrl(message.url)) {
    // show all contexts (not used)
    const context_url = chrome.runtime.getURL('context.html') + '?url=' + fixedEncodeURIComponent(message.url)
    tabIdPromise = new Promise((resolve) => {
      openByWindowSetting(context_url, null, resolve)
    })
  } else if (message.message === 'getToolbarState') {
    // retrieve the toolbar state set
    let state = getToolbarState(message.atab)
    sendResponse({ stateArray: Array.from(state) })
  } else if (message.message === 'clearCountBadge') {
    // wayback count settings unchecked
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        updateWaybackCountBadge(tabs[0], null)
      }
    })
  } else if (message.message === 'updateCountBadge') {
    // update wayback count badge
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0] && isNotExcludedUrl(tabs[0].url)) {
        let url = getCleanUrl(tabs[0].url)
        updateWaybackCountBadge(tabs[0], url)
      }
    })
  } else if (message.message === 'clearResource') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        if (message.settings) {
          // clear 'R' state if wiki, amazon, or tvnews settings have been cleared
          const news_host = new URL(tabs[0].url).hostname
          if (((message.settings.wiki_setting === false) && tabs[0].url.match(/^https?:\/\/[\w.]*wikipedia.org/)) ||
              ((message.settings.amazon_setting === false) && tabs[0].url.includes('www.amazon')) ||
              ((message.settings.tvnews_setting === false) && newshosts.has(news_host))) {
            removeToolbarState(tabs[0], 'R')
          }
        } else {
          // clear 'R' if settings not provided
          removeToolbarState(tabs[0], 'R')
        }
      }
    })
  } else if (message.message === 'clearFactCheck') {
    // fact check settings unchecked
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        removeToolbarState(tabs[0], 'F')
      }
    })
  } else if (message.message === 'getCachedWaybackCount') {
    // retrieve wayback count
    getCachedWaybackCount(message.url,
      (values) => { sendResponse(values) },
      (error) => { sendResponse({ error }) }
    )
    return true
  } else if (message.message === 'clearCountCache') {
    clearCountCache()
  } else if (message.message === 'getFactCheckResults') {
    // retrieve fact check results
    getCachedFactCheck(message.url,
      (json) => { sendResponse({ json }) },
      (error) => { sendResponse({ error }) }
    )
    return true
  }
  return false
})

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (!isNotExcludedUrl(tab.url)) { return }
  if (info.status === 'complete') {
    updateWaybackCountBadge(tab, tab.url)
    chrome.storage.local.get(['auto_archive_setting', 'fact_check_setting'], (settings) => {
      // auto save page
      if (settings && settings.auto_archive_setting) {
        auto_save(tab, tab.url)
      }
      // fact check
      if (settings && settings.fact_check_setting) {
        factCheckPage(tab, tab.url)
      }
    })
    // checking resources
    const clean_url = getCleanUrl(tab.url)
    if (isValidUrl(clean_url) === false) { return }
    chrome.storage.local.get(['wiki_setting', 'tvnews_setting'], (settings) => {
      // checking wikipedia books & papers
      if (settings && settings.wiki_setting && clean_url.match(/^https?:\/\/[\w.]*wikipedia.org/)) {
        getCachedBooks(clean_url,
          (data) => {
            if (data && (data.status !== 'error')) {
              addToolbarState(tab, 'R')
              addToolbarState(tab, 'books')
            }
          }, () => {}
        )
        getCachedPapers(clean_url,
          (data) => {
            if (data && (data.status !== 'error')) {
              addToolbarState(tab, 'R')
              addToolbarState(tab, 'papers')
            }
          }, () => {}
        )
      }
      // checking tv news
      const news_host = new URL(clean_url).hostname
      if (settings && settings.tvnews_setting && newshosts.has(news_host)) {
        getCachedTvNews(clean_url,
          (clips) => {
            if (clips && (clips.status !== 'error')) {
              addToolbarState(tab, 'R')
            }
          }, () => {}
        )
      }
    })
  } else if (info.status === 'loading') {
    let received_url = tab.url
    clearToolbarState(tab)
    if (isNotExcludedUrl(received_url) && !isArchiveUrl(received_url)) {
      received_url = received_url.replace(/^https?:\/\//, '')
      let open_url = received_url
      if (open_url.slice(-1) === '/') { open_url = received_url.substring(0, open_url.length - 1) }
      chrome.storage.local.get(['amazon_setting'], (settings) => {
        // checking amazon books settings
        if (settings && settings.amazon_setting) {
          const url = getCleanUrl(tab.url)
          // checking resource of amazon books
          if (url.includes('www.amazon')) {
            fetch(hostURL + 'services/context/amazonbooks?url=' + url)
              .then(resp => resp.json())
              .then(resp => {
                if (('metadata' in resp && 'identifier' in resp['metadata']) || 'ocaid' in resp) {
                  addToolbarState(tab, 'R')
                  // Storing the tab url as well as the fetched archive url for future use
                  chrome.storage.local.set({ 'tab_url': url, 'detail_url': resp['metadata']['identifier-access'] }, () => {})
                }
              })
          }
        }
      })
    }
  }
})

// Called whenever a browser tab is selected
chrome.tabs.onActivated.addListener((info) => {
  chrome.storage.local.get(['fact_check_setting', 'wiki_setting', 'amazon_setting', 'tvnews_setting'], (settings) => {
    checkLastError()
    chrome.tabs.get(info.tabId, (tab) => {
      checkLastError()
      if (typeof tab === 'undefined') { return }
      // fact check settings unchecked
      if (settings && (settings.fact_check_setting === false) && getToolbarState(tab).has('F')) {
        removeToolbarState(tab, 'F')
      }
      // wiki_setting settings unchecked
      if (settings && (settings.wiki_setting === false) && getToolbarState(tab).has('R')) {
        if (tab.url.match(/^https?:\/\/[\w.]*wikipedia.org/)) { removeToolbarState(tab, 'R') }
      }
      // amazon_setting settings unchecked
      if (settings && (settings.amazon_setting === false) && getToolbarState(tab).has('R')) {
        if (tab.url.includes('www.amazon')) { removeToolbarState(tab, 'R') }
      }
      // tvnews_setting settings unchecked
      if (settings && (settings.tvnews_setting === false) && getToolbarState(tab).has('R')) {
        const news_host = new URL(tab.url).hostname
        if (newshosts.has(news_host)) { removeToolbarState(tab, 'R') }
      }
      updateToolbar(tab)
      // update or clear count badge
      updateWaybackCountBadge(tab, tab.url)
    })
  })
})

function auto_save(atab, url) {
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    wmAvailabilityCheck(url,
      () => {
        // check if page is now in archive after auto-saved
        // (don't do anything)
      },
      () => {
        // set auto-save toolbar icon if page doesn't exist, then save it
        if (!getToolbarState(atab).has('S')) {
          savePageNow(atab, url, true)
        }
      }
    )
  }
}

function factCheckPage(atab, url) {
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    // retrieve fact check results
    getCachedFactCheck(url,
      (json) => {
        if (json && json.results) {
          addToolbarState(atab, 'F')
        }
      },
      (error) => {
        console.log('factcheck error: ', error)
      }
    )
  }
}

/* * * Wayback Count * * */

function getCachedWaybackCount(url, onSuccess, onFail) {
  let cacheValues = waybackCountCache[url]
  if (cacheValues) {
    onSuccess(cacheValues)
  } else {
    getWaybackCount(url, (values) => {
      waybackCountCache[url] = values
      onSuccess(values)
    }, onFail)
  }
}

function clearCountCache() {
  waybackCountCache = {}
}

/**
 * Adds +1 to url in cache, or set to 1 if it doesn't exist.
 * Also updates "last_ts" with current timestamp.
 * @param url {string}
 */
function incrementCount(url) {
  let cacheValues = waybackCountCache[url]
  let timestamp = dateToTimestamp(new Date())
  if (cacheValues && cacheValues.total) {
    cacheValues.total += 1
    cacheValues.last_ts = timestamp
    waybackCountCache[url] = cacheValues
  } else {
    waybackCountCache[url] = { total: 1, last_ts: timestamp }
  }
}

function updateWaybackCountBadge(atab, url) {
  if (!atab) { return }
  chrome.storage.local.get(['wm_count_setting'], (settings) => {
    if (settings && settings.wm_count_setting && isValidUrl(url) && isNotExcludedUrl(url) && !isArchiveUrl(url)) {
      getCachedWaybackCount(url, (values) => {
        if (values.total >= 0) {
          // display badge
          let text = badgeCountText(values.total)
          chrome.browserAction.setBadgeBackgroundColor({ color: '#9A3B38' }, checkLastError) // red
          chrome.browserAction.setBadgeText({ tabId: atab.id, text: text }, checkLastError)
        } else {
          chrome.browserAction.setBadgeText({ tabId: atab.id, text: '' }, checkLastError)
        }
      },
      (error) => {
        console.log('wayback count error: ' + error)
        chrome.browserAction.setBadgeText({ tabId: atab.id, text: '' }, checkLastError)
      })
    } else {
      chrome.browserAction.setBadgeText({ tabId: atab.id, text: '' }, checkLastError)
    }
  })
}

/* * * Toolbar * * */

const validToolbarIcons = new Set(['R', 'S', 'F', 'check', 'archive'])

/**
 * Sets the toolbar icon.
 * Name string is based on PNG image filename in images/toolbar/
 * @param name {string} = one of 'archive', 'check', 'R', or 'S'
 * @param tabId {int} (optional) = tab id, else sets current or global icon.
 */
function setToolbarIcon(name, tabId = null) {
  const path = 'images/toolbar/toolbar-icon-'
  let n = validToolbarIcons.has(name) ? name : 'archive'
  let allPaths = {
    '16': (path + n + '16.png'),
    '24': (path + n + '24.png'),
    '32': (path + n + '32.png'),
    '64': (path + n + '64.png')
  }
  let details = (tabId) ? { path: allPaths, tabId: tabId } : { path: allPaths }
  chrome.browserAction.setIcon(details, checkLastError)
}

// Returns a string key from a Tab windowId and tab id.
function toolbarStateKey(atab) {
  return (atab) ? '' + atab.windowId + atab.id : ''
}

// Add state to the state set for given Tab, and update toolbar.
// state is 'S', 'R', or 'check'
// Add 'books' or 'papers' to display popup buttons for wikipedia resources.
function addToolbarState(atab, state) {
  if (!atab) { return }
  const tabKey = toolbarStateKey(atab)
  if (!gToolbarStates[tabKey]) {
    gToolbarStates[tabKey] = new Set()
  }
  gToolbarStates[tabKey].add(state)
  updateToolbar(atab)
}

// Remove state from the state set for given Tab, and update toolbar.
function removeToolbarState(atab, state) {
  if (!atab) { return }
  const tabKey = toolbarStateKey(atab)
  if (gToolbarStates[tabKey]) {
    gToolbarStates[tabKey].delete(state)
  }
  updateToolbar(atab)
}

// Returns a Set of toolbar states, or an empty set.
function getToolbarState(atab) {
  if (!atab) { return new Set() }
  const tabKey = toolbarStateKey(atab)
  return (gToolbarStates[tabKey]) ? gToolbarStates[tabKey] : new Set()
}

// Clears state for given Tab and update toolbar icon.
function clearToolbarState(atab) {
  if (!atab) { return }
  const tabKey = toolbarStateKey(atab)
  if (gToolbarStates[tabKey]) {
    gToolbarStates[tabKey].clear()
    delete gToolbarStates[tabKey]
  }
  updateToolbar(atab)
}

/**
 * Updates the toolbar icon using the state set stored in gToolbarStates.
 * Only updates icon if atab is the currently active tab, else does nothing.
 * @param atab {Tab}
 */
function updateToolbar(atab) {
  if (!atab) { return }
  const tabKey = toolbarStateKey(atab)
  // type 'normal' prevents updation of toolbar icon when it's a popup window
  chrome.tabs.query({ active: true, windowId: atab.windowId, windowType: 'normal' }, (tabs) => {
    if (tabs && tabs[0] && (tabs[0].id === atab.id) && (tabs[0].windowId === atab.windowId)) {
      let state = gToolbarStates[tabKey]
      // this order defines the priority of what icon to display
      if (state && state.has('S')) {
        setToolbarIcon('S', atab.id)
      } else if (state && state.has('F')) {
        setToolbarIcon('F', atab.id)
      } else if (state && state.has('R')) {
        setToolbarIcon('R', atab.id)
      } else if (state && state.has('check')) {
        setToolbarIcon('check', atab.id)
      } else {
        setToolbarIcon('archive', atab.id)
      }
    }
  })
}

/* * * Right-click Menu * * */

// Right-click context menu "Wayback Machine" inside the page.
chrome.contextMenus.create({
  'id': 'first',
  'title': 'Oldest Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
}, checkLastError)
chrome.contextMenus.create({
  'id': 'recent',
  'title': 'Newest Version',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
}, checkLastError)
chrome.contextMenus.create({
  'id': 'all',
  'title': 'All Versions',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
}, checkLastError)
chrome.contextMenus.create({
  'id': 'save',
  'title': 'Save Page Now',
  'contexts': ['all'],
  'documentUrlPatterns': ['*://*/*', 'ftp://*/*']
}, checkLastError)

chrome.contextMenus.onClicked.addListener((click) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (['first', 'recent', 'save', 'all'].indexOf(click.menuItemId) >= 0) {
      let url = click.linkUrl || tabs[0].url
      if (isValidUrl(url) && isNotExcludedUrl(url)) {
        let page_url = getCleanUrl(url)
        let wayback_url
        if (click.menuItemId === 'first') {
          wayback_url = 'https://web.archive.org/web/0/'
        } else if (click.menuItemId === 'recent') {
          wayback_url = 'https://web.archive.org/web/2/'
        } else if (click.menuItemId === 'all') {
          wayback_url = 'https://web.archive.org/web/*/'
        } else if (click.menuItemId === 'save') {
          let atab = tabs[0]
          let options = { 'capture_all': 1 }
          savePageNow(atab, page_url, false, options)
          return true
        }
        let open_url = wayback_url + page_url
        URLopener(open_url, page_url, true)
      } else {
        const msg = 'This URL is excluded.'
        if (isFirefox) { notify(msg) } else { alert(msg) }
      }
    }
  })
})

if (typeof module !== 'undefined') {
  module.exports = {
    private_before_default,
    tabIdPromise,
    authCheckAPI
  }
}
