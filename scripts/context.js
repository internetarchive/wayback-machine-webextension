// context.js

// from 'utils.js'
/*   global getUrlByParameter */

// from 'tagcloud.js'
/*   global get_tags */

// from 'annotation.js'
/*   global get_annotations */

// from 'alexa.js'
/*   global get_alexa */

// from 'domaintools.js'
/*   global get_domainTool */

// from 'overview.js'
/*   global get_WBMSummary */

function get_tagCloud() {
  const url = getUrlByParameter('url')
  get_tags(url)
}

function get_hypothesis() {
  let hypo_domain = get_annotations('domain')
  let hypo_url = get_annotations('url')
  $('#loader_annotations').hide()
  if (hypo_url && hypo_domain) {
    $('#annotations_status').show()
  }
}

function openContextFeature(evt, feature) {
  // Get all elements with class="tabcontent" and hide them
  $('.tabcontent').hide()

  // Get all elements with class="tablinks" and remove the class "active"
  $('.col-tablinks button').removeClass('active')
  // Show the current tab, and add an "active" class to the button that opened the tab
  $(feature).show()
  evt.currentTarget.className += ' active'
  return feature
}

function singlePageView() {
  const contexts_dic = {
    'alexa': get_alexa,
    'domaintools': get_domainTool,
    'wbmsummary': get_WBMSummary,
    'annotations': get_hypothesis,
    'tagcloud': get_tagCloud
  }

  // Check settings for features
  let features = ['alexa', 'domaintools', 'wbmsummary', 'annotations', 'tagcloud']
  chrome.storage.sync.get(features, function (event) {
    chrome.storage.sync.get(['selectedFeature'], function(result) {
      var openedFeature = result.selectedFeature
      let clickFeature = null
      let countFeature = 0
      for (let i = 0; i < features.length; i++) {
        let feature = features[i]
        let featureId = '#' + feature.charAt(0).toUpperCase() + feature.substring(1)
        let featureTabId = featureId + '_tab'

        // Hide features that weren't selected
        if (!event[feature]) {
          $(featureId).hide()
          $(featureTabId).hide()
        } else {
          countFeature++
          contexts_dic[feature]()
          $(featureTabId).click(function(event) {
            let selectedFeature = openContextFeature(event, featureId) + '_tab'
            chrome.storage.sync.set({selectedFeature: selectedFeature}, function() {
            })
          })
          //Get first tab
          if (!clickFeature) {
            clickFeature = featureTabId
          }
          if (openedFeature) {
            //Open the first tab if last selected tab is hidden now
            if (openedFeature !== featureTabId) {
              $(clickFeature).click()
            } else {
              //Open the last selected tab
              clickFeature = openedFeature
              $(clickFeature).click()
            }
          } else {
            //Open first tab if user is accesing Contexts Page for the first time
            $(clickFeature).click()
          }
        }
      }
      //Hide error message if a context is selected
      if (countFeature > 0) {
        $('#error-message').hide()
      }
    })
  }) 
}

window.onload = singlePageView
