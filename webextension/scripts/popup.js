// popup.js

// from 'utils.js'
/*   global isArchiveUrl, isValidUrl, makeValidURL, isNotExcludedUrl, getCleanUrl, openByWindowSetting, hostURL */
/*   global feedbackURL, newshosts, dateToTimestamp, timestampToDate, viewableTimestamp, fixedEncodeURIComponent */
/*   global attachTooltip, checkLastError, cropScheme, hostHeaders */

let searchBoxTimer
let isLoggedIn = false

// don't reference in setup functions as there's a delay in assignment
let activeURL, activeTab

function homepage() {
  openByWindowSetting('https://web.archive.org/')
}

// If the popup displays, we know user already agreed in Welcome page.
// This is a fix for Safari resetting the 'agreement' setting.
function initAgreement() {
  chrome.storage.local.set({ agreement: true }, () => {})
}

// Popup tip over settings tab icon after first load.
function showSettingsTabTip() {
  let tt = $('<div>').append($('<p>').text('There are more great features in Settings!').attr({ 'class': 'setting-tip' }))[0].outerHTML
  let tabItem = $('#settings-tab-btn').parent()
  setTimeout(() => {
    tabItem.append(attachTooltip(tabItem, tt, 'top'))
    .tooltip('show')
    .on('mouseenter', () => {
      $(tabItem).tooltip('hide')
      // prevent tooltip from ever showing again once mouse entered
      chrome.storage.local.set({ show_settings_tab_tip: false }, () => {})
    })
  }, 500)
}

function initActiveTabURL() {
  activeTab = null
  activeURL = null
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      activeTab = tabs[0]
      activeURL = tabs[0].url
    }
  })
}

function setupSettingsTabTip() {
  chrome.storage.local.get(['show_settings_tab_tip'], (settings) => {
    if (settings && settings.show_settings_tab_tip) {
      showSettingsTabTip()
    }
  })
}

function doSaveNow() {
  const url = getCleanUrl(activeURL)
  if (url) {
    let options = { 'capture_all': 1 }
    if ($('#chk-outlinks').prop('checked') === true) {
      options['capture_outlinks'] = 1
      if ($('#email-outlinks-setting').prop('checked') === true) {
        options['email_result'] = 1
      }
    }
    if ($('#chk-screenshot').prop('checked') === true) {
      options['capture_screenshot'] = 1
    }
    chrome.runtime.sendMessage({
      message: 'saveurl',
      page_url: url,
      options: options,
      atab: activeTab
    }, checkLastError)
    showSaving()
  }
}

// Updates SPN button UI depending on logged-in status and fetches last saved time.
function updateLastSaved() {
  checkAuthentication((result) => {
    checkLastError()
    if (result && result.auth_check) {
      loginSuccess()
    } else {
      loginError()
    }
  })
}

function loginError() {
  isLoggedIn = false
  // uncomment to restore Bulk Save button
  // $('#bulk-save-btn').attr('disabled', true)
  // $('#bulk-save-btn').attr('title', 'Log in to use')
  // $('#bulk-save-btn').off('click')
  $('#spn-btn').addClass('flip-inside')
  $('#spn-back-label').text('Log In to Save Page')
  $('#spn-front-label').parent().attr('disabled', true)
  $('#spn-btn').off('click').on('click', show_login_page)
  $('#last-saved-msg').hide()
  if (activeURL) {
    if (!isNotExcludedUrl(activeURL)) { setExcluded() }
  }
}

