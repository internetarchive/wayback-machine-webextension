// utils.js

// from 'background.js'
/*   global private_before_default */

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
  'file:',
  'edge:',
  'extension:'
]

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
  'www.washingtonpost.com',
  'edition.cnn.com'
])

// Check if in testing environment , default false, true while running tests
const isInTestEnv = false

let isArray = (a) => (!!a) && (a.constructor === Array)
let isObject = (a) => (!!a) && (a.constructor === Object)
let searchValue
let private_before_state

function initPrivateState() {
  chrome.storage.local.get(['private_before_state'], (settings) => {
    if (settings && settings.private_before_state) {
      private_before_state = new Set(settings.private_before_state)
    }
  })
}

// Use this instead of encodeURIComponent()
function fixedEncodeURIComponent(str) {
  return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
    return '%' + c.charCodeAt(0).toString(16)
  })
}

/* * * Browser Detection * * */

function getBrowser() {
  // the order of these is important!
  if (navigator.brave) { return 'brave' }
  else if (navigator.userAgent.indexOf('Edg') !== -1) { return 'edge' }
  else if (navigator.userAgent.indexOf('OPR') !== -1) { return 'opera' }
  else if (navigator.userAgent.indexOf('Firefox') !== -1) { return 'firefox' }
  else if (navigator.userAgent.indexOf('Chromium') !== -1) { return 'chromium' }
  else if (navigator.userAgent.indexOf('Chrome') !== -1) { return 'chrome' }
  else if (navigator.userAgent.indexOf('Safari') !== -1) { return 'safari' }
  else if ((navigator.userAgent.indexOf('Trident') !== -1) || (navigator.userAgent.indexOf('MSIE'))) { return 'ie' }
  else { return '' }
}

const hostURLs = {
  chrome: 'https://chrome-api.archive.org/',
  chromium: 'https://chrome-api.archive.org/',
  firefox: 'https://firefox-api.archive.org/',
  safari: 'https://safari-api.archive.org/',
  brave: 'https://brave-api.archive.org/',
  edge: 'https://edge-api.archive.org/',
  ie: 'https://edge-api.archive.org/',
  opera: 'https://opera-api.archive.org/'
}

const feedbackURLs = {
  chrome: 'https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak/reviews?hl=en',
  chromium: 'https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak/reviews?hl=en',
  firefox: 'https://addons.mozilla.org/en-US/firefox/addon/wayback-machine_new/',
  safari: 'https://apps.apple.com/us/app/wayback-machine/id1201888313'
}

const gBrowser = getBrowser()
const isChrome = (gBrowser === 'chrome') || (gBrowser === 'chromium')
const isFirefox = (gBrowser === 'firefox')
const isEdge = (gBrowser === 'edge')
const isSafari = (gBrowser === 'safari')

const hostURL = hostURLs[gBrowser] || hostURLs['chrome']
const feedbackURL = feedbackURLs[gBrowser] || '#'

/* * * Wayback functions * * */

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
 * Includes first and last timestamp.
 * @param url {string}
 * @return Promise
 * onSuccess is an object { "total": int, "first_ts": string, "last_ts": string }
 * onFail is an Error object or null.
 */
function getWaybackCount(url, onSuccess, onFail) {
  if (isValidUrl(url) && isNotExcludedUrl(url)) {
    const requestUrl = hostURL + '__wb/sparkline'
    const requestParams = '?collection=web&output=json&url=' + fixedEncodeURIComponent(url)
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
      let values = { total: total, first_ts: json.first_ts, last_ts: json.last_ts }
      onSuccess(values)
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
  const requestUrl = hostURL + 'wayback/available'
  const requestParams = 'url=' + fixedEncodeURIComponent(url)
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
 * Checks that url isn't an archive.org domain.
 * @param url {string}
 * @return {bool}
 */
function isArchiveUrl(url) {
  if (typeof url !== 'string') { return false }
  try {
    const hostname = new URL(url).hostname
    return (hostname === 'archive.org') || hostname.endsWith('.archive.org')
  } catch (e) {
    // url not formated correctly
    return false
  }
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

/**
 * Returns a URL, adding 'https' if schema part missing, else null.
 * @param url {string}
 * @return {string} or null
 */
function makeValidURL(url) {
  return isValidUrl(url) ? url : (url.includes('.') ? 'https://' + url : null)
}

// Returns substring of URL after :// not including "www." if present.
// Also crops trailing slash.
// Returns null if match not found, or if url is not a string.
function cropPrefix(url) {
  if (typeof url === 'string') {
    if (url.slice(-1) === '/') { url = url.slice(0, -1) }
    let re = /^(?:[a-z]+:\/\/)?(?:www\.)?(.*)$/
    let match = re.exec(url)
    return match[1]
  }
  return null
}

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
  if (url && url.includes('web.archive.org')) {
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
    chrome.storage.local.get(['view_setting'], (settings) => {
      if (settings) { // OK if view_setting undefined
        opener(url, settings.view_setting, cb)
      }
    })
  } else {
    opener(url, op, cb)
  }
}

function opener(url, option, callback) {
  if (option === 'tab' || option === undefined) {
    chrome.tabs.create({ url: url }, (tab) => {
      if (callback) { callback(tab.id) }
    })
  } else {
    let w, h
    if (screen.width > screen.height) {
      // landscape screen
      w = Math.floor(screen.width * 0.666)
      h = Math.floor(w * 0.75)
    } else {
      // portrait screen (likely mobile)
      w = Math.floor(screen.width * 0.9)
      h = Math.floor(screen.height * 0.9)
    }
    chrome.windows.create({ url: url, width: w, height: h, top: 0, left: 0, type: 'popup' }, (window) => {
      if (callback) { callback(window.tabs[0].id) }
    })
  }
}

function notify(message, callback) {
  let options = {
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
    /* Features */
    private_mode_setting: false,
    not_found_setting: false,
    wm_count_setting: false,
    wiki_setting: false,
    amazon_setting: false,
    tvnews_setting: false,
    auto_archive_setting: false,
    fact_check_setting: false,
    /* General */
    resource_list_setting: false,
    email_outlinks_setting: false,
    view_setting: 'tab',
    show_settings_tab_tip: true,
    private_before_state: Array.from(private_before_default)
  })
}

// Turn on these Settings after accepting terms.
function afterAcceptOptions () {
  chrome.storage.local.set({
    /* Features */
    not_found_setting: true,
    wm_count_setting: false,
    wiki_setting: false,
    amazon_setting: false,
    tvnews_setting: false,
    fact_check_setting: false,
    /* General */
    email_outlinks_setting: false
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    isArray,
    isObject,
    getErrorMessage,
    getUrlByParameter,
    getWaybackUrlFromResponse,
    isArchiveUrl,
    isValidUrl,
    makeValidURL,
    cropPrefix,
    isNotExcludedUrl,
    get_clean_url,
    wmAvailabilityCheck,
    openByWindowSetting,
    sleep,
    notify,
    attachTooltip,
    getWaybackCount,
    badgeCountText,
    isChrome,
    isFirefox,
    isEdge,
    isSafari,
    hostURL,
    timestampToDate,
    dateToTimestamp,
    viewableTimestamp,
    initDefaultOptions,
    afterAcceptOptions,
    feedbackURL,
    newshosts,
    private_before_state,
    initPrivateState,
    fixedEncodeURIComponent,
    searchValue,
    isInTestEnv
  }
}
