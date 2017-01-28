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


// chrome.webRequest.onErrorOccurred.addListener(onErrorOccurred, {urls: ["http://*/*", "https://*/*"]});

// function onErrorOccurred(details)
// {
//   // alert("DNS ERROR");
//   if (details.error == "net::ERR_NAME_NOT_RESOLVED"){
//     alert("DNS ERROR");
//     // chrome.tabs.update(details.tabId, {url: "..."});
//   }
// }





chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log(changeInfo.status+":"+tab.id+":"+tabId);
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    for(var i = 0; i<tabs.length;i++) {
       chrome.tabs.sendMessage(tabs[i].id, {action: "open_dialog_box"}, function(response) {});    
    }
});
      //   chrome.tabs.executeScript(tab.id, {
      //   file: "scripts/messagesender.js"
      // },function(){
      //   chrome.tabs.sendMessage(tab.id, {action: "open_dialog_box"}, function(response) {});    
      // });
    
  
  // if(changeInfo.status == "complete") {
  //   var xhr = new XMLHttpRequest();
  //   xhr.open("GET", tab.url, true);
  //   xhr.onreadystatechange = function() {
  //     if (xhr.readyState == 4) {
  //       if(xhr.status == 0) {
  //         console.log("wrong domain:"+  tabId);
  //         chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
  //           if(tabs!==undefined && tabs.length>0){
  //             chrome.tabs.sendMessage(tabs[0].id, {action: "open_dialog_box"}, function(response) {});  
  //           }
  //         });
  //         // chrome.tabs.sendMessage(tabId, {action: "open_dialog_box"}, function(response) {});                
  //         console.log("sent");
  //       } 
  //     }
  //   }
  //   xhr.send();
  // }
}); 


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  console.log(message);
  if(message.message=='openurl'){
    chrome.tabs.create({ url: message.url });
  }
});