function loginSuccess() {
  isLoggedIn = true
  $('.tab-item').css('width', '18%')
  $('#logout-tab-btn').css('display', 'inline-block')
  $('#spn-front-label').parent().removeAttr('disabled')
  $('#spn-btn').off('click')
  $('#spn-btn').removeClass('flip-inside')
  // uncomment to restore Bulk Save button
  // $('#bulk-save-btn').removeAttr('disabled')
  // $('#bulk-save-btn').attr('title', '')
  // $('#bulk-save-btn').click(bulkSave)

  if (activeURL) {
    if (isValidUrl(activeURL) && isNotExcludedUrl(activeURL) && !isArchiveUrl(activeURL)) {
      $('#spn-btn').on('click', doSaveNow)
      chrome.storage.local.get(['private_mode_setting'], (settings) => {
        // auto save page
        if (settings && (settings.private_mode_setting === false)) {
          chrome.runtime.sendMessage({
            message: 'getLastSaveTime',
            page_url: activeURL
          }, (message) => {
            checkLastError()
            if (message && (message.message === 'last_save') && message.timestamp) {
              $('#last-saved-msg').text('Last Saved ' + viewableTimestamp(message.timestamp)).show()
            }
          })
        }
      })
    } else {
      setExcluded()
      $('#spn-back-label').text('URL not supported')
    }
  }
}

// Checks if user is logged in by checking if 'logged-in-sig' cookie exists (not by API call).
// returns callback object: { auth_check: bool }
function checkAuthentication(callback) {
  chrome.runtime.sendMessage({
    message: 'auth_check'
  }, callback)
}

function recent_capture() {
  const url = getCleanUrl(activeURL)
  if (url) {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/2/',
      page_url: url,
      method: 'recent'
    }, checkLastError)
  }
}

function first_capture() {
  const url = getCleanUrl(activeURL)
  if (url) {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/0/',
      page_url: url,
      method: 'first'
    }, checkLastError)
  }
}

function view_all() {
  const url = getCleanUrl(activeURL)
  if (url) {
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/*/',
      page_url: url,
      method: 'viewall'
    }, checkLastError)
  }
}

function social_share(eventObj) {
  let parent = eventObj.target.parentNode
  let id = eventObj.target.getAttribute('id')
  if (id === null) {
    id = parent.getAttribute('id')
  }
  // Share wayback link to the most recent snapshot of URL at the time this is called.
  let clean_url = getCleanUrl(activeURL)
  if (isValidUrl(clean_url)) {
    let timestamp = dateToTimestamp(new Date())
    let wayback_url = 'https://web.archive.org/web/' + timestamp + '/'
    let sharing_url = wayback_url + clean_url

    // Latest Social Share URLs: https://github.com/bradvin/social-share-urls
    if (id.includes('facebook-share-btn')) {
      openByWindowSetting('https://www.facebook.com/sharer.php?u=' + fixedEncodeURIComponent(sharing_url))
    } else if (id.includes('twitter-share-btn')) {
      openByWindowSetting('https://twitter.com/intent/tweet?url=' + fixedEncodeURIComponent(sharing_url))
    } else if (id.includes('linkedin-share-btn')) {
      openByWindowSetting('https://www.linkedin.com/sharing/share-offsite/?url=' + fixedEncodeURIComponent(sharing_url))
    } else if (id.includes('copy-link-btn') && navigator.clipboard) {
      navigator.clipboard.writeText(sharing_url).then(() => {
        let copiedMsg = $('#link-copied-msg')
        copiedMsg.text('Copied to Clipboard').fadeIn('fast')
        setTimeout(() => {
          copiedMsg.fadeOut('fast')
        }, 1500)
      }).catch(err => {
        console.log('Not copied to clipboard: ', err)
      })
    }
  }
}

function searchTweet() {
  let clean_url = getCleanUrl(activeURL)
  if(isValidUrl(clean_url)){
    const curl = cropScheme(clean_url)
    if (curl) {
      let surl = curl
      if (surl.slice(-1) === '/') {
        // remove trailing slash if present
        surl = surl.substring(0, surl.length - 1)
      }
      const query = `(${surl} OR https://${curl} OR http://${curl})`
      let open_url = 'https://twitter.com/search?q=' + fixedEncodeURIComponent(query)
      openByWindowSetting(open_url)
    }
  }
}

// Update the UI when user is using the Search Box.
function useSearchBox() {
  chrome.runtime.sendMessage({ message: 'clearCountBadge' })
  chrome.runtime.sendMessage({ message: 'clearResource' })
  $('#suggestion-box').text('').hide()
  $('#url-not-supported-msg').hide()
  $('#using-search-msg').show()
  $('#readbook-container').hide()
  $('#tvnews-container').hide()
  $('#wiki-container').hide()
  clearWaybackCount()
  updateLastSaved()
}

// Setup keyboard handler for Search Box.
function setupSearchBox() {
  const search_box = document.getElementById('search-input')
  search_box.addEventListener('keyup', (e) => {
    // exclude UP and DOWN keys from keyup event
    if (!(e.key === "ArrowUp" || e.key === "ArrowDown" ) && (search_box.value.length >= 0) && isNotExcludedUrl(search_box.value)) {
      activeURL = getCleanUrl(makeValidURL(search_box.value))
      // use activeURL if it is valid, else update UI
      activeURL ? useSearchBox() : $('#using-search-msg').hide()
    }
  })
}

function arrow_key_access() {
  const list = document.getElementById('suggestion-box')
  const search_box = document.getElementById('search-input')
  let index = search_box

  search_box.addEventListener('keydown', (e) => {
    // listen for up key
    if (e.key === "ArrowUp") {
      if (index === list.firstChild && index && list.lastChild) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = list.lastChild
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      } else if (index === search_box) {
        /* skip */
      } else if (index !== search_box && index && index.previousElementSibling) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = index.previousElementSibling
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      }

      // listen for down key
    } else if (e.key === "ArrowDown") {
      if (index === search_box && list.firstChild) {
        index = list.firstChild
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      } else if (index === list.lastChild && list.lastChild) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = list.firstChild
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      } else if (index !== search_box && index && index.nextElementSibling) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = index.nextElementSibling
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      }
    } else {
      index = search_box
    }
  })
}

