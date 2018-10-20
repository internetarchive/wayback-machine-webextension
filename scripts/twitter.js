function get_tweets (url) {
  let spinner = document.getElementsByClassName('loader')[0]
  var xhr = new XMLHttpRequest()
  var new_url = 'http://gext-api.archive.org/services/context/twitter?url=' + url
  xhr.open('GET', new_url, true)
  xhr.onload = function () {
    let tweets = JSON.parse(xhr.response)
    if (tweets.length > 0) {
      for (let tweet of tweets) {
        var encodedStr = tweet.text
        var parser = new DOMParser() // https://stackoverflow.com/questions/3700326/decode-amp-back-to-in-javascript
        var dom = parser.parseFromString(
          '<!doctype html><body>' + encodedStr,
          'text/html')
        var tweet_text = dom.body.textContent

        var name = tweet.user.name
        var url = 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str
        var date = tweet.created_at.slice(0, 10) + ',' + tweet.created_at.slice(10, 19) // Not sure if this logic is correct

        var p_tweet_text = document.createElement('p')
        p_tweet_text.setAttribute('class', 'tweet')
        p_tweet_text.appendChild(document.createTextNode(tweet_text))
        var a_profile_name = document.createElement('a')
        a_profile_name.setAttribute('href', 'https://twitter.com/' + tweet.user.screen_name)
        a_profile_name.appendChild(document.createTextNode(name))
        var span_date = document.createElement('span')
        span_date.setAttribute('class', 'mention_date')
        span_date.appendChild(document.createTextNode('Created on: ' + date))

        var img = document.createElement('img')
        img.setAttribute('class', 'profile_image')
        img.setAttribute('src', tweet.user.profile_image_url)

        var link = document.createElement('a')
        link.setAttribute('href', url)
        link.appendChild(document.createTextNode('Click here to see the tweet'))
        var tweet_container = document.createElement('blockquote')
        tweet_container.setAttribute('class', 'twitter-tweet box-twitter')

        tweet_container.appendChild(img)
        tweet_container.appendChild(a_profile_name)
        tweet_container.appendChild(document.createElement('br'))
        tweet_container.appendChild(span_date)
        tweet_container.appendChild(p_tweet_text)
        tweet_container.appendChild(link)
        spinner.setAttribute('style', 'display:none;')

        document.getElementById('half').appendChild(tweet_container)
      }
    } else {
      spinner.setAttribute('style', 'display:none;')
      document.getElementById('half').appendChild(document.createTextNode('There are no Tweets for the current URL'))
    }
  }
  xhr.send(null)
}
