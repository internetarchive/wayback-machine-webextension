$(initializeSettings)
$('.only').click(validate)
$('#showall').click(selectall)
// use capture instead of bubbling
document.getElementById('view').addEventListener('click', switchTabWindow, true)
$('input[type="radio"]').click(function () { $(this).prop('checked', true) })
$('input').change(save_options)
$('#show_context').change(save_options)
$('#back').click(goBack)
switchSetting()
addDocs()

function initializeSettings () {
  chrome.storage.sync.get({
    show_context: 'tab',
    citations: false,
    resource: false,
    auto_update_context: false,
    auto_archive: false,
    alexa: false,
    domaintools: false,
    wbmsummary: false,
    annotations: false,
    tagcloud: false,
    showall: false
  }, restoreOptions)
}
function restoreOptions (items) {
  $('#show_context').val(items.show_context)
  $('#citations').prop('checked', items.citations)
  $('#resource').prop('checked', items.resource)
  $('#auto-update-context').prop('checked', items.auto_update_context)
  $('#auto-archive').prop('checked', items.auto_archive)
  $('#alexa').prop('checked', items.alexa)
  $('#domaintools').prop('checked', items.domaintools)
  $('#wbmsummary').prop('checked', items.wbmsummary)
  $('#annotations').prop('checked', items.annotations)
  $('#tagcloud').prop('checked', items.tagcloud)
  $('#showall').prop('checked', items.showall)
}

function save_options () {
  chrome.storage.sync.set({
    show_context: $('input[name=tw]:checked').val(),
    citations: $('#citations').prop('checked'),
    resource: $('#resource').prop('checked'),
    auto_update_context: $('#auto-update-context').prop('checked'),
    auto_archive: $('#auto-archive').prop('checked'),
    alexa: $('#alexa').prop('checked'),
    domaintools: $('#domaintools').prop('checked'),
    wbmsummary: $('#wbmsummary').prop('checked'),
    annotations: $('#annotations').prop('checked'),
    tagcloud: $('#tagcloud').prop('checked'),
    showall: $('#showall').prop('checked')
  })
}

function validate () {
  let checkboxes = $('[name="context"]')
  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      $('#showall').prop('checked', false)
    }
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
  $('#settingPage').hide()
  $('#popupPage').show()
  // checking contexts selection status
  if (noneSelected()) {
    const btn = $('#context-screen').off('click').css({ opacity: 0.5 }).tooltip('enable')
  } else {
    $('#context-screen').off('click').css({ opacity: 1.0 }).on('click', function () {
      chrome.runtime.sendMessage({ message: 'showall', url: get_clean_url() })
    }).tooltip('disable')
  }
}

function switchSetting() {
  if (!$('#general_btn').hasClass('selected')) { $('#general_btn').addClass('selected') }
  $('#context').hide()
  // switching pressed effect of tab button
  $('#general_btn').click(function () {
    $('#context').hide()
    $('#general').show()
    if (!$('#general_btn').hasClass('selected')) { $('#general_btn').addClass('selected') }
    if ($('#context_btn').hasClass('selected')) { $('#context_btn').removeClass('selected') }
  })
  $('#context_btn').click(function () {
    $('#general').hide()
    $('#context').show()
    if (!$('#context_btn').hasClass('selected')) { $('#context_btn').addClass('selected') }
    if ($('#general_btn').hasClass('selected')) { $('#general_btn').removeClass('selected') }
  })
}

function switchTabWindow() { $('input[type="radio"]').not(':checked').prop('checked', true) }

function addDocs () {
  chrome.storage.sync.get(['newshosts'], function (items) {
    let docs = {
      'citations': 'If a page contains a citation, enabling this will allow the extension to search the Archive for the citation and insert a link if found.',
      'resource': 'Display "R" badge when user is viewing Amazon books/Wikipedia/Selected News Outlets and will show related resource in archive accordingly',
      'auto-update-context': 'Enabling this setting will update context windows when the page they are referencing changes.',
      'auto-archive': 'Enables extension to identify URLs that have not previously been saved on the Wayback Machine.',
      'alexa': 'Displays what Alexa Internet knows about the site you are on (traffic data).',
      'domaintools': 'Displays what Domaintools.com Internet knows about the site you are on (domain registration).',
      'wbmsummary': 'Displays what the Wayback Machine knows about the site you are on (captures).',
      'annotations': 'Displays what Hypothes.is knows about the URL or the Site you are on (annotations).',
      'tagcloud': 'Show a Word Cloud built from Anchor text (the text associated with links) of links archived in the Wayback Machine, to the web page you are you.'
    }
    let labels = $('label')
    for (var i = 0; i < labels.length; i++) {
      let docFor = $(labels[i]).attr('for')
      if (docs[docFor]) {
        let tt = $('<div>').append($('<p>').text(docs[docFor]).attr({ 'class': 'setting_tip' }))[0].outerHTML
        let docBtn = $('<button>').addClass('btn-docs').text('?')
        $(labels[i]).append(attachTooltip(docBtn, tt, 'top'))
      }
    }
  })
}