function display_list(key_word) {
  $('#suggestion-box').text('').hide()
  $.getJSON(hostURL + '__wb/search/host?q=' + key_word, (data) => {
    $('#suggestion-box').text('').hide()
    if (data.hosts.length > 0 && $('#search-input').val() !== '') {
      $('#suggestion-box').show()
      arrow_key_access()
      for (let i = 0; i < data.hosts.length; i++) {
        $('#suggestion-box').append(
          $('<div>').attr('role', 'button').text(data.hosts[i].display_name).click((event) => {
            document.getElementById('search-input').value = event.target.innerHTML
            activeURL = getCleanUrl(makeValidURL(event.target.innerHTML))
            if (activeURL) { useSearchBox() }
          })
        )
      }
    }
  })
}

function display_suggestions(e) {
  // exclude arrow keys from keypress event
  if (e.key === "ArrowUp" || e.key === "ArrowDown") { return false }
  $('#suggestion-box').text('').hide()
  if (e.key === "Enter") {
    clearTimeout(searchBoxTimer)
    e.preventDefault()
  } else {
    if ($('#search-input').val().length >= 1) {
      $('#url-not-supported-msg').hide()
    } else {
      $('#url-not-supported-msg').show()
      $('#using-search-msg').hide()
    }
    clearTimeout(searchBoxTimer)
    // Call display_list function if the difference between keypress is greater than 300ms (Debouncing)
    searchBoxTimer = setTimeout(() => {
      const query = $('#search-input').val()
      display_list(query)
    }, 300)
  }
}

function open_feedback_page() {
  openByWindowSetting(feedbackURL)
}

function open_donations_page() {
  let donation_url = 'https://archive.org/donate/'
  openByWindowSetting(donation_url)
}

function about_support() {
  openByWindowSetting('about.html')
}

function sitemap() {
  if (activeURL && isValidUrl(activeURL)) {
    openByWindowSetting('https://web.archive.org/web/sitemap/' + activeURL)
  }
}

function showSettings() {
  $('#popup-page').hide()
  $('#login-page').hide()
  $('#setting-page').show()
}

function show_login_page() {
  $('#popup-page').hide()
  $('#setting-page').hide()
  $('#login-message').hide()
  $('#login-page').show()
}

