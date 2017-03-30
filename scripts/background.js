/*
 * LICENSE: AGPL-3
 * Copyright 2016, Internet Archive
 */
(function() {
  var enforceBannerInterval;
  var archiveLinkWasClicked = false;
  var bannerWasShown = false;
  var bannerWasClosed = false;

  /**
   * Brute force inline css style reset
   */
  function resetStyesInline(el) {
    el.style.margin = 0;
    el.style.padding = 0;
    el.style.border = 0;
    el.style.fontSize = "100%";
    el.style.font = "inherit";
    el.style.fontFamily = "sans-serif";
    el.style.verticalAlign = "baseline";
    el.style.lineHeight = "1";
    el.style.boxSizing = "content-box";
    el.style.overflow = "unset";
    el.style.fontWeight = "inherit";
    el.style.height = "auto";
    el.style.position = "relative";
    el.style.width = "auto";
    el.style.display = "inline";
    el.style.backgroundColor = "transparent";
    el.style.color = "#333";
    el.style.textAlign = "left";
  }

  /**
   * Communicates with background.js
   * @param action {string}
   * @param complete {function}
   */

  /**
   * @param {string} type
   * @param {function} handler(el)
   * @param remaining args are children
   * @returns {object} DOM element
   */
  function createEl(type, handler) {
    var el = document.createElement(type);
    resetStyesInline(el);
    if (handler !== undefined) {
      handler(el);
    }
    // Append *args to created el
    for (var i = 2; i < arguments.length; i++) {
      el.appendChild(arguments[i]);
    }
    return el;
  }

  function createBanner(wayback_url) {
    if (document.getElementById("no-more-404s-message") !== null) {
      return;
    }
    document.body.appendChild(
      createEl("div",
        function(el) {
          el.id = "no-more-404s-message";
          el.style.background = "rgba(0,0,0,.6)";
          el.style.position = "fixed";
          el.style.top = "0";
          el.style.right = "0";
          el.style.bottom = "0";
          el.style.left = "0";
          el.style.zIndex = "999999999";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent ="center";
          },
          createEl("div",
            function(el) {
              el.id = "no-more-404s-message-inner";
              el.style.flex = "0 0 420px";
              el.style.position = "relative";
              el.style.top = "0";
              el.style.padding = "2px";
              el.style.backgroundColor = "#fff";
              el.style.borderRadius = "5px";
              el.style.overflow = "hidden";
              el.style.display = "flex";
              el.style.flexDirection = "column";
              el.style.alignItems = "stretch";
              el.style.justifyContent ="center";
              el.style.boxShadow = "0 4px 20px rgba(0,0,0,.5)";
            },
            createEl("div",
              function(el) {
                el.id = "no-more-404s-header";
                el.style.alignItems = "center";
                el.style.backgroundColor = "#0996f8";
                el.style.borderBottom = "1px solid #0675d3";
                el.style.borderRadius = "4px 4px 0 0";
                el.style.color = "#fff";
                el.style.display = "flex";
                el.style.fontSize = "24px";
                el.style.fontWeight = "700";
                el.style.height = "54px";
                el.style.justifyContent = "center";
                el.appendChild(document.createTextNode("Page not available?"));
              },
              createEl("button",
                function(el) {
                  el.style.position = "absolute";
                  el.style.display = "flex";
                  el.style.alignItems = "center";
                  el.style.justifyContent = "center";
                  el.style.transition = "background-color 150ms";
                  el.style.top = "12px";
                  el.style.right = "16px";
                  el.style.width = "22px";
                  el.style.height = "22px";
                  el.style.borderRadius = "3px";
                  el.style.boxSizing = "border-box";
                  el.style.padding = "0";
                  el.style.border = "none";
                  el.onclick = function() {
                    clearInterval(enforceBannerInterval);
                    document.getElementById("no-more-404s-message").style.display = "none";
                    bannerWasClosed = true;
                  };
                  el.onmouseenter = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.1)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
                  };
                  el.onmousedown = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.2)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.15) inset";
                  };
                  el.onmouseup = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.1)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
                  };
                  el.onmouseleave = function() {
                    el.style.backgroundColor = "transparent";
                    el.style.boxShadow = "";
                  };
                },
                createEl("img",
                  function(el) {
                    el.src = chrome.extension.getURL("images/close.svg");
                    el.alt = "close";
                    el.style.height = "16px";
                    el.style.transition = "background-color 100ms";
                    el.style.width = "16px";
                    el.style.margin = "0 auto";
                  }
                )
              )
            ),
            createEl("p", function(el) {
              el.appendChild(document.createTextNode("View a saved version courtesy of the"));
              el.style.fontSize = "16px";
              el.style.margin = "20px 0 4px 0";
              el.style.textAlign = "center";
            }),
            createEl("img", function(el) {
              el.id = "no-more-404s-image";
              el.src = chrome.extension.getURL("images/logo.gif");
              el.style.height = "auto";
              el.style.position = "relative";
              el.style.width = "100%";
              el.style.boxSizing = "border-box";
              el.style.padding = "10px 22px";
            }),
            createEl("a", function(el) {
              el.id = "no-more-404s-message-link";
              el.href = wayback_url;
              el.style.alignItems = "center";
              el.style.backgroundColor = "#0996f8";
              el.style.border = "1px solid #0675d3";
              el.style.borderRadius = "3px";
              el.style.color = "#fff";
              el.style.display = "flex";
              el.style.fontSize = "19px";
              el.style.height = "52px";
              el.style.justifyContent = "center";
              el.style.margin = "20px";
              el.style.textDecoration = "none";
              el.appendChild(document.createTextNode("Click here to see archived version"));
              el.onmouseenter = function() {
                el.style.backgroundColor = "#0675d3";
                el.style.border = "1px solid #0568ba";
              };
              el.onmousedown = function() {
                el.style.backgroundColor = "#0568ba";
                el.style.border = "1px solid #0568ba";
              };
              el.onmouseup = function() {
                el.style.backgroundColor = "#0675d3";
                el.style.border = "1px solid #0568ba";
              };
              el.onmouseleave = function() {
                el.style.backgroundColor = "#0996f8";
                el.style.border = "1px solid #0675d3";
              };
              el.onclick = function(e) {
                archiveLinkWasClicked = true;

                // Work-around for myspace which hijacks the link
                if (window.location.hostname.indexOf("myspace.com") >= 0) {
                  e.preventDefault();
                  return false;
                } else {
                }
              };
            })
          )
        )
      );
    // Focus the link for accessibility
    document.getElementById("no-more-404s-message-link").focus();

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById("no-more-404s-message").style.transform = "translate(0, 0%)";
    }, 100);

    bannerWasShown = true;
  }

  function checkIt(wayback_url) {
    // Some pages use javascript to update the dom so poll to ensure
    // the banner gets recreated if it is deleted.
    enforceBannerInterval = setInterval(function() {
      createBanner(wayback_url);
    }, 500);

  }



})();


