function get_WBMSummary() {
  get_details();
  first_archive_details();
  recent_archive_details();
  get_thumbnail();
  $("#loader_wbmsummary").hide();
}

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
    $('#total_archives').attr('href', 'https://web.archive.org/web/*/' + url)
                        .text(getTotal(captures).toLocaleString())
  })
}

function _splitTimestamp (timestamp) {
  if (typeof timestamp === 'number') {
    timestamp = timestamp.toString();
  }
  return [
    // year
    timestamp.slice(-14, -10),
    // month
    timestamp.slice(-10, -8),
    // day
    timestamp.slice(-8, -6),
    // hour
    timestamp.slice(-6, -4),
    // minute
    timestamp.slice(-4, -2),
    // seconds
    timestamp.slice(-2)
  ];
}

function timestamp2datetime (timestamp) {
  const tsArray = _splitTimestamp(timestamp);
  return new Date(Date.UTC(
    tsArray[0], tsArray[1] - 1, tsArray[2],
    tsArray[3], tsArray[4], tsArray[5]
  ));
}

function first_archive_details () {
  var url = getUrlByParameter('url')
  var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=1&output=json'
  $.getJSON(new_url, function (data) {
    if (data.length == 0) {
      $('#first_archive_datetime').text('Data are not available.')
    } else {
			const ts = data[1][1]
			const dt = timestamp2datetime(ts).toString().split('+')[0]
			$('#first_archive_datetime')
				.text(dt)
    		.attr('href', 'https://web.archive.org/web/' + ts + '/' + url)
    }
  })
}

function recent_archive_details () {
  var url = getUrlByParameter('url')
  var new_url = 'http://web.archive.org/cdx/search?url=' + url + '&limit=-1&output=json'
  $.getJSON(new_url, function (data) {
    if (data.length == 0) {
      $('#recent_archive_datetime').text('Data are not available.')
    } else {
	  const ts = data[1][1];
	  const dt = timestamp2datetime(ts).toString().split('+')[0];
	  $('#recent_archive_datetime')
        .text(dt)
        .attr('href', 'https://web.archive.org/web/' + ts + '/' + url)
    }
  })
}

function get_thumbnail () {
  var url = getUrlByParameter('url')
  var new_url = 'http://crawl-services.us.archive.org:8200/wayback?url=' + url + '&width=300&height=200'
  $('#loader_thumbnail').show()
  fetch(new_url)
    .then(function (response) {
      $('#loader_thumbnail').hide()
      if (response.size != 233) {
        $('#show_thumbnail').append($('<img>').attr('src', new_url))
      } else {
        $('#show_thumbnail').text('Thumbnail not found')
      }
    })
    .catch(function (exception) {
      $('#loader_thumbnail').hide()
      if (exception === 'timeout') {
        $('#show_thumbnail').text('Please refresh the page...Time out!!')
      } else {
        $('#show_thumbnail').text('Thumbnail not found')
      }
    })
}

if (typeof module !== 'undefined') { module.exports = { getTotal: getTotal } }
