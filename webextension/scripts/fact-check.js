// fact-check.js

// from 'utils.js'
/*   global getUrlByParameter, isNotExcludedUrl, isValidUrl */

function cScore(score) {
  let value = ''
  const confidenceScoreDict = {
    high: 'High',
    medium: 'Medium',
    low: 'Low'
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

const url = decodeURIComponent(getUrlByParameter('url'))
$('#fact-check-url').text(url)
if (isValidUrl(url) && isNotExcludedUrl(url)) {
  chrome.runtime.sendMessage({ message: 'getFactCheckResults', url: url }, (resp) => {
    $('.loader').hide()
    $('.facts').show()
    if (resp && resp.json) {
      if (resp.json.results && resp.json.results.meta && resp.json.results.meta.indicators) {
        // api returns results
        let item = resp.json.results.meta
        for (let i = 0; i < item.indicators.length; i++) {
          let row = $('<div class="fact-checks-list">')
          let checkedBy = $('<div class="name">').text(item.indicators[i].name)
          let relatedAnalysis = $('<a target="_blank">').text(item.indicators[i].url).attr('href', item.indicators[i].url)
          /*
          let scoreValue = $('<span class="color_code">').text((Math.round((item.indicators[i].confidence)*100)))
          let sRating = cScore(item.indicators[i].confidence)
          let scoreLabel = $(`<span class="score-label ${sRating}">`).text(sRating)
          let confidenceScore = $('<div>').text('Confidence Score: ').append(scoreValue, scoreLabel)
          */
          $('#results-container').append(
            row.append(checkedBy, relatedAnalysis)
          )
        }
      } else {
        // api returns no results
        let row = $('<div class="fact-checks-list title">')
        $('#results-container').append(row.text('No fact checks found for the current URL.'))
      }
    } else {
      // api call failed
      let row = $('<div class="fact-checks-list title">')
      $('#results-container').append(row.text('Fact check server is not responding.'))
    }
  })
}
