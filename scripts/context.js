function get_tagCloud() {
  const url = getUrlByParameter('url');
  get_tags(url);
  $("#loader_tagcloud").hide();
}


function get_hypothesis() {
  let hypo_domain = get_annotations('domain');
  let hypo_url = get_annotations('url');
  $("#loader_annotations").hide()
  if(hypo_url && hypo_domain){
    $("#annotations_status").show();
  }
}

function openContextFeature(evt, feature) {
  // Get all elements with class="tabcontent" and hide them
  $(".tabcontent").hide()

  // Get all elements with class="tablinks" and remove the class "active"
  $(".col-tablinks button").removeClass("active");
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
  let features = ['alexa', 'domaintools', 'wbmsummary', 'annotations', 'tagcloud'];
  chrome.storage.sync.get(features, function (event) {
    let first_feature = null;
    for (let i =0; i < features.length; i++) {
      let feature = features[i];
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
        if(!first_feature){
          first_feature = featureTabId;
        }
      }

    }
    if(first_feature){
      $(first_feature).click();
    }
  })
}


window.onload = singlePageView;
