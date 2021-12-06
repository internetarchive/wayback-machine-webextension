// settings.js

// from 'utils.js'
/*   global attachTooltip */

// from 'popup.js'
/*   global setupWaybackCount */

// onload
$(function() {
  initSettings()
  setupPrivateMode()
  setupSettingsChange()
  setupPanelSwitch()
  setupHelpDocs()
  $('.back-btn').click(goBack)
})

function initSettings() {
  chrome.storage.local.get(null, restoreSettings)
}

function restoreSettings(items) {
  // SPN
  $('#chk-screenshot').prop('checked', items.spn_screenshot)
  $('#chk-outlinks').prop('checked', items.spn_outlinks)
  // first panel
  $('#private-mode-setting').prop('checked', items.private_mode_setting)
  $('#not-found-setting').prop('checked', items.not_found_setting)
  $('#wm-count-setting').prop('checked', items.wm_count_setting)
  // $('#fact-check-setting').prop('checked', items.fact_check_setting)
  $('#wiki-setting').prop('checked', items.wiki_setting)
  $('#amazon-setting').prop('checked', items.amazon_setting)
  $('#tvnews-setting').prop('checked', items.tvnews_setting)
  // second panel
  $('#auto-archive-setting').prop('checked', items.auto_archive_setting)
  $('#auto-archive-age').val(items.auto_archive_age || '99999')
  $('#email-outlinks-setting').prop('checked', items.email_outlinks_setting)
  $('#resource-list-setting').prop('checked', items.resource_list_setting)
  $(`input[name=view-setting-input][value=${items.view_setting}]`).prop('checked', true)
}

function saveSettings() {
  let settings = {
    // SPN
    spn_outlinks: $('#chk-outlinks').prop('checked'),
    spn_screenshot: $('#chk-screenshot').prop('checked'),
    // first panel
    private_mode_setting: $('#private-mode-setting').prop('checked'),
    not_found_setting: $('#not-found-setting').prop('checked'),
    wm_count_setting: $('#wm-count-setting').prop('checked'),
    // fact_check_setting: $('#fact-check-setting').prop('checked'),
    wiki_setting: $('#wiki-setting').prop('checked'),
    amazon_setting: $('#amazon-setting').prop('checked'),
    tvnews_setting: $('#tvnews-setting').prop('checked'),
    // second panel
    auto_archive_setting: $('#auto-archive-setting').prop('checked'),
    auto_archive_age: $('#auto-archive-age').val(),
    email_outlinks_setting: $('#email-outlinks-setting').prop('checked'),
    resource_list_setting: $('#resource-list-setting').prop('checked'),
    view_setting: $('input[name=view-setting-input]:checked').val()
  }
  chrome.storage.local.set(settings)
}

function setupPrivateMode() {
  $('#private-mode-setting').change(onPrivateModeChange)
  $('.private-setting').change(onPrivateSettingChange)
}

// Clear all private checkboxes when private mode turned on.
function onPrivateModeChange(e) {
  if ($('#private-mode-setting').prop('checked') === true) {
    $('.private-setting').prop('checked', false).trigger('change')
  }
}

// Turn off private mode if any private checkbox is set.
function onPrivateSettingChange(e) {
  if ($(e.target).prop('checked') === true) {
    $('#private-mode-setting').prop('checked', false)
  }
}

