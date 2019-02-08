$(restore_options)
$('#save').click(save_options)
$('.only').click(validate)
$('#showall').click(selectall)
addDocs()
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
    tagcloud: false,
    doi: false,
    news: false,
    agreement: false,
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
    $('#tagcloud').prop('checked', items.tagcloud)
    $('#showall').prop('checked', items.showall)
    $('#news').prop('checked', items.news)
    $('#agreement').prop('checked', items.agreement)
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
    tagcloud : $('#tagcloud').prop('checked'),
    showall : $('#showall').prop('checked'),
    news : $('#news').prop('checked'),
    agreed : $('#agreement').prop('checked'),
    wikibooks : $('#wikibooks').prop('checked'),
    doi : $('#doi').prop('checked')
  }, function () {
    $('#save').toggleClass('btn-success btn-primary').text('Saved').delay(500).fadeOut(300, function() {
      if($('#agreement').prop('checked') === false){
        chrome.browserAction.setPopup({popup: ''});
        chrome.browserAction.onClicked.addListener(function(tab) {
            chrome.tabs.create({url:chrome.runtime.getURL('welcome.html')})
        });
      }
      window.close()
    });
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

function addDocs(){
  let docs = {
    'auto-archive' : 'Enables extension to identify URLs that have not previously been saved on the Wayback Machine.',
    'auto-update-context' : 'Enabling this setting will update context windows when the page they are referencing changes.',
    'books' : 'Display a ‘B’ when viewing a book on Amazon that is found on The Archive.',
    'wikibooks' : 'Enables a button in the extension on wikipedia pages that will display a list of books cited on the page that are available on the archive.  Also adds popup buttons to the citations on the wikipedia page.',
    'doi' : 'Enables a button in the extension on wikipedia pages that will display a list of papers cited on the page that are available on the archive.',
    'news' :  'Enables a button in the extension on select news outlets that can recommend related tv news clips from the TV News Archive.',
    'alexa' : 'Displays what Alexa Internet knows about the site you are on (traffic data).',
    'domaintools' : 'Displays what Domaintools.com Internet knows about the site you are on (domain registration).',
    'tweets' : 'Show Tweets that include the URL you are on.',
    'wbmsummary' : 'Displays what the Wayback Machine knows about the site you are on (captures).',
    'annotations': 'Displays what Hypothes.is knows about the URL or the Site you are on (annotations).',
    'tagcloud': 'Show a Word Cloud built from Anchor text (the text associated with links) of links archived in the Wayback Machine, to the web page you are you.'
  }
  let labels = $('label')
  for(var i =0; i < labels.length; i++){
    let docFor = $(labels[i]).attr('for')
    if(docs[docFor]){
      let tt = $('<div>').append($('<p>').text(docs[docFor]))[0].outerHTML
      let docBtn = $('<button>').addClass('btn-docs').text('?')
      $(labels[i]).append(attachTooltip(docBtn, tt))
    }
  }
}
