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
  })
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

function get_tagCloud() {
  const url = getUrlByParameter('url');
  get_tags(url);
}


function get_hypothesis() {
  get_annotations('domain');
  get_annotations('url');
  $('#row_contain-url').show();
}

function openContextFeature(evt, feature) {
  // Get all elements with class="tabcontent" and hide them
  $(".tabcontent").hide()

  // Get all elements with class="tablinks" and remove the class "active"
  $(".tablinks").removeClass("active");
  // Show the current tab, and add an "active" class to the button that opened the tab
  $(feature).show();
  evt.currentTarget.className += " active";
}

function singlePageView(){

  const contexts_dic = {
    "alexa": get_alexa,
    "domaintools": get_domainTool,
    "wbmsummary": get_WBMSummary,
    "annotations": get_hypothesis,
    "tagcloud": get_tagCloud
  };

  // Check settings for features
  chrome.storage.sync.get(['alexa', 'domaintools', 'wbmsummary', 'annotations', 'tagcloud'], function (event) {
    for (let feature in event) {
      if (event.hasOwnProperty(feature)) {
        let featureId = '#' + feature.charAt(0).toUpperCase() + feature.substring(1);
        let featureTabId = featureId + "_tab";

        // Hide features that weren't selected
        if (!event[feature]) {
          $(featureId).hide();
          $(featureTabId).hide();
        } else {
          contexts_dic[feature]();
          $(featureTabId).click(function(event){
            openContextFeature(event, featureId);
          })
        }
      }
    }
  })
}


window.onload = singlePageView;