// Save settings on change and other actions on particular settings.
function setupSettingsChange() {

  // save settings whenever one changes
  $('.saved-setting').change(saveSettings)

  // auto save page
  $('#auto-archive-age').change((e) => {
    $('#auto-archive-setting').prop('checked', true).trigger('change')
    e.target.blur()
  })

  // view setting
  $('#view-setting').click(switchTabWindow)
  $('#view-setting').children('input,label').click((e) => { e.stopPropagation() })

  // wayback count
  $('#wm-count-setting').change((e) => {
    // displays or clears the count badge, label, oldest and newest tooltips
    setupWaybackCount()
    if ($(e.target).prop('checked') === false) {
      chrome.runtime.sendMessage({ message: 'clearCountCache' })
    }
  })

  // resources
  $('#wiki-setting').change((e) => {
    if ($(e.target).prop('checked') === false) {
      $('#wiki-container').hide()
      chrome.runtime.sendMessage({ message: 'clearResource', settings: { wiki_setting: false } })
    }
  })
  $('#amazon-setting').change((e) => {
    if ($(e.target).prop('checked') === false) {
      $('#readbook-container').hide()
      chrome.runtime.sendMessage({ message: 'clearResource', settings: { amazon_setting: false } })
    }
  })
  $('#tvnews-setting').change((e) => {
    if ($(e.target).prop('checked') === false) {
      $('#tvnews-container').hide()
      chrome.runtime.sendMessage({ message: 'clearResource', settings: { tvnews_setting: false } })
    }
  })
  /*
  $('#fact-check-setting').change((e) => {
    if ($(e.target).prop('checked') === false) {
      $('#fact-check-btn').removeClass('btn-purple')
      chrome.runtime.sendMessage({ message: 'clearFactCheck' })
    }
  })
  */
}

// Returns to the main view.
function goBack() {
  $('#login-page').hide()
  $('#setting-page').hide()
  $('#popup-page').show()
}

// Prepares the top tab bar for switching between setting panels.
function setupPanelSwitch() {
  if (!$('#panel2-btn').hasClass('selected')) { $('#panel2-btn').addClass('selected') }
  $('#first-panel').hide()
  $('#panel1-btn').click(() => {
    $('#second-panel').hide()
    $('#first-panel').show()
    if (!$('#panel1-btn').hasClass('selected')) { $('#panel1-btn').addClass('selected') }
    if ($('#panel2-btn').hasClass('selected')) { $('#panel2-btn').removeClass('selected') }
  })
  $('#panel2-btn').click(() => {
    $('#first-panel').hide()
    $('#second-panel').show()
    if (!$('#panel2-btn').hasClass('selected')) { $('#panel2-btn').addClass('selected') }
    if ($('#panel1-btn').hasClass('selected')) { $('#panel1-btn').removeClass('selected') }
  })
}

// Toggles the Tab/Window setting.
function switchTabWindow() {
  $('input[name=view-setting-input]').not(':checked').prop('checked', true).trigger('change')
}

function setupHelpDocs() {
  let docs = {
    // context tab
    'private-mode-setting': 'Don\'t initiate automatic communications between this extension and the Internet Archive.',
    'not-found-setting': 'If server returns a 4xx or 5xx then check the Wayback Machine for archives.',
    'wm-count-setting': 'Show number of times the current URL has been archived in the Wayback Machine.',
    'wiki-setting': 'Check for books and academic papers from the Internet Archive referenced in Wikipeida articles. ',
    'amazon-setting': 'Check if books from Amazon are available from the Internet Archive.',
    'tvnews-setting': 'Auto check for related TV News Clips while visitng selected news websites.',
    // general tab
    'auto-archive-setting': 'Archive URLs that have not previously been archived to the Wayback Machine. You need to be logged in to use this feature.',
    'email-outlinks-setting': 'Send an email of results when Outlinks option is selected.',
    'resource-list-setting': 'Display embedded URLs archived with Save Page Now.'
  }
  let labels = $('label')
  for (let i = 0; i < labels.length; i++) {
    let docFor = $(labels[i]).attr('for')
    if (docs[docFor]) {
      let tt = $('<div>').append($('<p>').text(docs[docFor]).attr({ 'class': 'setting-tip' }))[0].outerHTML
      let docBtn = $('<button>').addClass('btn-docs').text('?')
      $(labels[i]).append(attachTooltip(docBtn, tt, 'top'))
    }
  }
}

if (typeof module !== 'undefined') {
  module.exports = {

  }
}
