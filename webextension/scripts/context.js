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
  // Get all button elements inside elements with class="col-tablinks" and remove the class "active"
  $('.col-tablinks button').removeClass('active')
  // Show the current tab, and add an "active" class to the button that opened the tab
  $(feature).show()
  evt.currentTarget.children[0].className += ' active'
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
  chrome.storage.local.get(features, (event) => {
    chrome.storage.local.get(['selectedFeature'], (result) => {
      let openedFeature = result.selectedFeature
      let clickFeature = null
      let countFeature = 0
      let lastFeatureTab = null
      for (let i = 0; i < features.length; i++) {
        let feature = features[i]
        let featureId = '#' + feature.charAt(0).toUpperCase() + feature.substring(1)
        let featureTabId = featureId + '_tab'

        if (event[feature]) {
          countFeature++
          lastFeatureTab = featureTabId
          // Show sidebar menu
          $('#side-nav-bar').show()
          // Show selected features in menu
          $(featureTabId).show()
          contexts_dic[feature]()
          $(featureTabId).click((event) => {
            // When clicked on a context tab, open that tab and set that tab as selectedFeature
            openContextFeature(event, featureId)
            let selectedFeature = featureTabId
            chrome.storage.local.set({ selectedFeature }, () => {
            })
          })
          // Get first tab
          if (!clickFeature) {
            clickFeature = featureTabId
            //Set border for the first tab
            $(clickFeature).children(0).css({'border-radius': '5px 5px 0 0'})
          }
          // Open the selected tab if it is there
          if (openedFeature) {
            // Open the first tab if last selected tab is hidden now
            if (openedFeature !== featureTabId) {
              $(clickFeature).click()
            } else {
              // Open the previously selected tab
              clickFeature = openedFeature
              $(clickFeature).click()
            }
          } else {
            // Open first tab if user is accesing Contexts Page for the first time
            $(clickFeature).click()
          }
        }
      }
      //Set border for the last tab
      $(lastFeatureTab).children(0).css({'border-bottom-left-radius': '5px', 'border-bottom-right-radius': '5px'})
      // Show error message if no context is selected
      if (countFeature <= 0) {
        $('#error-message').show()
      }
    })
  })
}

$('.url').text(getUrlByParameter('url'))

window.onload = singlePageView