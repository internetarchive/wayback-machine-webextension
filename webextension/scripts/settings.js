// settings.js

// from 'utils.js'
/*   global attachTooltip, isNotExcludedUrl, private_before_state, searchValue */

// from 'popup.js'
/*   global show_all_screens, openContextMenu */

$(initializeSettings)
// $('.only').click(validate)
// $('#showall').click(selectall)
$('.private').click(validatePrivateMode)
$('#private-mode').click(togglePrivateMode)
// use capture instead of bubbling
document.getElementById('view').addEventListener('click', switchTabWindow, true)
$('input[type="radio"]').click(() => { $(this).prop('checked', true) })
$('input').change(saveOptions)
$('#show_context').change(saveOptions)
$('.back-btn').click(goBack)
switchSetting()
addDocs()

function initializeSettings() {
  chrome.storage.local.get(null, restoreOptions)
}

function restoreOptions(items) {
  /* SPN */
  $('#chk-screenshot').prop('checked', items.spn_screenshot)
  $('#chk-outlinks').prop('checked', items.spn_outlinks)
  /* Features */
  $('#private-mode').prop('checked', items.private_mode)
  $('#not-found-popup').prop('checked', items.not_found_popup)
  $('#wm-count-setting').prop('checked', items.wm_count)
  $('#fact-check').prop('checked', items.fact_check)
  $('#wiki-setting').prop('checked', items.wiki_setting)
  $('#amazon-setting').prop('checked', items.amazon_setting)
  $('#tvnews-setting').prop('checked', items.tvnews_setting)
  $('#auto-archive').prop('checked', items.auto_archive)
  $('#fact-check').prop('checked', items.fact_check)
  /* General */
  $('#email-outlinks-setting').prop('checked', items.email_outlinks)
  $('#show-resource-list').prop('checked', items.show_resource_list)
  $('#auto-update-context').prop('checked', items.auto_update_context)
  $(`input[name=tw][value=${items.show_context}]`).prop('checked', true)
  /* Set 'selected-prior' class to the previous state */
  for (let item of private_before_state) {
    $('#' + item).addClass('selected-prior')
  }
}

function saveOptions() {
  let settings = {
    /* SPN */
    spn_outlinks: $('#chk-outlinks').prop('checked'),
    spn_screenshot: $('#chk-screenshot').prop('checked'),
    /* Features */
    private_mode: $('#private-mode').prop('checked'),
    not_found_popup: $('#not-found-popup').prop('checked'),
    wm_count: $('#wm-count-setting').prop('checked'),
    fact_check: $('#fact-check').prop('checked'),
    wiki_setting: $('#wiki-setting').prop('checked'),
    amazon_setting: $('#amazon-setting').prop('checked'),
    tvnews_setting: $('#tvnews-setting').prop('checked'),
    auto_archive: $('#auto-archive').prop('checked'),
    show_context: $('input[name=tw]:checked').val(),
    /* General */
    show_resource_list: $('#show-resource-list').prop('checked'),
    email_outlinks: $('#email-outlinks-setting').prop('checked'),
    auto_update_context: $('#auto-update-context').prop('checked'),
    show_context: $('input[name=tw]:checked').val()
  }
  chrome.storage.local.set(settings)

  if (settings.wm_count === false) {
    chrome.runtime.sendMessage({ message: 'clearCountBadge' })
    chrome.runtime.sendMessage({ message: 'clearCountCache' })
  }
  if (settings.fact_check === false) {
    chrome.runtime.sendMessage({ message: 'clearFactCheck' })
  }
  chrome.runtime.sendMessage({ message: 'clearResource', settings: settings })
}

/*function validate() {
  let checkboxes = $('[name="context"]')
  let checkedCount = checkboxes.filter((_index, item) => item.checked === true).length
  if (checkboxes.length === checkedCount) {
    $('#showall').prop('checked', true)
  } else {
    $('#showall').prop('checked', false)
  }
}

function selectall() {
  let checkboxes = $('[name="context"]')
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = $(this).prop('checked')
  }
}*/

