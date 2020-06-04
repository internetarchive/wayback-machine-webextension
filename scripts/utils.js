// utils.js

let isArray = (a) => (!!a) && (a.constructor === Array)
let isObject = (a) => (!!a) && (a.constructor === Object)
let waybackCountCache = {}

let isFirefox = (navigator.userAgent.indexOf('Firefox') !== -1)
const hostURL = isFirefox ? 'https://firefox-api.archive.org/' : 'https://chrome-api.archive.org/'

/**
 * Convert given int to a string with metric suffix, separators localized.
 * Used for toolbar button badge.
 * @param count {int}
 * @return {string}
 */
function badgeCountText(count) {
  let text = ''
  if (count < 1000) {
    text = count.toLocaleString()
  } else if (count < 10000) {
    text = (Math.round(count / 100) / 10.0).toLocaleString() + 'K'
  } else if (count < 1000000) {
    text = Math.round(count / 1000).toLocaleString() + 'K'
  } else if (count >= 1000000) {
    text = Math.round(count / 1000000).toLocaleString() + 'M'
  }
  return text
}

/**
 * Retrieves total count of snapshots stored in the Wayback Machine for given url.
 * @param url {string}
 * @return Promise
 */
function getWaybackCount(url, onSuccess, onFail) {
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    const requestUrl = hostURL + '__wb/sparkline'
    const requestParams = '?collection=web&output=json&url=' + encodeURIComponent(url)
    const timeoutPromise = new Promise(function (resolve, reject) {
      setTimeout(() => {
        reject(new Error('timeout'))
      }, 30000)
      fetch(requestUrl + requestParams, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      .then(resolve, reject)
    })
    return timeoutPromise
    .then(response => response.json())
    .then(json => {
      const years = json.years
      let total = 0
      if (isObject(years)) {
        for (let y in years) {
          for (let c of years[y]) {
            total += c
          }
        }
      }
      onSuccess(total)
    })
    .catch(error => {
      if (onFail) { onFail(error) }
    })
  } else {
    if (onFail) { onFail(null) }
  }
}

function getCachedWaybackCount(url, onSuccess, onFail) {
  let cacheTotal = waybackCountCache[url]
  if (cacheTotal) {
    onSuccess(cacheTotal)
  } else {
    getWaybackCount(url, (total) => {
      waybackCountCache[url] = total
      onSuccess(total)
    }, onFail)
  }
}

function clearCountCache() {
  waybackCountCache = {}
}

/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
  var requestUrl = hostURL + 'wayback/available'
  var requestParams = 'url=' + encodeURIComponent(url)
  fetch(requestUrl, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    body: requestParams
  })
    .then(response => response.json())
    .then(function(json) {
      let wayback_url = getWaybackUrlFromResponse(json)
      let timestamp = getWaybackTimestampFromResponse(json)
      if (wayback_url !== null) {
        onsuccess(wayback_url, url, timestamp)
      } else if (onfail) {
        onfail()
      }
    })
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidUrl(url) {
  return ((typeof url) === 'string' &&
    (url.indexOf('http://') === 0 || url.indexOf('https://') === 0))
}

// list of excluded URLs
const excluded_urls = [
  'localhost',
  '0.0.0.0',
  '127.0.0.1',
  'chrome://',
  'chrome://newtab',
  'chrome.google.com/webstore',
  'chrome-extension://',
  'web.archive.org',
  'about:debugging',
  'about:newtab',
  'about:preferences',
  'moz-extension://'
]

// Function to check whether it is a valid URL or not
function isNotExcludedUrl(url) {
  const len = excluded_urls.length
  for (let i = 0; i < len; i++) {
    if (url.startsWith('http://' + excluded_urls[i]) || url.startsWith('https://' + excluded_urls[i]) || url.startsWith(excluded_urls[i])) {
      return false
    }
  }
  return true
}

/**
 * Extracts the latest saved Wayback URL from wmAvailabilityCheck() response.
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
  if (response.results &&
    response.results[0] &&
    response.results[0].archived_snapshots &&
    response.results[0].archived_snapshots.closest &&
    response.results[0].archived_snapshots.closest.available &&
    response.results[0].archived_snapshots.closest.available === true &&
    response.results[0].archived_snapshots.closest.status.indexOf('2') === 0 &&
    isValidUrl(response.results[0].archived_snapshots.closest.url)) {
    // not sure why we're replacing http: with https: here
    return response.results[0].archived_snapshots.closest.url.replace(/^http:/, 'https:')
  } else {
    return null
  }
}

/**
 * Extracts latest saved timestamp from wmAvailabilityCheck() response.
 * @param response {object}
 * @return {string or null} as "yyyyMMddHHmmss"
 */
function getWaybackTimestampFromResponse(response) {
  if (response.results &&
    response.results[0] &&
    response.results[0].archived_snapshots &&
    response.results[0].archived_snapshots.closest &&
    response.results[0].archived_snapshots.closest.available &&
    response.results[0].archived_snapshots.closest.available === true &&
    response.results[0].archived_snapshots.closest.status.indexOf('2') === 0 &&
    isValidUrl(response.results[0].archived_snapshots.closest.url)) {
    return response.results[0].archived_snapshots.closest.timestamp
  } else {
    return null
  }
}

