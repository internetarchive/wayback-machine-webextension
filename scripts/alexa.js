function get_alexa () {
  var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url='
  var url = getUrlByParameter('url')
  url = url.replace(/^https?:\/\//, '')
  $.get(alexa_url + url, function (xml) {
    var name = xml.getElementsByTagName('ALEXA')[0].getAttribute('URL')
    $('#alexa_name').text(name)
    if (xml.getElementsByTagName('POPULARITY')) {
      var rank = xml.getElementsByTagName('POPULARITY')[0].getAttribute('TEXT')
      $('#alexa_rank').text(rank)
    }
    if (xml.getElementsByTagName('COUNTRY')[0]) {
      var country = xml.getElementsByTagName('COUNTRY')[0].getAttribute('NAME')
      $('#alexa_country').text(country)
    }
    var rl = xml.getElementsByTagName('RL')
    const TITLE_LEN = 26
    if (rl.length > 0) {
      for (var i = 0, len = rl.length; i < len && i < 5; i++) {
        var title = rl[i].getAttribute('TITLE')
        var href = rl[i].getAttribute('HREF')
        $('#alexa_list').append(
          $('<li>').append(
            $('<a>').attr('href', 'http://' + href)
                    .attr('target', '_blank')
                    .attr('class', 'rl-a')
                    .attr('title', title)
                    .text(title.length > TITLE_LEN ? title.substring(0, TITLE_LEN) + '...' : title)
          )
        )
        $('#alexa_page').attr('href', 'https://archive.org/services/context/alexa?url=' + url);
      }
    }
    $('#loader_alexa').hide()
    $('#show_alexa_data').show()
  })
}
