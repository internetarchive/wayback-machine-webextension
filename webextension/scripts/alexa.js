// alexa.js

// from 'utils.js'
/*   global getUrlByParameter */

function getAlexa() {
  var alexa_url = 'https://xml.alexa.com/data?cli=10&dat=n&url='
  let url = getUrlByParameter('url')
  let hostname = new URL(url).hostname
  $('.url').text(url).attr('href', url)
  $.get(alexa_url + hostname, (xml) => {
    var name = xml.getElementsByTagName('ALEXA')[0].getAttribute('URL')
    $('#alexa_name').text(name)
    var details = xml.getElementsByTagName('SD')[0]
    if (details) {
      $('.error').hide()
      let popularity = xml.getElementsByTagName('POPULARITY')
      let country_exists = xml.getElementsByTagName('COUNTRY')
      if (popularity && popularity.length > 0) {
        let rank = popularity[0].getAttribute('TEXT')
        $('#alexa_rank').text(rank)
      } else {
        $('.rank').hide()
      }
      if (country_exists && country_exists.length > 0) {
        let country = country_exists[0].getAttribute('NAME')
        $('#alexa_country').text(country)
      } else {
        $('.country').hide()
      }
    } else {
      $('.error').text('No More Data Found')
      $('.rank').hide()
      $('.country').hide()
    }
    var rl = xml.getElementsByTagName('RL')
    const TITLE_LEN = 26
    let len = rl.length
    if (rl.length > 0) {
      for (let i = 0; i < len && i < 5; i++) {
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
      }
    } else {
      $('.related_sites').hide()
    }
    $('#alexa_page').attr('href', 'https://archive.org/services/context/alexa?url=' + hostname)
    $('#loader_alexa').hide()
    $('#show_alexa_data').show()
  }).fail((error) => {
    $('#loader_alexa').hide();
    $('#alexa_domain_tag').hide();
    $('.error').text('Can not reach Alexa at the moment!')
    $('.rank').hide()
    $('.country').hide()
    $('#show_alexa_data').show();

  })
}

window.onload = getAlexa()