// not used
/*
function show_all_screens() {
  const url = getCleanUrl(activeURL)
  if (url) {
    chrome.runtime.sendMessage({ message: 'showall', url: url })
  }
}
*/

// Displays 'Read Book' button if on Amazon Books.
// May fetch info about Amazon Books if not already cached, then update button click handler.
//
function setupReadBook() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const url = tabs[0].url
      if (url.includes('www.amazon') && url.includes('/dp/')) {
        chrome.runtime.sendMessage({ message: 'getToolbarState', atab: tabs[0] }, (result) => {
          checkLastError()
          let state = (result && result.stateArray) ? new Set(result.stateArray) : new Set()
          if (state.has('R')) {
            $('#readbook-container').show()
            chrome.storage.local.get(['tab_url', 'detail_url', 'view_setting'], (settings) => {
              if (!settings) { return }
              const stored_url = settings.tab_url
              const detail_url = settings.detail_url
              const context = settings.view_setting
              // Checking if the tab url is the same as the last stored one
              if (stored_url === url) {
                // if same, use the previously fetched url
                $('#readbook-btn').click(() => {
                  openByWindowSetting(detail_url, context)
                })
              } else {
                // if not, fetch it again
                fetch(hostURL + 'services/context/amazonbooks?url=' + url, {
                  method: 'GET',
                  headers: hostHeaders
                })
                .then(res => res.json())
                .then(response => {
                  if (response['metadata'] && response['metadata']['identifier-access']) {
                    const new_details_url = response['metadata']['identifier-access']
                    $('#readbook-btn').click(() => {
                      openByWindowSetting(new_details_url, context)
                    })
                  }
                })
              }
            })
          }
        })
      }
    }
  })
}

// Display 'TV News Clips' button if current url is present in newshosts[]
function setupNewsClips() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const url = tabs[0].url
      const news_host = new URL(url).hostname
      if (newshosts.has(news_host)) {
        chrome.runtime.sendMessage({ message: 'getToolbarState', atab: tabs[0] }, (result) => {
          checkLastError()
          let state = (result && result.stateArray) ? new Set(result.stateArray) : new Set()
          if (state.has('R')) {
            $('#tvnews-container').show()
            $('#tvnews-btn').click(() => {
              chrome.storage.local.get(['view_setting'], function (settings) {
                if (settings && settings.view_setting) {
                  const URL = chrome.runtime.getURL('tvnews.html') + '?url=' + url
                  openByWindowSetting(URL, settings.view_setting)
                } else {
                  console.log('Missing view_setting!')
                }
              })
            })
          }
        })
      }
    }
  })
}

// Display 'Cited Books' & 'Cited Papers' buttons.
function setupWikiButtons() {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      const url = tabs[0].url
      if (url.match(/^https?:\/\/[\w\.]*wikipedia.org/)) {
        chrome.runtime.sendMessage({ message: 'getToolbarState', atab: tabs[0] }, (result) => {
          checkLastError()
          let state = (result && result.stateArray) ? new Set(result.stateArray) : new Set()
          if (state.has('R')) {
            // show wikipedia cited books & papers buttons
            if (state.has('books') && !state.has('papers')) {
              // books only
              $('#wikibooks-btn').addClass('btn-wide')
              $('#wikipapers-btn').hide()
            } else if (!state.has('books') && state.has('papers')) {
              // papers only
              $('#wikibooks-btn').hide()
              $('#wikipapers-btn').addClass('btn-wide')
            }
            $('#wiki-container').show()
            $('#wikibooks-btn').click(() => {
              const URL = chrome.runtime.getURL('cited-books.html') + '?url=' + fixedEncodeURIComponent(url)
              openByWindowSetting(URL)
            })
            $('#wikipapers-btn').click(() => {
              const URL = chrome.runtime.getURL('cited-papers.html') + '?url=' + fixedEncodeURIComponent(url)
              openByWindowSetting(URL)
            })
          }
        })
      }
    }
  })
}

