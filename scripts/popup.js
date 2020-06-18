// popup.js

// from 'utils.js'
/*   global isValidUrl, isNotExcludedUrl, openByWindowSetting, hostURL */

function homepage() {
  openByWindowSetting('https://web.archive.org/')
}

function remove_port(url) {
  if (url.substr(-4) === ':80/') {
    url = url.substring(0, url.length - 4)
  }
  return url
}

function remove_wbm(url) {
  var pos = url.indexOf('/http')
  var new_url = ''
  if (pos !== -1) {
    new_url = url.substring(pos + 1)
  } else {
    pos = url.indexOf('/www')
    new_url = url.substring(pos + 1)
  }
  return remove_port(new_url)
}

function remove_alexa(url) {
  var pos = url.indexOf('/siteinfo/')
  var new_url = url.substring(pos + 10)
  return remove_port(new_url)
}

function remove_whois(url) {
  var pos = url.indexOf('/whois/')
  var new_url = url.substring(pos + 7)
  return remove_port(new_url)
}

function get_clean_url(url) {
  if (url.includes('web.archive.org')) {
    url = remove_wbm(url)
  } else if (url.includes('www.alexa.com')) {
    url = remove_alexa(url)
  } else if (url.includes('www.whois.com')) {
    url = remove_whois(url)
  }
  return url
}

function save_now() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    let options = ['capture_all']
    if ($('#chk-outlinks').prop('checked') === true) {
      options.push('capture_outlinks')
      if ($('#email-outlinks-setting').prop('checked') === true) {
        options.push('email_result')
      }
    }
    if ($('#chk-screenshot').prop('checked') === true) {
      options.push('capture_screenshot')
    }
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: hostURL + 'save/',
      page_url: url,
      options: options,
      method: 'save',
      tabId: tabs[0].id
    })
  })
}

function last_save() {
  checkAuthentication(function(result) {
    if (result && result.message && result.message === 'You need to be logged in to use Save Page Now.') {
      $('#savebox').addClass('flip-inside')
      $('#last_save').text('Login to Save Page')
      $('#save_now').attr('disabled', true)
      $('#savebtn').off('click').click(function() {
        openByWindowSetting('https://archive.org/account/login')
      })
    } else {
      $('#save_now').removeAttr('disabled')
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        let url = get_clean_url(tabs[0].url)
        chrome.runtime.sendMessage({
          message: 'getLastSaveTime',
          page_url: url
        }, function(message) {
          if (message.message === 'last_save') {
            if ($('#last_save').text !== 'URL not supported') {
              $('#last_save').text(message.time)
            }
            $('#savebox').addClass('flip-inside')
          }
        })
      })
    }
  })
}

function checkAuthentication(callback) {
  chrome.runtime.sendMessage({
    message: 'auth_check'
  }, callback)
}

function recent_capture() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/2/',
      page_url: url,
      method: 'recent'
    })
  })
}

function first_capture() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/0/',
      page_url: url,
      method: 'first'
    })
  })
}

function view_all() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    chrome.runtime.sendMessage({
      message: 'openurl',
      wayback_url: 'https://web.archive.org/web/*/',
      page_url: url,
      method: 'viewall'
    })
  })
}

function social_share(eventObj) {
  var parent = eventObj.target.parentNode
  var id = parent.getAttribute('id')
  var sharing_url = ''
  var overview_url = 'https://web.archive.org/web/*/'

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = tabs[0].url
    if (url.includes('web.archive.org')) {
      sharing_url = url // If the user is already at a playback page,share that URL
    } else {
      sharing_url = overview_url + get_clean_url(url) // When not on a playback page,share the overview version of that URL
    }
    var open_url = ''
    if (isNotExcludedUrl(url)) { // Prevents sharing some unnecessary page
      if (id.includes('fb')) {
        open_url = 'https://www.facebook.com/sharer/sharer.php?u=' + sharing_url // Share the wayback machine's overview of the URL
      } else if (id.includes('twit')) {
        open_url = 'https://twitter.com/intent/tweet?url=' + sharing_url
      } else if (id.includes('linkedin')) {
        open_url = 'https://www.linkedin.com/shareArticle?url=' + sharing_url
      }
      openByWindowSetting(open_url)
    }
  })
}

function search_tweet() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    if (isNotExcludedUrl(url)) {
      url = url.replace(/^https?:\/\//, '')
      if (url.slice(-1) === '/') url = url.substring(0, url.length - 1)
      var open_url = 'https://twitter.com/search?q=' + url
      openByWindowSetting(open_url)
    }
  })
}

function search_box_activate() {
  const search_box = document.getElementById('search-input')
  search_box.addEventListener('keydown', (e) => {
    if ((e.keyCode === 13 || e.which === 13) && search_box.value.length > 1) {
      openByWindowSetting('https://web.archive.org/web/*/' + search_box.value)
    }
  })
}

