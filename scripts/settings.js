$(restore_options)
$('#save').click(save_options)
$('.only').click(validate)
$('#showall').click(selectall)

function restore_options () {
  chrome.storage.sync.get({
    show_context: 'tab',
    auto_archive: false,
    books: false,
    auto_update_context: false,
    alexa: false,
    domaintools: false,
    tweets: false,
    wbmsummary: false,
    annotations: false,
    annotationsurl: false,
    similarweb: false,
    tagcloud: false,
    hoaxy: false,
    doi: false,
    news: false,
    wikibooks: false,
    showall: false
  }, function (items) {
    $('#auto-archive').prop('checked', items.auto_archive)
    $('#books').prop('checked', items.books)
    $('#show_context').val(items.show_context)
    $('#auto-update-context').prop('checked', items.auto_update_context)
    $('#alexa').prop('checked', items.alexa)
    $('#domaintools').prop('checked', items.domaintools)
    $('#tweets').prop('checked', items.tweets)
    $('#wbmsummary').prop('checked', items.wbmsummary)
    $('#annotations').prop('checked', items.annotations)
    $('#annotationsurl').prop('checked', items.annotationsurl)
    $('#similarweb').prop('checked', items.similarweb)
    $('#tagcloud').prop('checked', items.tagcloud)
    $('#hoaxy').prop('checked', items.hoaxy)
    $('#showall').prop('checked', items.showall)
    $('#news').prop('checked', items.news)
    $('#wikibooks').prop('checked', items.wikibooks)
    $('#doi').prop('checked', items.doi)
  })
}

function save_options () {

  chrome.storage.sync.set({
    show_context : $('#show_context').val(),
    auto_archive : $('#auto-archive').prop('checked'),
    books : $('#books').prop('checked'),
    auto_update_context : $('#auto-update-context').prop('checked'),
    alexa : $('#alexa').prop('checked'),
    domaintools : $('#domaintools').prop('checked'),
    tweets : $('#tweets').prop('checked'),
    wbmsummary : $('#wbmsummary').prop('checked'),
    annotations : $('#annotations').prop('checked'),
    annotationsurl : $('#annotationsurl').prop('checked'),
    similarweb : $('#similarweb').prop('checked'),
    tagcloud : $('#tagcloud').prop('checked'),
    hoaxy : $('#hoaxy').prop('checked'),
    showall : $('#showall').prop('checked'),
    news : $('#news').prop('checked'),
    wikibooks : $('#wikibooks').prop('checked'),
    doi : $('#doi').prop('checked')
  }, function () {
    $('#status').text('Options saved.')
    setTimeout(function () {
      $('#status').text('')
    }, 750)
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