/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */
var VERSION = "1.2";

var excluded_urls = [
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

var WB_API_URL = "https://archive.org/wayback/available";

function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION
    }
  }
  return {requestHeaders: e.requestHeaders};
}

/*
 * Add rewriteUserAgentHeader as a listener to onBeforeSendHeaders
 * Make it "blocking" so we can modify the headers.
*/
chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: [WB_API_URL]},
  ["blocking", "requestHeaders"]
);



/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504,
                         509, 520, 521, 523, 524, 525, 526];

    if (isIncognito === false &&
        details.frameId === 0 &&
        httpFailCodes.indexOf(details.statusCode) >= 0 &&
        isValidUrl(details.url)) {
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        }, function() {
          chrome.tabs.sendMessage(details.tabId, {
            type: "SHOW_BANNER",
            wayback_url: wayback_url
          });
        });
      }, function() {

      });
    }
  }
  if(details.tabId >0 ){
    chrome.tabs.get(details.tabId, function(tab) {
      tabIsReady(tab.incognito);
    });  
  }

  
}, {urls: ["<all_urls>"], types: ["main_frame"]});


chrome.webRequest.onErrorOccurred.addListener(function(details) {
  function tabIsReady(isIncognito) {
    if(details.error == 'net::ERR_NAME_NOT_RESOLVED' || details.error == 'net::ERR_NAME_RESOLUTION_FAILED'
      || details.error == 'net::ERR_CONNECTION_TIMED_OUT'  || details.error == 'net::ERR_NAME_NOT_RESOLVED' ){
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?url="+wayback_url});
      }, function() {
        
      });
    }
  }
  if(details.tabId >0 ){
    chrome.tabs.get(details.tabId, function(tab) {
      tabIsReady(tab.incognito);
    });  
  }

  
}, {urls: ["<all_urls>"], types: ["main_frame"]});

/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
  var xhr = new XMLHttpRequest();
  var requestUrl = WB_API_URL;
  var requestParams = "url=" + encodeURI(url);
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("Wayback-Api-Version", 2);
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    var wayback_url = getWaybackUrlFromResponse(response);
    if (wayback_url !== null) {
      onsuccess(wayback_url, url);
    } else if (onfail) {
      onfail();
    }
  };
  xhr.send(requestParams);
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
  if (response.results &&
      response.results[0] &&
      response.results[0].archived_snapshots &&
      response.results[0].archived_snapshots.closest &&
      response.results[0].archived_snapshots.closest.available &&
      response.results[0].archived_snapshots.closest.available === true &&
      response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
      isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) {
    return makeHttps(response.results[0].archived_snapshots.closest.url);
  } else {
    return null;
  }
}

function makeHttps(url) {
  return url.replace(/^http:/, "https:");
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
  return ((typeof url) === "string" &&
    (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var page_url = tab.url;
      wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      url = page_url.replace(pattern, "");
      open_url = wayback_url+encodeURI(url);
      if(message.method!='save'){
        wmAvailabilityCheck(page_url,function(){
          chrome.tabs.create({ url:  open_url});
        },function(){
          alert("URL not found in wayback archives!");
        })  
      }else{
        chrome.tabs.create({ url:  open_url});
      }
    });
  } else if (message.message == 'geturl') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      var tab = tabs[0];
      var page_url = tab.url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      url = page_url.replace(pattern, "");
      if (isValidSnapshotUrl(url)) {
        sendResponse({ url: url });
      }
    });
    return true;
  } else if (message.message == 'openlink') {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.create({ url: message.link });
    });
  }
});

