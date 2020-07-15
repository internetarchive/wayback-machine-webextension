// settings.js

// from 'utils.js'
/*   global attachTooltip, isNotExcludedUrl, searchValue */

// from 'popup.js'
/*   global show_all_screens, openContextMenu */

$(initializeSettings)
$('.only').click(validate)
$('#showall').click(selectall)
// use capture instead of bubbling
document.getElementById('view').addEventListener('click', switchTabWindow, true)
$('input[type="radio"]').click(() => { $(this).prop('checked', true) })
$('input').change(saveOptions)
$('#show_context').change(saveOptions)
$('#back-btn').click(goBack)
switchSetting()
addDocs()

function initializeSettings () {
  chrome.storage.local.get(null, restoreOptions)
}

function restoreOptions (items) {
  $(`input[name=tw][value=${items.show_context}]`).prop('checked', true)
  $('#resource').prop('checked', items.resource)
  $('#auto-update-context').prop('checked', items.auto_update_context)
  $('#wm-count-setting').prop('checked', items.wm_count)
  $('#auto-archive').prop('checked', items.auto_archive)
  $('#email-outlinks-setting').prop('checked', items.email_outlinks)
  $('#chk-outlinks').prop('checked', items.spn_outlinks)
  $('#chk-screenshot').prop('checked', items.spn_screenshot)
  $('#alexa').prop('checked', items.alexa)
  $('#domaintools').prop('checked', items.domaintools)
  $('#wbmsummary').prop('checked', items.wbmsummary)
  $('#annotations').prop('checked', items.annotations)
  $('#tagcloud').prop('checked', items.tagcloud)
  $('#showall').prop('checked', items.showall)
  $('#not-found-popup').prop('checked', items.not_found_popup)
  $('#show-resource-list').prop('checked', items.show_resource_list)
}

function saveOptions () {
  let wm_count = $('#wm-count-setting').prop('checked')
  let resource = $('#resource').prop('checked')
  chrome.storage.local.set({
    show_context: $('input[name=tw]:checked').val(),
    resource: resource,
    auto_update_context: $('#auto-update-context').prop('checked'),
    wm_count: wm_count,
    auto_archive: $('#auto-archive').prop('checked'),
    email_outlinks: $('#email-outlinks-setting').prop('checked'),
    spn_outlinks: $('#chk-outlinks').prop('checked'),
    spn_screenshot: $('#chk-screenshot').prop('checked'),
    alexa: $('#alexa').prop('checked'),
    domaintools: $('#domaintools').prop('checked'),
    wbmsummary: $('#wbmsummary').prop('checked'),
    annotations: $('#annotations').prop('checked'),
    tagcloud: $('#tagcloud').prop('checked'),
    showall: $('#showall').prop('checked'),
    not_found_popup: $('#not-found-popup').prop('checked'),
    show_resource_list: $('#show-resource-list').prop('checked')
  })
  if (wm_count === false) {
    chrome.runtime.sendMessage({ message: 'clearCountBadge' })
    chrome.runtime.sendMessage({ message: 'clearCountCache' })
  }
  if (resource === false) {
    chrome.runtime.sendMessage({ message: 'clearResource' })
  }
}

function validate () {
  let checkboxes = $('[name="context"]')
  let checkedCount = checkboxes.filter((_index, item) => item.checked === true).length
  if (checkboxes.length === checkedCount) {
    $('#showall').prop('checked', true)
  } else {
    $('#showall').prop('checked', false)
  }
}

function selectall () {
  let checkboxes = $('[name="context"]')
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = $(this).prop('checked')
  }
}

function noneSelected () {
  let checkboxes = $('[name="context"]')
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) { return false }
  }
  return true
}

function goBack () {
  $('#setting-page').hide()
  $('#popup-page').show()
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = searchValue || tabs[0].url
    // checking contexts selection status
    if (noneSelected()) {
      if (!$('#ctxbox').hasClass('flip-inside')) { $('#ctxbox').addClass('flip-inside') }
      /* $('#context-screen').off('click').css({ opacity: 0.5 }) */
      $('#contextBtn').off('click')
      $('#contextBtn').attr('disabled', true)
      if (isNotExcludedUrl(url)) {
        $('#contextTip').click(openContextMenu)
      }
    } else {
      if ($('#ctxbox').hasClass('flip-inside')) {
        if (!isNotExcludedUrl(url)) {
          $('#contextTip').text('URL not supported')
        } else {
          $('#ctxbox').removeClass('flip-inside')
        }
      }
      /* $('#context-screen').off('click').css({ opacity: 1.0 }).on('click', show_all_screens) */
      $('#contextBtn').off('click').on('click', show_all_screens)
      $('#contextBtn').removeAttr('disabled')
    }
  })
}

function switchSetting() {
  if (!$('#general-btn').hasClass('selected')) { $('#general-btn').addClass('selected') }
  $('#context-panel').hide()
  // switching pressed effect of tab button
  $('#general-btn').click(() => {
    $('#context-panel').hide()
    $('#general-panel').show()
    if (!$('#general-btn').hasClass('selected')) { $('#general-btn').addClass('selected') }
    if ($('#context-btn').hasClass('selected')) { $('#context-btn').removeClass('selected') }
  })
  $('#context-btn').click(() => {
    $('#general-panel').hide()
    $('#context-panel').show()
    if (!$('#context-btn').hasClass('selected')) { $('#context-btn').addClass('selected') }
    if ($('#general-btn').hasClass('selected')) { $('#general-btn').removeClass('selected') }
  })
}

function switchTabWindow() { $('input[type="radio"]').not(':checked').prop('checked', true).trigger('change') }

function addDocs () {
  let docs = {
    'resource': 'Provide archived resources on relevant URLs, including Amazon books, Wikipedia, and select News outlets.',
    'auto-update-context': 'Automatically update context windows when the page they are referencing changes.',
    'show-resource-list': 'Display a list of resources during Save Page Now.',
    'not-found-popup': 'Check if an archived copy is available when an error occurs.',
    'wm-count-setting': 'Display count of snapshots of the current page stored in the Wayback Machine.',
    'auto-archive': 'Identify and Save URLs that have not previously been saved on the Wayback Machine.',
    'email-outlinks-setting': 'Send an email of results when Outlinks option is selected.',
    'alexa': 'Displays what Traffic Data that Alexa knows about the site you are on.',
    'domaintools': 'Displays what Domaintools.com knows about the site you are on.',
    'wbmsummary': 'Displays what the Wayback Machine knows about the site you are on.',
    'annotations': 'Displays what Hypothes.is knows about the site you are on.',
    'tagcloud': 'Show a Word Cloud built from Anchor text of links archived in the Wayback Machine.'
  }
  let labels = $('label')
  for (var i = 0; i < labels.length; i++) {
    let docFor = $(labels[i]).attr('for')
    if (docs[docFor]) {
      let tt = $('<div>').append($('<p>').text(docs[docFor]).attr({ 'class': 'setting-tip' }))[0].outerHTML
      let docBtn = $('<button>').addClass('btn-docs').text('?')
      $(labels[i]).append(attachTooltip(docBtn, tt, 'top'))
    }
  }
}
