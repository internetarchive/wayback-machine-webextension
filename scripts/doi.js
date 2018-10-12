
function getUrlByParameter (name) {
  const url = new URL(window.location.href);
  return url.searchParams.get(name);
}
function createList (entry, mainContainer) {
  let title = entry.paper.title;
  let author = entry.paper.authors[0];
  if (entry.paper.authors.length > 1) {
    author = author + ' et al.';
  }
  let journal = entry.paper.journal;
  let url = '#';
  if (entry.count_files > 0 && entry.files.length > 0 && entry.files[0].links.length > 0 && entry.files[0].links[0].url) {
    url = entry.files[0].links[0].url;
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
  if (url !== '#') {
    paper.append(
      $('<a>').attr({'href':'#', 'class': 'btn btn-success'}).text('Read Paper')
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
        })
    );
  } else {
    paper.append($('<p>').text('Paper Unavailable').addClass('not_found'));
  }
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
  const url=getUrlByParameter('url');
  $.getJSON('https://archive.org/services/context/papers?url='+url, function(data) {
    for (var i=0; i<data.length; i++){
      if (data[i].paper) {
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
