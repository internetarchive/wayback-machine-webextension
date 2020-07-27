// fact-check.js

// from 'utils.js'
/*   global getUrlByParameter, isNotExcludedUrl, isValidUrl */

function cScore(score) {
  let value = ''
  const confidenceScoreDict = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  if (score > 0.7) {
    value = 'high'
  } else if (score > 0.5) {
    value = 'medium'
  } else if (score >= 0) {
    value = 'low'
  }
  return confidenceScoreDict[value]
}

const url = getUrlByParameter('url')
$('#fact-check-url').text(url)
if (isValidUrl(url) && isNotExcludedUrl(url)) {
  chrome.runtime.sendMessage({ message: 'getFactCheckResults', url: url }, (resp) => {
    if (resp && resp.results) {
      $('.loader').hide()
      let item = resp.results.meta
      for (let i = 0; i < item.indicators.length; i++) {
        let row = $('<div class="fact-checks-list flex-container">')
        let checkedBy = $('<div class="name">').text(item.indicators[i].name)
        let relatedAnalysis = $('<a target="_blank">').text(item.indicators[i].url).attr('href', item.indicators[i].url)
        let scoreValue = $('<span class="highlight">').text((Math.round((item.indicators[i].confidence)*100)))
        let sRating = cScore(item.indicators[i].confidence)
        let scoreLabel = $(`<span class="score-label ${sRating}">`).text(sRating)
        let confidenceScore = $('<div>').text('Confidence Score: ').append(scoreValue, scoreLabel)

        $('#results-container').append(
          row.append(checkedBy, relatedAnalysis, confidenceScore)
        )
      }
    }
    // TODO: handle error (resp.error)
  })
}