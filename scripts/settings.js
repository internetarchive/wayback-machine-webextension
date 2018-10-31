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
  var show_context = $('#show_context').val()
  var auto_archive = $('#auto-archive').prop('checked')
  var books = $('#books').prop('checked')
  var auto_update_context = $('#auto-update-context').prop('checked')
  var alexa = $('#alexa').prop('checked')
  var domaintools = $('#domaintools').prop('checked')
  var tweets = $('#tweets').prop('checked')
  var wbmsummary = $('#wbmsummary').prop('checked')
  var annotations = $('#annotations').prop('checked')
  var annotationsurl = $('#annotationsurl').prop('checked')
  var similarweb = $('#similarweb').prop('checked')
  var tagcloud = $('#tagcloud').prop('checked')
  var hoaxy = $('#hoaxy').prop('checked')
  var showall = $('#showall').prop('checked')
  var news = $('#news').prop('checked')
  var wikibooks = $('#wikibooks').prop('checked')
  var doi = $('#doi').prop('checked')
  chrome.storage.sync.set({
    show_context: show_context,
    auto_archive: auto_archive,
    books: books,
    auto_update_context: auto_update_context,
    alexa: alexa,
    domaintools: domaintools,
    tweets: tweets,
    wbmsummary: wbmsummary,
    annotations: annotations,
    annotationsurl: annotationsurl,
    similarweb: similarweb,
    tagcloud: tagcloud,
    hoaxy: hoaxy,
    showall: showall,
    news: news,
    wikibooks: wikibooks,
    doi: doi
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
