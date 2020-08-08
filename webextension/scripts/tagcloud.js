// tagcloud.js

// from 'index.js'
/*   global Levenshtein */

var mynewTags = []

function get_tags (url) {
  var hostname = new URL(url).hostname
  var toBeUsedAsURL = hostname.replace(/^www./, '')
  var y = hostname.split('.')
  var not_display4 = y.join(' ')
  var not_display1 = y.join(' ')
  if (url.includes('https')) {
    not_display1 = 'https ' + not_display1
  } else {
    not_display1 = 'http ' + not_display1
  }
  var not_display2 = not_display1 + ' extension'
  var not_display3 = not_display4 + ' extension'
  var dontarray = ['view page', 'open', 'read more', not_display1, not_display2, not_display3, not_display4]

  var new_url = hostURL+ 'services/context/tagcloud?url=' + toBeUsedAsURL
  $('#loader_tagcloud').show()
  fetch(new_url)
    .then(response => response.json())
    .then((data) => {
      $('#loader_tagcloud').hide()
      if (!data.error && data.length > 0) {
        $('.wordcloud').css( 'display', 'inline-block' )
        $('#container-wordcloud').show()
        for (let i = 0; i < data.length; i++) {
          var b = {}
          if (dontarray.indexOf(decodeURIComponent(data[i][0])) <= 0) {
            mynewTags[i] = decodeURIComponent(data[i][0])
            b.text = decodeURIComponent(data[i][0])
            b.weight = (data[i][1])
            mynewTags.push(b)
          }
        }
        var coefOfDistance
        if (data.length < 500) {
          coefOfDistance = 1 / 40
        } else {
          coefOfDistance = 3 / 4
        }
        var arr = mynewTags.reduce((acc, newTag) => {
          var minDistance = void 0
          if (acc.length > 0) {
            minDistance = Math.min.apply(Math, _toConsumableArray(acc.map((oldTag) => {
              return Levenshtein.get(oldTag, newTag)
            })))
          } else {
            minDistance = newTag.length
          }
          if (minDistance > coefOfDistance * newTag.length) {
            acc.push(newTag)
          }
          return acc
        }, []).sort()
        var result = []

        // Filtering out the elements from data which aren't in arr
        data = data.filter((el) => {
          return arr.indexOf(el[0]) >= 0
        }).sort()

        // Mapping the weights to higher values
        result = data.map((el) => {
          if (el[1] === 1) { el[1] = el[1] * 10 } else if (el[1] === 2) { el[1] = el[1] * 40 } else if (el[1] === 3) { el[1] = el[1] * 60 } else if (el[1] === 4) { el[1] = el[1] * 90 }
          return { 'text': el[0], 'weight': el[1] }
        })

        for (let i = 0; i < result.length; i++) {
          var span = document.createElement('span')
          span.setAttribute('data-weight', result[i].weight)
          span.appendChild(document.createTextNode(result[i].text))
          document.getElementById('container-wordcloud').appendChild(span)
        }
        $('#container-wordcloud').awesomeCloud({
          'size': {
            'grid': 1,
            'factor': 4
          },
          'options': {
            'color': 'random-light',
            'rotationRatio': 0.5,
            'printMultiplier': 3
          },
          'font': "'Times New Roman', Times, serif",
          'shape': 'square'
        })
      } else {
        $('.wordcloud').hide()
        $('#tagcloud-not-found').show()
        $('#message_tagcloud').text('Tags not found. Please try again later.')
      }
    })
}

function _toConsumableArray (arr) {
  if (Array.isArray(arr)) {
    let arr2 = Array(arr.length)
    for (let i = 0; i < arr.length; i++) {
      arr2[i] = arr[i]
    }
    return arr2
  } else {
    return Array.from(arr)
  }
}

if (typeof module !== 'undefined') {
  module.exports = {
    _toConsumableArray,
    get_tags
  }
}