// Display purple 'Fact Check' button. (NOT USED)
/*
function setupFactCheck() {
  $('#fact-check-btn').click(showContext)
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0] && isNotExcludedUrl(tabs[0].url)) {
      chrome.storage.local.get(['fact_check_setting'], (settings) => {
        if (settings && settings.fact_check_setting) {
          chrome.runtime.sendMessage({ message: 'getToolbarState', atab: tabs[0] }, (result) => {
            checkLastError()
            let state = (result && result.stateArray) ? new Set(result.stateArray) : new Set()
            if (state.has('F')) {
              // show purple fact-check button
              $('#fact-check-btn').addClass('btn-purple')
            }
          })
        }
      })
    }
  })
}
*/

// Common function to show different context
function showContext(eventObj) {
  const id = eventObj.target.getAttribute('id')
  const url = getCleanUrl(activeURL)
  if (url && isValidUrl(url)) {
    if (id.includes('alexa-btn')) {
      const hostname = new URL(url).hostname
      const alexaUrl = 'https://www.alexa.com/siteinfo/' + hostname
      openByWindowSetting(alexaUrl)
    } else if (id.includes('annotations-btn')) {
      const annotationsUrl = chrome.runtime.getURL('annotations.html') + '?url=' + url
      openByWindowSetting(annotationsUrl)
    } else if (id.includes('tag-cloud-btn')) {
      const tagsUrl = chrome.runtime.getURL('wordcloud.html') + '?url=' + url
      openByWindowSetting(tagsUrl)
    }
  }
}

function setExcluded() {
  $('#spn-btn').addClass('flip-inside')
  $('#last-saved-msg').hide()
  $('#url-not-supported-msg').text('URL not supported')
}

// For removing focus outline around buttons on mouse click, while keeping during keyboard use.
function clearFocus() {
  document.activeElement.blur()
}

// Displays and updates or clears the Wayback Count badge.
function setupWaybackCount() {
  chrome.storage.local.get(['wm_count_setting'], (settings) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs && tabs[0]) {
        // not using activeURL as we don't want wayback count on search url
        const url = tabs[0].url
        if (url && settings && settings.wm_count_setting && isValidUrl(url) && isNotExcludedUrl(url) && !isArchiveUrl(url)) {
          showWaybackCount(url)
          chrome.runtime.sendMessage({ message: 'updateCountBadge' })
        } else {
          clearWaybackCount()
          chrome.runtime.sendMessage({ message: 'clearCountBadge' })
        }
      }
    })
  })
}

// Displays Wayback count, and Oldest and Newest timestamps
function showWaybackCount(url) {
  $('#wayback-count-msg').show()
  chrome.runtime.sendMessage({ message: 'getCachedWaybackCount', url: url }, (result) => {
    checkLastError()
    if (result && ('total' in result)) {
      // set label
      let text = ''
      if (result.total === 1) {
        text = 'Saved once.'
      } else if (result.total > 1) {
        text = 'Saved ' + result.total.toLocaleString() + ' times.'
      } else {
        text = 'This page has not been archived.'
      }
      $('#wayback-count-msg').text(text)
    } else {
      clearWaybackCount()
    }
    if (result && result.first_ts) {
      let date = timestampToDate(result.first_ts)
      $('#oldest-btn').attr('title', date.toLocaleString())
    }
    if (result && result.last_ts) {
      let date = timestampToDate(result.last_ts)
      $('#newest-btn').attr('title', date.toLocaleString())
    }
  })
}

function clearWaybackCount() {
  $('#wayback-count-msg').html('').hide()
  $('#oldest-btn').attr('title', 'Display the earliest archive of a URL')
  $('#newest-btn').attr('title', 'Display the most recent archive of a URL')
}

// not used right now
/*
function bulkSave() {
  openByWindowSetting('../bulk-save.html', 'windows')
}
*/

// Displays animated 'Archiving...' for Save Button if in save state.
function setupSaveButton() {
  // not using activeTab here as it may not be assigned yet
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs && tabs[0]) {
      chrome.runtime.sendMessage({ message: 'getToolbarState', atab: tabs[0] }, (result) => {
        checkLastError()
        let state = (result && result.stateArray) ? new Set(result.stateArray) : new Set()
        if (state.has('S')) {
          showSaving()
        }
      })
    }
  })
}

