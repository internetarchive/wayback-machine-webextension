// utils.js

let isArray = (a) => (!!a) && (a.constructor === Array)
let isObject = (a) => (!!a) && (a.constructor === Object)

let isFirefox = (navigator.userAgent.indexOf('Firefox') !== -1)
const hostURL = isFirefox ? 'https://firefox-api.archive.org/' : 'https://chrome-api.archive.org/'
const feedbackPageURL = isFirefox ? 'https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/' : 'https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak/reviews?hl=en'

const newshosts = new Set([
  'apnews.com',
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
])

var private_before_state 
chrome.storage.local.get(['private_before_state'], (event) => {
  private_before_state= new Set(event.private_before_state)
})

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
    const timeoutPromise = new Promise((resolve, reject) => {
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
    .then((json) => {
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
  'chrome:',
  'chrome-extension:',
  'about:',
  'moz-extension:',
  '192.168.',
  '10.',
  'file:'
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

function remove_port(url) {
  if (url.substr(-4) === ':80/') {
    url = url.substring(0, url.length - 4)
  }
  return url
}

function remove_wbm(url) {
  let pos = url.indexOf('/http')
  let new_url = ''
  if (pos !== -1) {
    new_url = url.substring(pos + 1)
  } else {
    pos = url.indexOf('/www')
    new_url = url.substring(pos + 1)
  }
  return remove_port(new_url)
}

// Function to clean the URL if the user is on 'web.archive.org'
function get_clean_url(url) {
  if (url.includes('web.archive.org')) {
    url = remove_wbm(url)
  }
  return url
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
 * Converts a Date object into a Wayback timestamp string.
 * @param {Date}
 * @return timestamp {string} as "yyyyMMddHHmmss" in UTC time zone, or null.
 */
function dateToTimestamp(date) {
  let timestamp = null
  function pad(num) {
    return (num < 10) ? ('0' + num) : ('' + num)
  }
  if (date instanceof Date) {
    let yyyy = date.getUTCFullYear()
    let MM = date.getUTCMonth() + 1
    let dd = date.getUTCDate()
    let HH = date.getUTCHours()
    let mm = date.getUTCMinutes()
    let ss = date.getUTCSeconds()
    timestamp = yyyy + pad(MM) + pad(dd) + pad(HH) + pad(mm) + pad(ss)
  }
  return timestamp
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

function getUrlByParameter(name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

function openByWindowSetting(url, op = null, cb) {
  if (op === null) {
    chrome.storage.local.get(['show_context'], (event) => { opener(url, event.show_context, cb) })
  } else {
    opener(url, op)
  }
}

function opener(url, option, callback) {
  if (option === 'tab' || option === undefined) {
    chrome.tabs.create({ url: url }, (tab) => {
      if (callback) { callback(tab.id) }
    })
  } else {
    let width = Math.floor(window.screen.availWidth * 0.75)
    let height = Math.floor(window.screen.availHeight * 0.90)
    chrome.windows.create({ url: url, width: width, height: height, top: 0, left: 0, type: 'popup' }, (window) => {
      if (callback) { callback(window.tabs[0].id) }
    })
  }
}
function notify(message, callback) {
  var options = {
    type: 'basic',
    title: 'WayBack Machine',
    message: message,
    iconUrl: chrome.extension.getURL('images/app-icon/app-icon96.png')
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
    .on('mouseenter', () => {
      $(anchor).tooltip('show')
      $('.popup_box').on('mouseleave', () => {
        setTimeout(() => {
          if (!$(`.${anchor.attr('class')}[href*="${anchor.attr('href')}"]:hover`).length) {
            $(anchor).tooltip('hide')
          }
        }, time)
      })
    })
    .on('mouseleave', () => {
      setTimeout(() => {
        if (!$('.popup_box:hover').length) {
          $(anchor).tooltip('hide')
        }
      }, time)
    })
}

// Default Settings prior to accepting terms.
function initDefaultOptions () {
  chrome.storage.local.set({
    agreement: false, // needed for firefox
    spn_outlinks: false,
    spn_screenshot: false,
    selectedFeature: null,
    /* General */
    wm_count: false,
    resource: false,
    auto_archive: false,
    email_outlinks: false,
    not_found_popup: false,
    auto_update_context: false,
    show_resource_list: false,
    show_context: 'tab',
    private_mode: false,
    /* Contexts */
    showall: true,
    alexa: true,
    domaintools: false,
    wbmsummary: true,
    annotations: true,
    tagcloud: true,
    private_before_state:Array.from(private_before_default)
  })
}

// Turn on these Settings after accepting terms.
function afterAcceptOptions () {
  chrome.storage.local.set({
    /* General */
    wm_count: true,
    resource: true,
    email_outlinks: true,
    not_found_popup: true
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    isArray,
    isObject,
    getErrorMessage,
    getUrlByParameter,
    getWaybackUrlFromResponse,
    isValidUrl,
    isNotExcludedUrl,
    get_clean_url,
    wmAvailabilityCheck,
    openByWindowSetting,
    sleep,
    notify,
    attachTooltip,
    getWaybackCount,
    badgeCountText,
    isFirefox,
    hostURL,
    timestampToDate,
    dateToTimestamp,
    viewableTimestamp,
    initDefaultOptions,
    afterAcceptOptions,
    feedbackPageURL,
    newshosts,
    private_before_state
  }
}
