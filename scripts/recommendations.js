function parseDate (date) {
  if(typeof date === "string"){
    const dateObject = new Date(date)
    if(dateObject.toDateString() !== 'Invalid Date'){
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
    $('<img>').attr({ 'src': clip.preview_thumb }).click(() => {
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

function getDetails () {
  var article = getUrlByParameter('url')
  var apiURL = 'https://gext-api.archive.org/services/context/tvnews?url=' + article
  $.getJSON(apiURL, function (clips) {
    $('.loader').hide()
    if (clips.status !== 'error') {
      if (clips.length > 0) {
        for (let clip of clips) {
          $('#RecommendationTray').append(constructArticles(clip))
        }
      } else {
        $('#RecommendationTray').css({ 'grid-template-columns': 'none' }).append(
          $('<p>').text('No Related Clips Found...').css({ 'width': '300px', 'margin': 'auto' })
        )
      }
    } else {
      $('#RecommendationTray').css({ 'grid-template-columns': 'none' }).append(
        $('<p>').text(clips.message).css({ 'width': '300px', 'margin': 'auto' })
      )
    }
  })
}

if (typeof module !== 'undefined') {
  module.exports = {
    parseDate : parseDate
  }
}
