// fact-check.js

// from 'utils.js'
/*   global getUrlByParameter */

const url = getUrlByParameter('url')
$('#fact-check-url').text(url)
if (isValidUrl(url) && isNotExcludedUrl(url)) {
  chrome.runtime.sendMessage({ message: 'getFactCheckResults', url: url }, (resp) => {
    if (resp && resp.results) {
      $('.loader').hide()
      let row = $('<div class="fact-checks-list flex-container">')
      let item = resp.results.meta
      for (i = 0; i < item.indicators.length; i++) {
        let checkedBy = $('<div class="name">').text(item.indicators[i].name)
        let relatedArticle = $('<a target="_blank">').text(item.indicators[i].url).attr('href', item.indicators[i].url)
        let confidenceScore = $('<div class="url-item">').text(item.indicators[i].confidence)
        $('#results-container').append(
          row.append(checkedBy, relatedArticle, confidenceScore)
        )
      }
    }
  })
}