function arrow_key_access() {
  const list = document.getElementById('suggestion-box')
  const search_box = document.getElementById('search-input')
  let index = search_box

  search_box.addEventListener('keydown', (e) => {
    // listen for up key
    if (e.keyCode === 38 || e.which === 38) {
      if (index === list.firstChild && index && list.lastChild) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = list.lastChild
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      } else if (index === search_box) {

      } else if (index !== search_box && index && index.previousElementSibling) {
        if (index.classList.contains('focused')) { index.classList.remove('focused') }
        index = index.previousElementSibling
        if (!index.classList.contains('focused')) { index.classList.add('focused') }
        search_box.value = index.textContent
      }

    // listen for down key
    } else if (e.keyCode === 40 || e.which === 40) {
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
  $.getJSON(hostURL + '__wb/search/host?q=' + key_word, function (data) {
    $('#suggestion-box').text('').hide()
    if (data.hosts.length > 0 && $('#search-input').val() !== '') {
      $('#suggestion-box').show()
      arrow_key_access()
      for (var i = 0; i < data.hosts.length; i++) {
        $('#suggestion-box').append($('<li>').append(
          $('<a>').attr('role', 'button').text(data.hosts[i].display_name).click((event) => {
            openByWindowSetting('https://web.archive.org/web/*/' + event.target.innerHTML)
            $('#suggestion-box').text('').hide()
          })
        ))
      }
    }
  })
}

function display_suggestions(e) {
  // exclude arrow keys from keypress event
  if (e.keyCode === 38 || e.keyCode === 40) { return false }

  $('#suggestion-box').text('').hide()
  if (e.keyCode === 13) {
    e.preventDefault()
  } else {
    // setTimeout is used to get the text in the text field after key has been pressed
    window.setTimeout(function () {
      if ($('#search-input').val().length >= 3) {
        display_list($('#search-input').val())
      } else {
        $('#suggestion-box').text('').hide()
      }
    }, 0.1)
  }
}
function open_feedback_page() {
  var feedback_url = 'https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak/reviews?hl=en'
  openByWindowSetting(feedback_url)
}

function open_donations_page() {
  var donation_url = 'https://archive.org/donate/'
  openByWindowSetting(donation_url)
}

function about_support() {
  openByWindowSetting('about.html')
}

function sitemap() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    if (isNotExcludedUrl(url)) { openByWindowSetting('https://web.archive.org/web/sitemap/' + url) }
  })
}

function settings() {
  // window.open('settings.html', 'newwindow', 'width=600, height=700,left=0,top=30');
  $('#popup-page').hide()
  $('#setting-page').show()
}

function show_all_screens() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = get_clean_url(tabs[0].url)
    chrome.runtime.sendMessage({ message: 'showall', url: url })
  })
}

function borrow_books() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url
    const tabId = tabs[0].id
    if (url.includes('www.amazon') && url.includes('/dp/')) {
      chrome.runtime.sendMessage({ message: 'getToolbarState', tabId: tabId }, function(result) {
        if (result.state === 'R') {
          $('#borrow_books_tr').css({ 'display': 'block' })
          chrome.storage.sync.get(['tab_url', 'detail_url', 'show_context'], function (res) {
            const stored_url = res.tab_url
            const detail_url = res.detail_url
            const context = res.show_context
            // Checking if the tab url is the same as the last stored one
            if (stored_url === url) {
              // if same, use the previously fetched url
              $('#borrow_books_tr').click(function () {
                openByWindowSetting(detail_url, context)
              })
            } else {
              // if not, fetch it again
              fetch(hostURL + 'services/context/amazonbooks?url=' + url)
              .then(res => res.json())
              .then(response => {
                if (response['metadata'] && response['metadata']['identifier-access']) {
                  const new_details_url = response['metadata']['identifier-access']
                  $('#borrow_books_tr').click(function () {
                    openByWindowSetting(new_details_url, context)
                  })
                }
              })
            }
          })
        }
      })
    }
  })
}

function show_news() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url
    const tabId = tabs[0].id
    const news_host = new URL(url).hostname
    chrome.storage.sync.get(['show_context', 'newshosts'], function (event) {
      let set_of_sites = new Set(event.newshosts)
      const option = event.show_context
      if (set_of_sites.has(news_host)) {
        chrome.runtime.sendMessage({ message: 'getToolbarState', tabId: tabId }, function(result) {
          if (result.state === 'R') {
            $('#news_recommend_tr').show().click(() => {
              const URL = chrome.runtime.getURL('recommendations.html') + '?url=' + url
              openByWindowSetting(URL, option)
            })
          }
        })
      }
    })
  })
}
function show_wikibooks() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url
    const tabId = tabs[0].id
    if (url.match(/^https?:\/\/[\w\.]*wikipedia.org/)) {
      chrome.runtime.sendMessage({ message: 'getToolbarState', tabId: tabId }, function(result) {
        if (result.state === 'R') {
          // show wikipedia books button
          $('#wikibooks_tr').show().click(function () {
            const URL = chrome.runtime.getURL('booklist.html') + '?url=' + url
            openByWindowSetting(URL)
          })
          // show wikipedia cited paper button
          $('#doi_tr').show().click(function () {
            const URL = chrome.runtime.getURL('doi.html') + '?url=' + url
            openByWindowSetting(URL)
          })
        }
      })
    }
  })
}

