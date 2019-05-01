/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck (url, onsuccess, onfail) {
  fetch('https://archive.org/wayback/available?url=' + encodeURI(url))
    .then(resp => resp.json())
    .then(resp => {
      const waybackUrl = getWaybackUrlFromResponse(resp)
      if (waybackUrl !== null) {
        onsuccess(waybackUrl, url)
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
function isValidUrl (url) {
  return ((typeof url) === 'string' &&
    (url.indexOf('http://') === 0 || url.indexOf('https://') === 0))
}

// List of excluded Urls
const excludedUrls = [
  'localhost',
  '0.0.0.0',
  '127.0.0.1',
  'chrome://',
  'web.archive.org',
  'web-beta.archive.org',
  'chrome.google.com/webstore'
]
// Function to check whether it is a valid URL or not
function isNotExcludedUrl (url) {
  for (let i = 0, len = excludedUrls.length; i < len; i++) {
    if (url.startsWith('http://' + excludedUrls[i]) || url.startsWith('https://' + excludedUrls[i]) || url.startsWith(excludedUrls[i])) {
      return false
    }
  }
  return true
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse (response) {
  if (response.results &&
    response.results[0] &&
    response.results[0].archived_snapshots &&
    response.results[0].archived_snapshots.closest &&
    response.results[0].archived_snapshots.closest.available &&
    response.results[0].archived_snapshots.closest.available === true &&
    response.results[0].archived_snapshots.closest.status.indexOf('2') === 0 &&
    isValidUrl(response.results[0].archived_snapshots.closest.url)) {
    return response.results[0].archived_snapshots.closest.url.replace(/^http:/, 'https:')
  } else {
    return null
  }
}

/**
 * Customizes error handling
 * @param status {string}
 * @return {string}
 */

function getUrlByParameter (name) {
  const url = new URL(window.location.href)
  return url.searchParams.get(name)
}

if (typeof module !== 'undefined') {
  module.exports = {
    getUrlByParameter: getUrlByParameter,
    getWaybackUrlFromResponse: getWaybackUrlFromResponse,
    isValidUrl: isValidUrl,
    isNotExcludedUrl: isNotExcludedUrl,
    wmAvailabilityCheck: wmAvailabilityCheck
  }
}