function showSaving(count) {
  $('#save-progress-bar').show()
  $('#spn-btn').off('click')
  disableWhileSaving()
  const text = $('#spn-front-label').text()
  if (count) {
    $('#spn-front-label').text(`Archiving URL... ${count}`)
  } else if (!text.startsWith('Archiving')) {
    // only set if not already set so as to not replace archive count
    $('#spn-front-label').text('Archiving URL...')
  }
}

function disableWhileSaving() {
  $('#search-input').attr('disabled', 'disabled')
  $('#chk-outlinks').attr('disabled', 'disabled')
  $('#chk-screenshot').attr('disabled', 'disabled')
}

function enableAfterSaving() {
  $('#search-input').removeAttr('disabled')
  $('#chk-outlinks').removeAttr('disabled')
  $('#chk-screenshot').removeAttr('disabled')
}

// make the tab/window option in setting page checked according to previous setting
function setupViewSetting() {
  chrome.storage.local.get(['view_setting'], (settings) => {
    if (settings && settings.view_setting) {
      $(`input[name=tw][value=${settings.view_setting}]`).prop('checked', true)
    }
  })
}

// respond to Save Page Now success
function setupSaveListener() {
  chrome.runtime.onMessage.addListener(
    (message) => {
      if (activeURL === message.url) {
        if (message.message === 'save_success') {
          $('#save-progress-bar').hide()
          $('#spn-front-label').text('Save successful')
          $('#last-saved-msg').text('Last Saved ' + viewableTimestamp(message.timestamp)).show()
          $('#spn-btn').removeClass('flip-inside')
          setupWaybackCount()
          enableAfterSaving()
        } else if (message.message === 'save_archived') {
          // snapshot already archived within timeframe
          $('#save-progress-bar').hide()
          $('#spn-front-label').text('Recently Saved')
          $('#spn-btn').attr('title', message.error)
          enableAfterSaving()
        } else if (message.message === 'save_start') {
          showSaving()
        } else if (message.message === 'save_error') {
          $('#save-progress-bar').hide()
          $('#spn-front-label').text('Save Failed')
          $('#spn-btn').attr('title', message.error)
          enableAfterSaving()
        } else if ((message.message === 'resource_list_show')) {
          // show resource count from SPN status in SPN button
          const vdata = message.data
          if (('resources' in vdata) && vdata.resources.length) {
            showSaving(vdata.resources.length)
          }
        }
      }
    }
  )
}

// onload
$(function() {
  $('#setting-page').hide()
  $('#login-page').hide()
  initAgreement()
  initActiveTabURL()
  setupNewsClips()
  setupWikiButtons()
  setupReadBook()
  setupSearchBox()
  setupSaveButton()
  updateLastSaved()
  setupWaybackCount()
  setupSaveListener()
  setupViewSetting()
  setupSettingsTabTip()
  $('.logo-wayback-machine').click(homepage)
  $('#newest-btn').click(recent_capture)
  $('#oldest-btn').click(first_capture)
  $('#facebook-share-btn').click(social_share)
  $('#twitter-share-btn').click(social_share)
  $('#linkedin-share-btn').click(social_share)
  $('#copy-link-btn').click(social_share)
  $('#tweets-btn').click(searchTweet)
  $('#about-tab-btn').click(about_support)
  $('#donate-tab-btn').click(open_donations_page)
  $('#settings-tab-btn').click(showSettings)
  $('#feedback-tab-btn').click(open_feedback_page)
  $('#overview-btn').click(view_all)
  $('#site-map-btn').click(sitemap)
  $('#search-input').keydown(display_suggestions)
  $('.btn').click(clearFocus)
  $('#alexa-btn').click(showContext)
  $('#annotations-btn').click(showContext)
  $('#tag-cloud-btn').click(showContext)
})