function noContextTip() {
  chrome.storage.sync.get(['alexa', 'domaintools', 'tweets', 'wbmsummary', 'annotations', 'tagcloud'], function (event) {
    // If none of the context is selected, grey out the button and adding tip when the user hovers
    for (const context in event) {
      if (event[context]) {
        $('#contextBtn').removeAttr('disabled')
        return $('#contextBtn').click(show_all_screens)
      }
    }
    if (!$('#ctxbox').hasClass('flip-inside')) {
      $('#ctxbox').addClass('flip-inside')
      $('#contextBtn').attr('disabled', true)
    }
  })
}

function openContextMenu () {
  $('#popup-page').hide()
  $('#setting-page').show()
  $('#general-panel').hide()
  $('#context-panel').show()
  if (!$('#context-btn').hasClass('selected')) { $('#context-btn').addClass('selected') }
  if ($('#general-btn').hasClass('selected')) { $('#general-btn').removeClass('selected') }
}

function checkExcluded() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    let url = tabs[0].url
    if (isNotExcludedUrl(url)) {
      last_save()
      $('#contextTip').click(openContextMenu)
    } else {
      const idList = ['savebox', 'mapbox', 'twitterbox', 'ctxbox']
      idList.forEach((id) => { $(`#${id}`).addClass('flip-inside') })
      $('#contextBtn').attr('disabled', true)
      $('#last_save').text('URL not supported')
      $('#contextTip').text('URL not supported')
      $('#url-not-supported-message').text('URL not supported')
    }
  })
}

// For removing focus outline around buttons on mouse click, while keeping during keyboard use.
function clearFocus() {
  document.activeElement.blur()
}

function setupWaybackCount() {
  chrome.storage.sync.get(['wm_count'], function (event) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let url = tabs[0].url
      if ((event.wm_count === true) && isValidUrl(url) && isNotExcludedUrl(url)) {
        $('#wayback-count-label').show()
        showWaybackCount(url)
        chrome.runtime.sendMessage({ message: 'updateCountBadge' })
      } else {
        $('#wayback-count-label').hide()
        clearWaybackCount()
        chrome.runtime.sendMessage({ message: 'clearCountBadge' })
      }
    })
  })
}

function showWaybackCount(url) {
  chrome.runtime.sendMessage({ message: 'getCachedWaybackCount', url: url }, function(result) {
    if (result.total) {
      // set label
      let text = ''
      if (result.total === 1) {
        text = 'Saved once.'
      } else if (result.total > 1) {
        text = 'Saved ' + result.total.toLocaleString() + ' times.'
      } else {
        text = 'This page was never archived.'
      }
      $('#wayback-count-label').text(text)
    } else if (result.error) {
      clearWaybackCount()
    }
  })
}

function clearWaybackCount() {
  $('#wayback-count-label').html('&nbsp;')
}

// make the tab/window option in setting page checked according to previous setting
chrome.storage.sync.get(['show_context'], function(event) { $(`input[name=tw][value=${event.show_context}]`).prop('checked', true) })

chrome.runtime.onMessage.addListener(
  function(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs[0].id === message.tabId) {
        if (message.message === 'save_success') {
          $('#save_now').text('Save successful')
          $('#last_save').text(message.time)
          $('#savebox').addClass('flip-inside')
        }
        if (message.message === 'save_start') {
          $('#save_now').text('Saving Snapshot...')
        }
        if(message.message === "save_error"){
          $('#save_now').text('Save Failed')
          $('#last_save').text(message.error)
          if(message.error === "You need to be logged in to use Save Page Now."){
            $('#savebtn').off('click').click(function(){
              openByWindowSetting('https://archive.org/account/login');
            })
          }
        }
      }
    })
  }
)

window.onloadFuncs = [checkExcluded, borrow_books, show_news, show_wikibooks, search_box_activate, noContextTip, setupWaybackCount]
window.onload = function () {
  for (var i in this.onloadFuncs) {
    this.onloadFuncs[i]()
  }
}

$('#logo-internet-archive').click(homepage)
$('#savebtn').click(save_now)
$('#recent_capture').click(recent_capture)
$('#first_capture').click(first_capture)
$('#fb_share').click(social_share)
$('#twit_share').click(social_share)
$('#linkedin_share').click(social_share)
$('#twitterbtn').click(search_tweet)
$('#about-button').click(about_support)
$('#donate-button').click(open_donations_page)
$('#settings-button').click(settings)
$('#setting-page').hide()
$('#feedback-button').click(open_feedback_page)
$('#allbtn').click(view_all)
$('#mapbtn').click(sitemap)
$('#search-input').keydown(display_suggestions)
$('.btn').click(clearFocus)