function validatePrivateMode(event) {
  let checkboxes = $('[name="private-include"]')
  let checkedCount = checkboxes.filter((_index, item) => item.checked === true).length
  if (checkedCount > 0) {
    $('#private-mode').prop('checked', false)
  }

  // If the event.taget.checked is true, add class 'selected-prior' to the event.taget, if it is NOT there
  // Else if the event.taget.checked is false, then remove class 'selected-prior'
  if (event.target.checked === true) {
    if (!$(event.target).hasClass('selected-prior')) {
      private_before_state.add(event.target.id)
      $(event.target).addClass('selected-prior')
    }
  } else if (event.target.checked === false) {
    private_before_state.delete(event.target.id)
    $(event.target).removeClass('selected-prior')
  }
  // Set the final previous state
  chrome.storage.local.set({ private_before_state: Array.from(private_before_state) }, () => {})
  hideUiButtons()
}

function togglePrivateMode() {
  let checkboxes = $('.selected-prior.private')
  for (var i = 0; i < checkboxes.length; i++) {
    checkboxes[i].checked = !$(this).prop('checked')
  }
  hideUiButtons()
}

function hideUiButtons() {
  // hide wayback machine count label
  if ($('#wm-count-setting').is(':not(:checked)')) {
    $('#wayback-count-label').hide()
  }
  // hide relevant resources buttons
  if ($('#amazon-setting').is(':not(:checked)')) { $('#readbook-btn').hide() }
  if ($('#tvnews-setting').is(':not(:checked)')) { $('#tvnews-btn').hide() }
  if ($('#wiki-setting').is(':not(:checked)')) {
    $('#wikibooks-btn').hide()
    $('#wikipapers-btn').hide()
  }
  // change color of fact check button
  if ($('#fact-check').is(':not(:checked)')) {
    $('#fact-check-btn').removeClass('btn-purple')
  }
}

function noneSelected() {
  let checkboxes = $('[name="context"]')
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) { return false }
  }
  return true
}

function goBack () {
  $('#login-page').hide()
  $('#setting-page').hide()
  $('#popup-page').show()
/* TO REMOVE? Show Context button no longer exists.
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    let url = searchValue || tabs[0].url
    // checking contexts selection status
    if (noneSelected()) {
      if (!$('#ctxbox').hasClass('flip-inside')) { $('#ctxbox').addClass('flip-inside') }
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
      $('#contextBtn').off('click').on('click', show_all_screens)
      $('#contextBtn').removeAttr('disabled')
    }
  })
*/
}

function switchSetting() {
  if (!$('#panel1-btn').hasClass('selected')) { $('#panel1-btn').addClass('selected') }
  $('#second-panel').hide()
  // switching pressed effect of tab button
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

function switchTabWindow() { $('input[type="radio"]').not(':checked').prop('checked', true).trigger('change') }

function addDocs() {
  let docs = {
    /* Tab 1 */
    'private-mode': 'Reduces communications to our servers unless explicit action is taken.',
    'not-found-popup': 'Check if an archived copy is available when an error occurs.',
    'wm-count-setting': 'Display count of snapshots of the current page stored in the Wayback Machine.',
    'auto-archive': 'Identify and Save URLs that have not previously been saved on the Wayback Machine.',
    'fact-check': 'Auto check to see if the page you are on has been Fact Checked.',
    'wiki-setting': 'Auto check for Archived Books and Papers while visiting Wikipedia.',
    'amazon-setting': 'Auto check for Archived Books while visiting Amazon.',
    'tvnews-setting': 'Auto check for Recommended TV News Clips while visiting news websites.',
    /* Tab 2 */
    'email-outlinks-setting': 'Send an email of results when Outlinks option is selected.',
    'show-resource-list': 'Display a list of resources during Save Page Now.',
    'auto-update-context': 'Automatically update context windows when the page they are referencing changes.',
    /* Contexts */
    'alexa': 'Displays what Alexa Internet knows about the site you are on.',
    'domaintools': 'Displays what Domaintools.com knows about the site you are on.',
    'wbmsummary': 'Displays what the Wayback Machine knows about the page you are on.',
    'annotations': 'Displays Annotations from Hypothes.is for the page you are on.',
    'tagcloud': 'Creates a Word Cloud from Anchor Text of links archived in the Wayback Machine for the page you are on.'
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
