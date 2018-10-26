
function getUrlByParameter (name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}
function createList (entry, mainContainer) {
  let title = entry.title;
  let author = '';
  if (entry.authors) {
    author = entry.authors[0];
    if (entry.authors.length > 1) {
      author = author + ' et al.';
    }
  } else if (entry.contribs) {
    author = entry.contribs[0].raw_name;
    if (entry.contribs.length > 1) {
      author = author + ' et al.';
    }
  }
  let journal = entry.journal;
  let url = '#';
  if (entry.url) {
    url = entry.url;
  }
  let paper = $('<div>').append(
    $('<p class="text_elements">').append(
      $('<p>').append(
        $('<strong>').text(title)
      ),
      $('<p>').append(author)
      // Journal was also commented out in the previous version.
      // $('<p>').append(journal)
    )
  );
  let bottom_details = $("<div>").addClass("bottom_details");
  if (url !== '#') {
    bottom_details.append(
      $('<button>').attr({'href':'#', 'class': 'btn btn-success'}).text('Read Paper')
        .click(function () {
          chrome.storage.sync.get(['show_context'], function (event1) {
            if (event1.show_context === undefined){
              event1.show_context = 'tab';
            }
            if (event1.show_context === 'tab') {
              chrome.tabs.create({url: url});
            } else {
              chrome.system.display.getInfo(function (displayInfo) {
                const height = displayInfo[0].bounds.height;
                const width = displayInfo[0].bounds.width;
                chrome.windows.create({url: url, width: width / 2, height: height,
                                       top: 0, left: 0, focused: true});
              });
            }
          });
        }),
      $('<div>').addClass('small text-muted').text('source: ' + entry.source)
    );
  } else {
    bottom_details.append($('<p>').text('Paper Unavailable').addClass('not_found'));
  }
  paper.append(bottom_details);
  // add to list
  $('.loader').hide();
  let container = $('#container-whole');
  if (url !== '#' && container.children().length > 0) {
    container.prepend(paper);
  } else {
    container.append(paper);
  }
}
function createPage () {
  let mainContainer = document.getElementById('container-whole');
  const url = getUrlByParameter('url');
  $.getJSON('https://archive.org/services/context/papers?url='+url, function(data) {
    for (var i=0; i<data.length; i++){
      if (data[i]) {
        createList(data[i]);
      }
    }
    if (mainContainer.children.length === 0) {
      $('.loader').hide();
      $('#doi-heading').html('No papers found.');
    }
  });
}
if (typeof module !== 'undefined') { module.exports = {getUrlByParameter: getUrlByParameter} }
