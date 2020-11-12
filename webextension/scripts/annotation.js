// annotation.js

// from 'utils.js'
/*   global getUrlByParameter, openByWindowSetting */

/**
 * Prepare hypothes.is URL to request API.
 */
function hypothesisApiUrl(url, type) {
  if (!/^https?:\/\//i.test(url)) {
    url = 'http://' + url
  }
  if (type === 'domain') {
    const URL_OBJ = new URL(url)
    const query = 'uri.parts=' + URL_OBJ.host.split('.').join('&uri.parts=')
    return 'https://hypothes.is/api/search?' + query
  } else if (type === 'url') {
    return 'https://hypothes.is/api/search?uri=' + url
  }
}

/**
 * Get hypothes.is data and render results.
 */
function getAnnotations(type = 'url') {
  const url = decodeURIComponent(getUrlByParameter('url'))
  $('.url').text(url).attr('href', url)
  const NEW_URL = hypothesisApiUrl(url, type)
  $.getJSON(NEW_URL, (data) => {
    const LENGTH = data.rows.length
    if (LENGTH > 0) {
      for (let i = 0; i < LENGTH; i++) {
        const ROW_DATA = data.rows[i]
        const DATE = ROW_DATA.created.substring(0, 10)
        const source = ROW_DATA.target[0].source
        const EXACT_DATA = ROW_DATA.text
        const user = ROW_DATA.user.substring(5, ROW_DATA.user.indexOf('@'))
        let title = ''
        if (ROW_DATA.document.title) {
          title = ROW_DATA.document.title[0]
        }
        let row = $('#row_contain-' + type)
        let item = row.clone()
        item.attr('id', 'row-' + i)
        item.find('.date').html('Dated on ' + DATE)
        item.find('.userinfo').html(user)
        item.find('#source-contain').append(
          $('<a>').attr({ 'href': source, 'target': '_blank' }).html(title)
        )
        item.find('#text-contain').html(EXACT_DATA)
        item.find('.links').append(
          $('<button>').attr({ 'class': 'btn btn-red btn-auto' }).text('Show in Context').click(() => {
            openByWindowSetting(ROW_DATA.links.incontext)
          })
          // , $('<button>').attr({ 'class': 'btn btn-red btn-auto' }).text('Show in HTML').click(() => {
          //   openByWindowSetting(ROW_DATA.links.html)
          // })
        )

        if (ROW_DATA.target[0].hasOwnProperty('selector')) {
          var selector_length = ROW_DATA.target[0].selector.length
          var exact = ROW_DATA.target[0].selector[selector_length - 1].exact
          item.find('.target-selector-exact').html(exact)
        } else {
          item.find('.target-selector-exact').hide()
        }
        $('#container-whole-' + type).append(item)
      }
    } else {
      let error_msg
      if (type === 'domain') {
        error_msg = 'There are no annotations for the current domain.'
      } else {
        error_msg = 'There are no annotations for the current URL.'
      }
      let row = $('#row_contain-' + type)
      let item = row.clone()
      item.html(
        $('<div>').addClass('text-center')
          .html(error_msg)
      )
      item.css('display', 'block')
      $('#container-whole-' + type).append(item)
    }
  })
}

function showAnnotations(type) {
  $('.tabcontent').hide()
  $('.tablink').removeClass('active')
  $('.tablink[value="' + type + '"]').addClass('active')
  $('#' + type).show()
}

$('.tablink').click(() => {
  showAnnotations($(this).attr('value'))
})

function get_hypothesis() {
  let hypo_domain = getAnnotations('domain')
  let hypo_url = getAnnotations('url')
  $('#loader_annotations').hide()
  if (hypo_url && hypo_domain) {
    $('#annotations_status').show()
  }
}

window.onload = get_hypothesis

if (typeof module !== 'undefined') {
  module.exports = {
    hypothesisApiUrl,
    getAnnotations
  }
}
