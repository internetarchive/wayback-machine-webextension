global_url = ''
var set_of_sites;
chrome.storage.sync.get(['newshosts'], function(event){
  set_of_sites = new Set(event.newshosts);
})

function homepage() {
  openByWindowSetting('https://archive.org/web/')
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
/* Common method used everywhere to retrieve cleaned up URL */
function retrieve_url() {
  var search_term = $('#search_input').val()
  var url = ''
  if (search_term === '') {
    url = global_url
  } else {
    url = search_term
  }
  return url
}

function get_clean_url() {
  var url = retrieve_url()
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
  let clean_url = get_clean_url()
  chrome.runtime.sendMessage({
    message: 'openurl',
    wayback_url: 'https://gext-api.archive.org/save/',
    page_url: clean_url,
    method: 'save'
  })
  .then(handleResponse, handleError)
}

function recent_capture() {
  chrome.runtime.sendMessage({
    message: 'openurl',
    wayback_url: 'https://gext-api.archive.org/web/2/',
    page_url: get_clean_url(),
    method: 'recent'
  })
}

function first_capture() {
  chrome.runtime.sendMessage({
    message: 'openurl',
    wayback_url: 'https://gext-api.archive.org/web/0/',
    page_url: get_clean_url(),
    method: 'first'
  })
}

function view_all() {
  chrome.runtime.sendMessage({
    message: 'openurl',
    wayback_url: 'https://gext-api.archive.org/web/*/',
    page_url: get_clean_url(),
    method: 'viewall'
  })
}

function get_url() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    global_url = tabs[0].url
  })
}

function social_share(eventObj) {
  var parent = eventObj.target.parentNode
  var id = parent.getAttribute('id')
  var sharing_url = ''
  var url = retrieve_url()
  var overview_url = 'https://gext-api.archive.org/web/*/'
  if (url.includes('web.archive.org')) {
    sharing_url = url // If the user is already at a playback page,share that URL
  } else {
    sharing_url = overview_url + get_clean_url() // When not on a playback page,share the overview version of that URL
  }
  var open_url = ''
  if (!(url.includes('chrome://') || url.includes('chrome-extension://'))) { // Prevents sharing some unnecessary page
    if (id.includes('fb')) {
      open_url = 'https://www.facebook.com/sharer/sharer.php?u=' + sharing_url // Share the wayback machine's overview of the URL
    } else if (id.includes('twit')) {
      open_url = 'https://twitter.com/home?status=' + sharing_url
    } else if (id.includes('linkedin')) {
      open_url = 'https://www.linkedin.com/shareArticle?url=' + sharing_url
    }
    openByWindowSetting(open_url)
  }
}

function search_tweet(eventObj) {
  var url = get_clean_url()
  url = url.replace(/^https?:\/\//, '')
  if (url.slice(-1) === '/') url = url.substring(0, url.length - 1)
  var open_url = 'https://twitter.com/search?q=' + url
  openByWindowSetting(open_url)
}

function search_box_activate() {
  const search_box = document.getElementById('search_input')
  search_box.addEventListener('keydown', (e) => {
    if ((e.keyCode === 13  || e.which === 13) && search_box.value !== '') {
      openByWindowSetting('https://gext-api.archive.org/web/*/' + search_box.value)
    }
  })
}

function arrow_key_access() {
  const list = document.getElementById('suggestion-box')
  const search_box = document.getElementById('search_input')
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
        return;
      }
      else if (index !== search_box && index && index.previousElementSibling) {
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
  $.getJSON('https://web.archive.org/__wb/search/host?q=' + key_word, function (data) {
    $('#suggestion-box').text('').hide()
    if (data.hosts.length > 0 && $('#search_input').val() !== '') {
      $('#suggestion-box').show()
      arrow_key_access()
      for (var i = 0; i < data.hosts.length; i++) {
        $('#suggestion-box').append($('<li>').append(
          $('<a>').attr('role', 'button').text(data.hosts[i].display_name).click((event) => {
            openByWindowSetting('https://gext-api.archive.org/web/*/' + event.target.innerHTML)
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
      if ($('#search_input').val().length >= 3) {
        display_list($('#search_input').val())
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
  var url = get_clean_url()
  openByWindowSetting("https://web.archive.org/web/sitemap/" + url)
}

function settings() {
  window.open('settings.html', 'newwindow', 'width=600, height=700,left=0,top=30');
}

function show_all_screens() {
  var url = get_clean_url()
  chrome.runtime.sendMessage({ message: 'showall', url: url })
}

function borrow_books() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url
    const tabId = tabs[0].id
    chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
      if (result.includes('R') && url.includes('www.amazon') && url.includes('/dp/')) {
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
            fetch('https://gext-api.archive.org/services/context/amazonbooks?url=' + url)
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
      chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
        if (result.includes('R') && set_of_sites.has(news_host)) {
          $('#news_recommend_tr').show().click(() => {
            const URL = chrome.runtime.getURL('recommendations.html') + '?url=' + url
            openByWindowSetting(URL, option)
          })
        }
      })
    })
  })
}
function show_wikibooks() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = tabs[0].url
    const tabId = tabs[0].id
    chrome.browserAction.getBadgeText({ tabId: tabId }, function (result) {
      if (result.includes('R') && url.match(/^https?:\/\/[\w\.]*wikipedia.org/)) {
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
  })
}

function noContextTip() {
  chrome.storage.sync.get(["alexa", "domaintools", "tweets", "wbmsummary", "annotations", "tagcloud"], function(event) {
    for (const context in event) { if (event[context]) { return true; } }
    // If none of the context is selected, grey out the button and adding tip when the user hovers
    const btn = $('#context-screen').off('click').css({ opacity: 0.5 })
    const tip = $('<p>').attr({ 'class': 'context_tip' }).text('Enable context in the extension settings')[0].outerHTML
    attachTooltip(btn, tip, 'top', 50)
  })
}

window.onloadFuncs = [get_url, borrow_books, show_news, show_wikibooks, search_box_activate, noContextTip]
window.onload = function () {
  for (var i in this.onloadFuncs) {
    this.onloadFuncs[i]()
  }
}

$('#logo_internet_archive').click(homepage)
$('#save_now').click(save_now)
$('#recent_capture').click(recent_capture)
$('#first_capture').click(first_capture)
$('#fb_share').click(social_share)
$('#twit_share').click(social_share)
$('#linkedin_share').click(social_share)
$('#search_tweet').click(search_tweet)
$('#about_support_button').click(about_support)
$('#donate_button').click(open_donations_page)
$('#settings_button').click(settings)
$('#context-screen').click(show_all_screens)
$('.feedback').click(open_feedback_page)

$('#overview').click(view_all)
$('#site_map').click(sitemap)
$('#search_input').keydown(display_suggestions)
