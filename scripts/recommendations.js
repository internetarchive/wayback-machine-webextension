// recommendations.js

const threshold = 0.85

function parseDate (date) {
  if (typeof date === 'string') {
    const dateObject = new Date(date)
    if (dateObject.toDateString() !== 'Invalid Date') {
      return dateObject.toDateString()
    }
  }
  return ''
}
function constructArticles (clip) {
  let topElements = $('<div>').addClass('top_elements').append(
    $('<p>').text(clip.show).prepend($('<strong>').text(clip.station + ': '))
  )
  let bottomElements = $('<div>').addClass('bottom_elements').append(
    $('<a>').attr({ 'href': '#' }).append(
      $('<img>').attr({ 'src': clip.preview_thumb })
    ).click(() => {
      chrome.storage.sync.get(['show_context'], function (event1) {
        if (event1.show_context === undefined) {
          event1.show_context = 'tab'
        }
        if (event1.show_context === 'tab') {
          chrome.tabs.create({ url: clip.preview_url })
        } else {
          chrome.system.display.getInfo(function (displayInfo) {
            let height = displayInfo[0].bounds.height
            let width = displayInfo[0].bounds.width
            chrome.windows.create({ url: clip.preview_url, width: width / 2, height: height, top: 0, left: 0, focused: true })
          })
        }
      })
    }),
    $('<p>').text(parseDate(clip.show_date))
  )

  return $('<div>').append(
    topElements,
    bottomElements
  )
}

function getDetails (article) {
  return new Promise(function(resolve, reject) {
    chrome.runtime.sendMessage({
      message: 'tvnews',
      article: article
    }, function (clips) {
      if (clips.status !== 'error') {
        resolve(clips)
      } else {
        reject(new Error('Clips not found'))
      }
    })
  })
}
function getArticles(url) {
  getDetails(url)
  .then(function(clips) {
    $('.loader').hide()
    if (clips.length > 0 && threshold >= clips[0]['similarity']) {
      for (let clip of clips) {
        if (threshold >= clip['similarity']) {
          $('#RecommendationTray').append(constructArticles(clip))
        }
      }
    } else {
      $('#RecommendationTray').css({ 'grid-template-columns': 'none' }).append(
        $('<p>').text('No Related Clips Found...').css({ 'width': '300px', 'margin': 'auto' })
      )
    }
  })
  .catch(function(err) {
    $('.loader').hide()
    $('#RecommendationTray').css({ 'grid-template-columns': 'none' }).append(
      $('<p>').text(err).css({ 'width': '300px', 'margin': 'auto' })
    )
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    parseDate: parseDate
  }
}
