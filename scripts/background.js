/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */
var VERSION = "1.3.4";

var excluded_urls = [
  
  "www.google.co",
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];
RTurl="";
function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

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
  chrome.tabs.get(details.tabId, function(tab) {
    tabIsReady(tab.incognito);
  });
}, {urls: ["<all_urls>"], types: ["main_frame"]});

/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
  var xhr = new XMLHttpRequest();
  var requestUrl = "https://archive.org/wayback/available";
  var requestParams = "url=" + encodeURI(url);
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("User-Agent", navigator.userAgent + " Wayback_Machine_Firefox/" + VERSION);
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
    
      
      var page_url = message.page_url;
      var wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      var url = page_url.replace(pattern, "");
      var open_url = wayback_url+encodeURI(url);
      console.log(open_url);
      if (message.method!='save') {
        wmAvailabilityCheck(url,function(){
          chrome.tabs.create({ url:  open_url});
        },function(){
          chrome.runtime.sendMessage({message:'urlnotfound'},function(response){
          });
        })
      } else {
        chrome.tabs.create({ url:  open_url});
      }
    
  }else if(message.message=='makemodal'){
            RTurl=message.rturl;
            console.log(RTurl);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab=tabs[0];
                var url=tabs[0].url;
                if(url.includes('web.archive.org') || url.includes('web-beta.archive.org')){
                    //chrome.tabs.sendMessage(tab.id, {message:'nomodal'});
                    alert("Structure as radial tree not available on archive.org pages");
                }else{
                    chrome.tabs.executeScript(tab.id, {
                  file:"scripts/d3.js"
                });
                chrome.tabs.executeScript(tab.id, {
                  file:"scripts/RTcontent.js"
                });
                chrome.tabs.executeScript(tab.id, {
                  file:"scripts/sequences.js"
                });
                }
                
                
                
            });
                
        }else if(message.message=='sendurl'){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var url=tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, {url:url});
            });
        }else if(message.message=='sendurlforrt'){
            console.log(RTurl);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                //var url=tabs[0].url;
                console.log(RTurl);
                chrome.tabs.sendMessage(tabs[0].id, {RTurl:RTurl});
                console.log(RTurl);
            });
        }
});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
  function tabIsReady(isIncognito) {
    if(details.error == 'NS_ERROR_NET_ON_CONNECTING_TO'  || details.error == 'NS_ERROR_NET_ON_RESOLVED'){
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

function auto_save(tabId){

            chrome.tabs.get(tabId, function(tab) {
                var page_url = tab.url;
                if(isValidUrl(page_url)){
                    chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
                    chrome.browserAction.setBadgeText({tabId: tabId, text:"Checking..."});            // checking the archives

                    wmAvailabilityCheck(page_url,function(){
                        chrome.browserAction.setBadgeBackgroundColor({color:"green",tabId: tabId});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2713"});  // webpage is archived
                        console.error(page_url+'is already saved');
                    },function(){
                        chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2613"});                 // webpage not archived
                        console.error(page_url+'is not already saved');
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var tab = tabs[0];
                            var page_url = tab.url;
                            var wb_url = "https://web.archive.org/save/";
                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
                            url = page_url.replace(pattern, "");
                            open_url = wb_url+encodeURI(url);
                            var xhr=new XMLHttpRequest();
                            xhr.open('GET',open_url,true);
                            xhr.onerror=function(){
                                chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
                                    console.error(page_url+' error unknown');
                            };
                            xhr.onload=function(){
                                console.log(xhr.status);
                                if(xhr.status==200){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"blue", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2713"});
                                    console.error(page_url+'is saved now');
                                }else if(xhr.status==403){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
                                    console.error(page_url+' save is forbidden');
                                }else if(xhr.status==503){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
                                    console.error(page_url+' service unavailable');
                                }else if(xhr.status==504){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
                                    console.error(page_url+' gateway timeout');
                                }
                            };
                            xhr.send();
                        });
                    });
                }
            });
}
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        //chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
        //chrome.browserAction.setBadgeText({tabId: tabId, text:"..."});
                  if (changeInfo.status == "complete" && !(tab.url.startsWith("http://web.archive.org/web") || tab.url.startsWith("https://web.archive.org/web") || tab.url.startsWith("https://web-beta.archive.org/web") || tab.url.startsWith("chrome://") )) {
              chrome.storage.sync.get(['as'], function(items) {
                
              if(items.as){
                auto_save(tab.id);
              }
            });
            
          }else{
                    //chrome.browserAction.setBadgeBackgroundColor({color:"",tabId: tabId});
                    chrome.browserAction.setBadgeText({tabId: tabId, text:""});
          }
//        if (changeInfo.status == "complete") {
//            chrome.tabs.get(tabId, function(tab) {
//                var page_url = tab.url;
//                if(isValidUrl(page_url)){
//                    //chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
//                    //chrome.browserAction.setBadgeText({tabId: tabId, text:"Checking..."});            // checking the archives
//
//                    wmAvailabilityCheck(page_url,function(){
//                        chrome.browserAction.setBadgeBackgroundColor({color:"green",tabId: tabId});
//                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2713"});  // webpage is archived
//                        console.error(page_url+'is already saved');
//                    },function(){
//                        chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2613"});                 // webpage not archived
//                        console.error(page_url+'is not already saved');
//                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                            var tab = tabs[0];
//                            var page_url = tab.url;
//                            var wb_url = "https://web.archive.org/save/";
//                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
//                            url = page_url.replace(pattern, "");
//                            open_url = wb_url+encodeURI(url);
//                            var xhr=new XMLHttpRequest();
//                            xhr.open('GET',open_url,true);
//                            xhr.onload=function(){
//                                if(xhr.status==200){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"blue", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2713"});
//                                    console.error(page_url+'is saved now');
//                                }else if(xhr.status==403){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
//                                    console.error(page_url+' save is forbidden');
//                                }else{
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
//                                    console.error(page_url+' error unknown');
//                                }
//                            };
//                            xhr.send();
//                        });
//                    });
//                }
//            });
//        }
    });
 });

