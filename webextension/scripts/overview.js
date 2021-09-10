// overview.js

// from 'utils.js'
/*   global getUrlByParameter, hostURL, getWaybackCount, timestampToDate */

function getWBMSummary () {
  let url = getUrlByParameter('url')
  getArchiveDetails(url)
  firstArchiveDetails(url)
  recentArchiveDetails(url)
  $('#loader_wbmsummary').hide()
}

function getArchiveDetails (url) {
  let new_url = hostURL + 'services/context/metadata?url=' + url
  $.getJSON(new_url, (response) => {
    if ('type' in response) {
      let type = response.type
      $('#details').text(type)
      $('#url_details').show()
    }
  }).fail(() => {})
  let captures
  getWaybackCount(url, (values) => {
    captures = values.total
    $('#total_archives_number').attr('href', 'https://web.archive.org/web/*/' + url)
    .text(captures.toLocaleString())
    if (captures > 0) {
      $('#total_captures').show()
      getThumbnail(url)
    } else {
      $('#loader_thumbnail').hide()
      $('#show_thumbnail').text('Thumbnail not found.').show()
    }
  })
}

function firstArchiveDetails (url) {
  let new_url = hostURL + 'cdx/search?url=' + url + '&limit=1&output=json'
  $.getJSON(new_url, (data) => {
    if (data.length === 0) {
      $('#first_archive_datetime_error').text('URL has not been archived')
    } else {
      const ts = data[1][1]
      const dt = timestampToDate(ts).toString().split('+')[0]
      $('#first_archive_datetime')
        .text(dt)
        .attr('href', 'https://web.archive.org/web/' + ts + '/' + url)
    }
  })
  .fail(() => $('#first_archive_datetime_error').text('Data not available'))
}

function recentArchiveDetails (url) {
  let new_url = hostURL + 'cdx/search?url=' + url + '&limit=-1&output=json'
  $.getJSON(new_url, (data) => {
    if (data.length === 0) {
      $('#recent_archive_datetime_error').text('URL has not been archived')
    } else {
      const ts = data[1][1]
      const dt = timestampToDate(ts).toString().split('+')[0]
      $('#recent_archive_datetime')
      .text(dt)
      .attr('href', 'https://web.archive.org/web/' + ts + '/' + url)
    }
  })
  .fail(() => $('#recent_archive_datetime_error').text('Data not available'))
}
// Function used to get the thumbnail of the URL
function getThumbnail (url) {
  // Add to manifest permissions to use: "http://crawl-services.us.archive.org:8200/*"
  let new_url = 'http://crawl-services.us.archive.org:8200/wayback?url=' + url + '&width=300&height=200'
  $('#loader_thumbnail').show()
  fetch(new_url)
    .then((response) => {
      $('#loader_thumbnail').hide()
      let thumbnail = $(`<img class="thumbnail-box" src="${new_url}">`)
      $('#show_thumbnail').append(thumbnail).show()
    })
    .catch((exception) => {
      $('#loader_thumbnail').hide()
      if (exception === 'timeout') {
        $('#show_thumbnail').text('Please refresh the page.').show()
      } else {
        if (exception.status === 504) {
          $('#show_thumbnail').text('Please refresh the page.').show()
        } else {
          $('#show_thumbnail').text('Thumbnail not found.').show()
        }
      }
    })
}

// onload
$(function() {
  const url = getUrlByParameter('url')
  $('.url').text(url).attr('href', url)
  getWBMSummary()
})
