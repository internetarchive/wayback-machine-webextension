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
  var xhr = new XMLHttpRequest()
  var new_url = 'https://archive.org/services/context/tagcloud?url=' + toBeUsedAsURL
  xhr.open('GET', new_url, true)
  xhr.onload = function () {
    var data = JSON.parse(xhr.response)
    var entries = []
    data = data.filter(i => i[0].length < 30)
    const length = data.length > 70 ? 70 : data.length
    for (var i = 0; i < length; i++) {
      entries.push({ label: data[i][0], url: '#', target: '_self', weight: data[i][1]})
    }
    const settings = {
      entries: entries,
      width: 800,
      height: 800,
      radius: '70%',
      radiusMin: 75,
      bgDraw: true,
      bgColor: '#111',
      opacityOver: 1.00,
      opacityOut: 0.10,
      opacitySpeed: 3,
      fov: 800,
      speed: 0.3,
      fontFamily: 'Oswald, Arial, sans-serif',
      fontSize: '15',
      fontColor: '#fff',
      fontWeight: 'bold',
      fontStyle: 'normal',
      fontStretch: 'normal',
      fontToUpperCase: true
    }
    $('#container-wordcloud').svg3DTagCloud(settings)
  }
  xhr.send(null)
}