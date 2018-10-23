function getTotal (captures) {
  var total = 0
  for (var key in captures) {
    total += captures[key]['text/html']
  }
  return total
}
function get_details () {
  var url = getUrlByParameter('url')
  var new_url = 'https://archive.org/services/context/metadata?url=' + url
  $.getJSON(new_url, function (response) {
    var type = response.type
    $('#details').text(type)
    var captures = response.captures
    var total = 0
    total = getTotal(captures)
    $('#total_archives').text(total)
    $('#save_now').attr('href', 'https://web.archive.org/save/' + url)
  })
}

function first_archive_details () {
  var url = getUrlByParameter('url')
  var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=1&output=json'
  $.getJSON(new_url, function (data) {
    if (data.length == 0) {
      $('#first_archive_date, #first_archive_date_2, #first_archive_time').text('( Data is not available -Not archived before )')
    } else {
      var timestamp = data[1][1]
      var date = timestamp.substring(4, 6) + '/' + timestamp.substring(6, 8) + '/' + timestamp.substring(0, 4)
      var time = timestamp.substring(8, 10) + '.' + timestamp.substring(10, 12) + '.' + timestamp.substring(12, 14)
      $('#first_archive_date').text('( ' + date + ' )')
      $('#first_archive_date_2').text('( ' + date + ' )')
      $('#first_archive_time').text('( ' + time + ' ) according to Universal Time Coordinated (UTC)')
    }
    $('#link_first').attr('href', 'https://web.archive.org/web/0/' + url)
  })
}

function recent_archive_details () {
  var url = getUrlByParameter('url')
  var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=-1&output=json'
  $.getJSON(new_url, function (data) {
    if (data.length == 0) {
      $('#recent_archive_date, #recent_archive_date_2, #recent_archive_time').text('( Data is not available -Not archived before )')
    } else {
      var timestamp = data[1][1]
      var date = timestamp.substring(4, 6) + '/' + timestamp.substring(6, 8) + '/' + timestamp.substring(0, 4)
      var time = timestamp.substring(8, 10) + '.' + timestamp.substring(10, 12) + '.' + timestamp.substring(12, 14)
      $('#recent_archive_date').text('( ' + date + ' )')
      $('#recent_archive_time').text('( ' + time + ' ) according to Universal Time Coordinated (UTC)')
    }
    $('#link_recent').attr('href', 'https://web.archive.org/web/2/' + url)
  })
}

function get_thumbnail () {
  var url = getUrlByParameter('url')
  url = url.replace(/^https?:\/\//, '')
  var index = url.indexOf('/')
  url = url.substring(0, index)
  var new_url = 'https://web.archive.org/thumb/' + url
  $.ajax({ url: new_url,
    success: function (response) {
      if (response.size != 233) {
        $('#show_thumbnail').append($('<img>').attr('src', new_url))
      } else {
        $('#show_thumbnail').text('Thumbnail not found')
      }
    },
    error: function (jqXHR, exception) {
      if (exception === 'timeout') {
        $('#show_thumbnail').text('Please refresh the page...Time out!!')
      } else {
        $('#show_thumbnail').text('Thumbnail not found')
      }
    } })
}

if (typeof module !== 'undefined') { module.exports = { getTotal: getTotal } }