/**
 * Converts a Wayback timestamp string into a Date object.
 * @param timestamp {string} as "yyyyMMddHHmmss" in UTC time zone.
 * @return {Date or null}
 */
function timestampToDate(timestamp) {
  let date = null
  if (timestamp && timestamp.length >= 4) {
    date = new Date(Date.UTC(
      Number(timestamp.substring(0, 4)), // year
      (Number(timestamp.substring(4, 6)) || 1) - 1, // month
      (Number(timestamp.substring(6, 8)) || 1), // day
      Number(timestamp.substring(8, 10)), // hours
      Number(timestamp.substring(10, 12)), // min
      Number(timestamp.substring(12, 14)) // sec
    ))
    if (isNaN(date)) { return null }
  }
  return date
}

/**
 * Return localized date string, or time if within last 24 hours.
 * @param timestamp {string} as "yyyyMMddHHmmss" in UTC time zone.
 * @return string or ''
 */
function viewableTimestamp(timestamp) {
  let date = timestampToDate(timestamp)
  let text = ''
  if (date) {
    if ((Date.now() - date.getTime()) > 86400000) {
      // over 24 hours
      text = date.toLocaleDateString([], { year: 'numeric', month: 'numeric', day: 'numeric' }) // e.g.'5/2/2020'
    } else {
      // under 24 hours
      text = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }) // e.g.'7:00 PM'
    }
  }
  return text
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Customizes error handling
 * @param status {string}
 * @return {string}
 */
function getErrorMessage(req) {
  return 'The requested service ' + req.url + ' failed: ' + req.status + ', ' + req.statusText
}

function getUrlByParameter (name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function openByWindowSetting(url, op = null, cb) {
  if (op === null) {
    chrome.storage.sync.get(['show_context'], function (event) { opener(url, event.show_context, cb) })
  } else {
    opener(url, op)
  }
}

function opener(url, option, callback) {
  if (option === 'tab' || option === undefined) {
    chrome.tabs.create({ url: url }, function (tab) {
      if (callback) { callback(tab.id) }
    })
  } else {
    let width = Math.floor(window.screen.availWidth * 0.75)
    let height = Math.floor(window.screen.availHeight * 0.90)
    chrome.windows.create({ url: url, width: width, height: height, top: 0, left: 0, type: 'popup' }, function (window) {
      if (callback) { callback(window.tabs[0].id) }
    })
  }
}
function notify(message, callback) {
  var options = {
    type: 'basic',
    title: 'WayBack Machine',
    message: message,
    iconUrl: chrome.extension.getURL('images/icon@2x.png')
  }
  chrome.notifications.create(options, callback)
}

function attachTooltip (anchor, tooltip, pos = 'right', time = 200) {
  // Modified code from https://embed.plnkr.co/plunk/HLqrJ6 to get tooltip to stay
  return anchor.attr({
    'data-toggle': 'tooltip',
    'title': tooltip
  })
    .tooltip({
      animated: false,
      placement: `${pos} auto`,
      html: true,
      trigger: 'manual'
    })
  // Handles staying open
    .on('mouseenter', function () {
      $(anchor).tooltip('show')
      $('.popup_box').on('mouseleave', function () {
        setTimeout(function () {
          if (!$(`.${anchor.attr('class')}[href*="${anchor.attr('href')}"]:hover`).length) {
            $(anchor).tooltip('hide')
          }
        }, time)
      })
    })
    .on('mouseleave', function () {
      setTimeout(function () {
        if (!$('.popup_box:hover').length) {
          $(anchor).tooltip('hide')
        }
      }, time)
    })
}

function resetExtensionStorage () {
  chrome.storage.sync.set({
    agreement: false,
    show_context: 'tab',
    resource: false,
    auto_update_context: false,
    wm_count: false,
    auto_archive: false,
    email_outlinks: false,
    spn_outlinks: false,
    spn_screenshot: false,
    alexa: false,
    domaintools: false,
    wbmsummary: false,
    annotations: false,
    tagcloud: false,
    showall: false,
    not_found_popup: true
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    isArray: isArray,
    isObject: isObject,
    getErrorMessage: getErrorMessage,
    getUrlByParameter: getUrlByParameter,
    getWaybackUrlFromResponse: getWaybackUrlFromResponse,
    isValidUrl: isValidUrl,
    isNotExcludedUrl: isNotExcludedUrl,
    wmAvailabilityCheck: wmAvailabilityCheck,
    openByWindowSetting: openByWindowSetting,
    sleep: sleep,
    notify: notify,
    attachTooltip: attachTooltip,
    getWaybackCount: getWaybackCount,
    getCachedWaybackCount: getCachedWaybackCount,
    clearCountCache: clearCountCache,
    badgeCountText: badgeCountText,
    hostURL: hostURL,
    timestampToDate: timestampToDate,
    viewableTimestamp: viewableTimestamp,
    resetExtensionStorage: resetExtensionStorage
  }
}
