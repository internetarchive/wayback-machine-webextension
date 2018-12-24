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
    if (rl.length > 0) {
      for (var i = 0, len = rl.length; i < len && i < 5; i++) {
        var title = rl[i].getAttribute('TITLE')
        var href = rl[i].getAttribute('HREF')
        $('#alexa_list').append(
          $('<li>').append(
            $('<a>').attr('href', 'http://' + href).attr('target', '_blank').attr('class', 'rl-a').text(title.length > 18 ? title.substring(0, 15) + '...' : title)
          )
        )
      }
    }
  })
}
function showDOI () {
  var url = getUrlByParameter('url')
  if (url.match(/^https?:\/\/[\w\.]*wikipedia.org/)) {
    $('#doi-heading').css('display', 'block')
  }
}
function get_tweets () {
  var url = getUrlByParameter('url')
  url = url.replace(/^https?:\/\//, '')
  url = url.replace(/^www./, '')
  var index_new = url.indexOf('/')
  url = url.slice(0, index_new - 1)
  var xhr = new XMLHttpRequest()
  var new_url = 'https://api.twitter.com/1.1/search/tweets.json?q=' + url + '&result_type=popular'
  var res = new Object()
  res.q = url
  res.result_type = 'popular'
  console.log(new_url)
  var author = getAuthorization('GET', 'https://api.twitter.com/1.1/search/tweets.json', res)
  console.log(author)
  xhr.open('GET', new_url, true)
  xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded')
  xhr.setRequestHeader('Authorization', author)
  xhr.onload = function () {
    console.log(JSON.parse(xhr.response))
    data = JSON.parse(xhr.response)
    var length = (data.statuses.length)
    if (length > 0) {
      for (var i = 0; i < length; i++) {
        dataRow = data.statuses[i]
        var row = document.getElementById('row-twitter')
        var item = row.cloneNode(true)
        var tweet_text = dataRow.text
        var name = dataRow.user.name
        var url = dataRow.entities.urls[0].expanded_url
        var tweet_div = item.querySelectorAll('[id="tweets"]')[0].appendChild(document.createTextNode(tweet_text))
        var profile_name = item.querySelectorAll('[id="profile-name"]')[0].appendChild(document.createTextNode(name))
        var img = item.querySelectorAll('[id="profile-image"]')[0]
        img.setAttribute('src', dataRow.user.profile_image_url)
        item.id = 'row-tweets' + i
        var link = item.querySelectorAll('[id="link"]')[0]
        link.setAttribute('href', url)
        document.getElementById('box-twitter').appendChild(item)
      }
      document.getElementById('row-twitter').style.display = 'none'
    } else {
      document.getElementById('box-twitter').innerHTML = 'There are no Tweets for the current URL'
      document.getElementById('row-twitter').style.display = 'none'
    }
  }
  xhr.send(null)
}

function show_annotations () {
  $('#row_contain-url').show()
}

function getAuthorization (httpMethod, baseUrl, reqParams) {
  // Get acces keys
  const consumerKey = 'JYIqN1CLQOTO9OjbpEaNsjhhH'

  const consumerSecret = 'dBsYOqFDEllj24qyfdBMo7jvIgWQ4SoH1Q3KdtWOKaz63UCfpH'

  const accessToken = '3229028316-85M78pR27WbKUHRym9Z2LZKfSErXRUeaehU1Cd8'

  const accessTokenSecret = '6PY70PgLzUu6aE7DE1eouGDKw8EwmDfiDBmgIowpxUTrf'
  // timestamp as unix epoch
  let timestamp = Math.round(Date.now() / 1000)
  // nonce as base64 encoded unique random string
  let nonce = btoa(consumerKey + ':' + timestamp)
  // generate signature from base string & signing key
  let baseString = oAuthBaseString(httpMethod, baseUrl, reqParams, consumerKey, accessToken, timestamp, nonce)
  let signingKey = oAuthSigningKey(consumerSecret, accessTokenSecret)
  let signature = oAuthSignature(baseString, signingKey)
  // return interpolated string
  return 'OAuth ' +
        'oauth_consumer_key="' + consumerKey + '", ' +
        'oauth_nonce="' + nonce + '", ' +
        'oauth_signature="' + signature + '", ' +
        'oauth_signature_method="HMAC-SHA1", ' +
        'oauth_timestamp="' + timestamp + '", ' +
        'oauth_token="' + accessToken + '", ' +
        'oauth_version="1.0"'
}

function oAuthBaseString (method, url, params, key, token, timestamp, nonce) {
  return method +
            '&' + percentEncode(url) +
            '&' + percentEncode(genSortedParamStr(params, key, token, timestamp, nonce))
};

function oAuthSigningKey (consumer_secret, token_secret) {
  return consumer_secret + '&' + token_secret
};

function oAuthSignature (base_string, signing_key) {
  var signature = hmac_sha1(base_string, signing_key)
  return percentEncode(signature)
};
function hmac_sha1 (string, secret) {
  let shaObj = new jsSHA('SHA-1', 'TEXT')
  shaObj.setHMACKey(secret, 'TEXT')
  shaObj.update(string)
  let hmac = shaObj.getHMAC('B64')
  return hmac
};
function mergeObjs (obj1, obj2) {
  for (var attr in obj2) {
    obj1[attr] = obj2[attr]
  }
  return obj1
};
function genSortedParamStr (params, key, token, timestamp, nonce) {
  // Merge oauth params & request params to single object
  let paramObj = mergeObjs(
    {
      oauth_consumer_key: key,
      oauth_nonce: nonce,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_timestamp: timestamp,
      oauth_token: token,
      oauth_version: '1.0'
    },
    params
  )
  // Sort alphabetically
  let paramObjKeys = Object.keys(paramObj)
  let len = paramObjKeys.length
  paramObjKeys.sort()
  // Interpolate to string with format as key1=val1&key2=val2&...
  let paramStr = paramObjKeys[0] + '=' + paramObj[paramObjKeys[0]]
  for (var i = 1; i < len; i++) {
    paramStr += '&' + paramObjKeys[i] + '=' + percentEncode(decodeURIComponent(paramObj[paramObjKeys[i]]))
  }
  return paramStr
};
function percentEncode (str) {
  return encodeURIComponent(str).replace(/[!*()']/g, function (character) {
    return '%' + character.charCodeAt(0).toString(16)
  })
};
window.onloadFuncs = [get_alexa, url_getter, get_details, first_archive_details, recent_archive_details, get_thumbnail, get_tweets, get_annotations, show_annotations, get_tags, createPage, showDOI]
window.onload = function () {
  for (var i in this.onloadFuncs) {
    this.onloadFuncs[i]()
  }
}
