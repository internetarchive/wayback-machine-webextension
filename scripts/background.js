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
var VERSION = "2.18.7";
Globalstatuscode="";
var excluded_urls = [
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

var previous_RTurl="";
var windowId1 =0;
var windowId2 =0;
var windowId3 =0;
var windowId4 =0;
var windowId5=0;
var windowId6=0;
var windowId7=0;
var windowId8=0;
var windowIdtest=0;
var windowIdSingle=0;
var tabId1=0;
var tabId2=0;
var tabId3=0;
var tabId4=0;
var tabId5=0;
var tabId6=0;
var tabId7=0;
var tabId8=0;
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
      header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION + " Status-code/" + Globalstatuscode;
        console.log(header);
    }
  }
  return {requestHeaders: e.requestHeaders};
}

myNotID=null;

chrome.webRequest.onBeforeSendHeaders.addListener(
  rewriteUserAgentHeader,
  {urls: [WB_API_URL]},
  ["blocking", "requestHeaders"]
);

/**
 * Header callback
 */
RTurl="";
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504,
      509, 520, 521, 523, 524, 525, 526];
      if (isIncognito === false &&
        details.frameId === 0 &&
        httpFailCodes.indexOf(details.statusCode) >= 0 &&
        isValidUrl(details.url)) {
              Globalstatuscode=details.statusCode;
              wmAvailabilityCheck(details.url, function(wayback_url, url) {
              if(details.statusCode==504){
                  //notify(wayback_url,'View an archived version courtesy of the Internet Archive WayBack Machine');
                  chrome.notifications.create(
                'wayback-notification',{   
                type: 'basic', 
                requireInteraction:true,
                iconUrl: '/images/logo.gif', 
                title: "Page not available ?", 
                message:"View an archived version courtesy of the WayBack Machine",
                buttons:[{
                    title: "Click here to see archived version"
                }]
                },
                function(id){
                    myNotID=id;
                } 
              );
              chrome.notifications.onButtonClicked.addListener(function(notifId, btnIdx) {
    if (notifId === myNotID) {
        if (btnIdx === 0) {
                chrome.tabs.create({ url:wayback_url});
                chrome.notifications.clear(myNotID);
                myNotID=null;
        }
    }
});
              }else{
                  chrome.tabs.executeScript(details.tabId, {
              file: "scripts/client.js"
            }, function() {
              chrome.tabs.sendMessage(details.tabId, {
                type: "SHOW_BANNER",
                wayback_url: wayback_url,
                page_url: details.url,
                status_code: details.statusCode
              });
            });
              }
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
  var requestUrl = "https://archive.org/wayback/available";
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

function URLopener(open_url,url,wmAvailabilitycheck){
    if(wmAvailabilitycheck==true){
        wmAvailabilityCheck(url,function(){
          chrome.tabs.create({ url:  open_url});
    },function(){
          alert("URL not found");
      });
    }else{
        chrome.tabs.create({ url:  open_url});
    }
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
      var page_url = message.page_url;
      var wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      var url = page_url.replace(pattern, "");
      var open_url = wayback_url+encodeURI(url);
      console.log(open_url);
      if(!page_url.includes('chrome://')){
        if (message.method!='save') {
          URLopener(open_url,url,true);
        } else {
          chrome.tabs.create({ url:  open_url});
        }
      }
  }else if(message.message=='makemodal'){
            RTurl=message.rturl;
            console.log(RTurl);
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab=tabs[0];
                var url=RTurl;
                if(url.includes('web.archive.org') || url.includes('web-beta.archive.org') || url.includes('chrome.google.com/webstore')){ //chrome debugger API  isn’t allowed to attach to any page in the Chrome Web Store
                    //chrome.tabs.sendMessage(tab.id, {message:'nomodal'});
                    alert("Structure as radial tree not available on this page");
                }else if((previous_RTurl!=url && url==tab.url) || (previous_RTurl!=url && url!=tab.url)){
                        chrome.tabs.sendMessage(tab.id,{message:"deletenode"});
                            chrome.tabs.executeScript(tab.id, {
                              file:"scripts/lodash.min.js"
                            });
                            chrome.tabs.executeScript(tab.id, {
                              file:"scripts/d3.js"
                            });
                            chrome.tabs.executeScript(tab.id, {
                              file:"scripts/radial-tree.umd.js"
                            });
                            chrome.tabs.executeScript(tab.id, {
                              file:"scripts/RTcontent.js"
                            });
                            chrome.tabs.executeScript(tab.id, {
                              file:"scripts/sequences.js"
                            });
                            previous_RTurl=url; 
                }else if(previous_RTurl==url){
                    chrome.tabs.executeScript(tab.id, {
                      file:"scripts/lodash.min.js"
                    });
                    chrome.tabs.executeScript(tab.id, {
                      file:"scripts/d3.js"
                    });
                    chrome.tabs.executeScript(tab.id, {
                      file:"scripts/radial-tree.umd.js"
                    });
                    chrome.tabs.executeScript(tab.id, {
                      file:"scripts/RTcontent.js"
                    });
                    chrome.tabs.executeScript(tab.id, {
                      file:"scripts/sequences.js"
                    });
                    previous_RTurl=url;
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
        }else if(message.message=='changeBadge'){
          var tabId=message.tabId;
          console.log(tabId);
          chrome.browserAction.setBadgeText({tabId: tabId, text:"\u2713"});
          console.log("Badge Changed");
        }else if(message.message=='showall'){
          chrome.storage.sync.get(['show_context'],function(event){
            if(!event.show_context){
              event.show_context="tab"; //By-default the context-window open in tabs
            }
            chrome.storage.sync.get(['annotation_context'],function(event){
              if(event.annotation_context==undefined){
                event.annotation_context="domain"; 
              }
            });
            var received_url=message.url; //URL which is received by message-parsing_url
            received_url = received_url.replace(/^https?:\/\//,'');
            var length=received_url.length; 
            var last_index=received_url.indexOf('/');
            var url=received_url.slice(0,last_index);    //URL which will be using for alexa and whois
            var open_url=received_url;          //URL which will be needed for finding tweets
            if(open_url.slice(-1)=='/') open_url=received_url.substring(0,open_url.length-1); 
            chrome.storage.sync.get(['auto_update_context'],function(event1){
              if(event1.auto_update_context==undefined){
                event1.auto_update_context=false;
              }
              console.log("here");
              if(event.show_context=="tab"){
                if(tabId2==0 || tabId3==0 || tabId4==0 ||tabId5==0){
                  chrome.storage.sync.get(['showall'],function(event2){
                    if(event2.showall==undefined){
                      event2.showall=true;
                    }
                    if(event2.showall==true){
                      console.log("autoupdate true and showall true and tab");
                      chrome.windows.create({url:chrome.runtime.getURL("alexa.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
                        windowIdtest = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowIdtest){
                            windowIdtest=0;
                          }
                        });
                      });
                      var whois_url="https://www.whois.com/whois/" + url;
                      chrome.tabs.create({'url': whois_url,'active':false},function(tab){
                        tabId2=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId2){
                            tabId2=0;
                          }
                        });
                      });
                      var tweet_url="https://twitter.com/search?q="+open_url;
                      chrome.tabs.create({'url': tweet_url,'active':false},function(tab){
                        tabId3=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId3){
                            tabId3=0;
                          }
                        });
                      });
                      chrome.tabs.create({url:chrome.runtime.getURL("overview.html")+"?url="+message.url,'active':false},function(tab){
                        tabId4=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId4){
                            tabId4=0;
                          }
                        });
                      });
                      chrome.tabs.create({url:chrome.runtime.getURL("annotation.html")+"?url="+message.url,'active':false},function(tab){
                        tabId5=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId5){
                            tabId5=0;
                          }
                        });
                      });   
                      chrome.tabs.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url,'active':false},function(tab){
                        tabId8=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId8){
                            tabId8=0;
                          }
                        });
                      });   
                      chrome.tabs.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,'active':false},function(tab){
                        tabId6=tab.id;
                        chrome.tabs.onRemoved.addListener(function (tabtest) {
                          if(tabtest==tabId6){
                            tabId6=0;
                          }
                        });
                      });
                    chrome.tabs.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url,'active':false},function(tab){
                      tabId7=tab.id;
                      chrome.tabs.onRemoved.addListener(function (tabtest) {
                        if(tabtest==tabId7){
                          tabId7=0;
                        }
                      });
                    });  
                    }else{
                      console.log("autoupdate true and showall false and tab");
                      chrome.storage.sync.get(function(event4){
                        if(event4.alexa==true){
                          console.log("checking 1");
                          openThatContext("alexa",url,event.show_context);
                        }
                          chrome.storage.sync.get(function(event5){
                            if(event5.whois==true){
                              console.log("checking 2");
                              openThatContext("whois",url,event.show_context);
                            }
                              chrome.storage.sync.get(function(event6){
                                if(event6.tweets==true){
                                  console.log("checking 3");
                                  openThatContext("tweets",open_url,event.show_context);
                                }
                                  chrome.storage.sync.get(function(event7){
                                    if(event7.wbmsummary==true){
                                      console.log("checking 4");
                                      openThatContext("wbmsummary",message.url,event.show_context);
                                    }
                                      chrome.storage.sync.get(function(event8){
                                        if(event8.annotations==true){
                                          console.log("checking 5");
                                          openThatContext("annotations",message.url,event.show_context);
                                        }
                                          chrome.storage.sync.get(function(event9){
                                            if(event9.similarweb==true){
                                              console.log("checking 6");
                                              openThatContext("similarweb",url,event.show_context);
                                            }
                                            chrome.storage.sync.get(function(event10){
                                              if(event10.tagcloud==true){
                                                console.log("checking 6");
                                                openThatContext("tagcloud",message.url,event.show_context);
                                              }
                                              chrome.storage.sync.get(function(event11){
                                                if(event11.annotationsurl==true){
                                                  console.log("checking 6");
                                                  openThatContext("annotationsurl",url,event.show_context);
                                                }
                                              });
                                            });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                    }
                  });
                }else{
                  chrome.tabs.query({
                    windowId: windowIdtest
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("alexa.html")+"?url="+url});
                  });
                  var whois_url="https://www.whois.com/whois/" + url;
                  chrome.tabs.update(parseInt(tabId2), {url:whois_url});
                  var tweet_url="https://twitter.com/search?q="+open_url;
                  chrome.tabs.update(parseInt(tabId3), {url:tweet_url});
                  chrome.tabs.update(parseInt(tabId4), {url:chrome.runtime.getURL("overview.html")+"?url="+message.url});
                  chrome.tabs.update(parseInt(tabId5), {url:chrome.runtime.getURL("annotation.html")+"?url="+message.url});
                  chrome.tabs.update(parseInt(tabId8), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url});
                  chrome.tabs.update(parseInt(tabId6), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                  chrome.tabs.update(parseInt(tabId7), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url});
                }
              }else if(event.show_context=="window"){
                if(windowId1==0 ||windowId2==0||windowId3==0||windowId4==0||windowId5==0||windowId6==0){
                  chrome.storage.sync.get(['showall'],function(event2){
                    if(event2.showall==undefined){
                      event2.showall=true;
                    }
                    if(event2.showall==true){
                      chrome.windows.create({url:chrome.runtime.getURL("alexa.html")+"?url="+url, width:500, height:500, top:0, left:0, focused:false},function (win) {
                        windowId1 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId1){
                            windowId1=0;
                          }
                        });
                      });
                      var whois_url="https://www.whois.com/whois/" +url;
                      chrome.windows.create({url:whois_url, width:500, height:500, top:500, left:0, focused:false},function (win) {
                        windowId2 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId2){
                            windowId2=0;
                          }                    
                        });
                      });
                      var tweet_url="https://twitter.com/search?q="+open_url;
                      chrome.windows.create({url:tweet_url, width:500, height:500, top:0, left:500, focused:false},function (win) {
                        windowId3 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId3){
                            windowId3=0;
                          }                    
                        });
                      });
                      chrome.windows.create({url:chrome.runtime.getURL("overview.html")+"?url="+message.url,width:500, height:500, top:500, left:500, focused:false},function (win) {
                        windowId4 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId4){
                            windowId4=0;
                          }            
                        });
                      });
                      chrome.windows.create({url:chrome.runtime.getURL("annotation.html")+"?url="+message.url,width:700, height:500, top:0, left:1000, focused:false},function (win) {
                        windowId5 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId5){
                            windowId5=0;
                          }
                        });
                      });
                      chrome.windows.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url,width:700, height:500, top:0, left:1000, focused:false},function (win) {
                        windowId8 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId8){
                            windowId8=0;
                          }
                        });
                      });
                      chrome.windows.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,width:600, height:500, top:500, left:1000, focused:false},function (win) {
                        windowId6 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId6){
                            windowId6=0;
                          }
                        });
                      });
                      chrome.windows.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url,width:600, height:500, top:600, left:1100, focused:false},function (win) {
                        windowId7 = win.id;
                        chrome.windows.onRemoved.addListener(function (win1) {
                          if(win1==windowId7){
                            windowId7=0;
                          }
                        });
                      });
                    }else{
                      chrome.storage.sync.get(function(event4){
                        if(event4.alexa==true){
                          console.log("checking 1");
                          openThatContext("alexa",url,event.show_context);
                        }
                          chrome.storage.sync.get(function(event5){
                            if(event5.whois==true){
                              console.log("checking 2");
                              openThatContext("whois",url,event.show_context);
                            }
                              chrome.storage.sync.get(function(event6){
                                if(event6.tweets==true){
                                  console.log("checking 3");
                                  openThatContext("tweets",open_url,event.show_context);
                                }
                                  chrome.storage.sync.get(function(event7){
                                    if(event7.wbmsummary==true){
                                      console.log("checking 4");
                                      openThatContext("wbmsummary",message.url,event.show_context);
                                    }
                                      chrome.storage.sync.get(function(event8){
                                        if(event8.annotations==true){
                                          console.log("checking 5");
                                          openThatContext("annotations",message.url,event.show_context);
                                        }
                                          chrome.storage.sync.get(function(event9){
                                            if(event9.similarweb==true){
                                              console.log("checking 6");
                                              openThatContext("similarweb",url,event.show_context);
                                            }
                                            chrome.storage.sync.get(function(event10){
                                              if(event10.similarweb==true){
                                                console.log("checking 6");
                                                openThatContext("tagcloud",message.url,event.show_context);
                                              }
                                              chrome.storage.sync.get(function(event10){
                                                if(event10.annotationsurl==true){
                                                  console.log("checking 6");
                                                  openThatContext("annotationsurl",url,event.show_context);
                                                }
                                              });
                                            });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                    }
                  });
                }else{
                  chrome.tabs.query({
                    windowId: windowId1
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("alexa.html")+"?url="+url});
                  });  
                  chrome.tabs.query({
                    windowId: windowId2
                  }, function(tabs) {
                    var tab=tabs[0];
                    var whois_url="https://www.whois.com/whois/" +url;
                    chrome.tabs.update(tab.id, {url:whois_url});
                  });
                  chrome.tabs.query({
                    windowId: windowId3
                  }, function(tabs) {
                    var tab=tabs[0];
                    var tweet_url="https://twitter.com/search?q="+open_url;
                    chrome.tabs.update(tab.id, {url:tweet_url});
                  });
                  chrome.tabs.query({
                    windowId: windowId4
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("overview.html")+"?url="+message.url});
                  });
                  chrome.tabs.query({
                    windowId: windowId5
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("annotation.html")+"?url="+message.url});
                  });
                  chrome.tabs.query({
                    windowId: windowId8
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("annotationURL.html")+"?url="+message.url});
                  });
                  chrome.tabs.query({
                    windowId: windowId6
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                  });  
                  chrome.tabs.query({
                    windowId: windowId7
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("tagcloud.html")+"?url="+message.url});
                  });
                }                               
              }
              else if(event.show_context=="singlewindow"){
                  if(windowIdSingle!=0){
                    console.log(message.url);
                    chrome.tabs.query({
                      windowId: windowIdSingle
                    }, function(tabs) {
                      var tab=tabs[0];
                      chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("singleWindow.html")+"?url="+message.url});
                    });
                  }else{
                    chrome.windows.create({url:chrome.runtime.getURL("singleWindow.html")+"?url="+message.url, width:1000, height:1000, top:0, left:0, focused:false},function (win) {
                      windowIdSingle = win.id;
                      console.log(message.url);
                      chrome.windows.onRemoved.addListener(function (win1) {
                        if(win1==windowIdSingle){
                          windowIdSingle=0;
                        }
                      });
                    });
                  }
              }
            });
          });
        }
});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
      function tabIsReady(isIncognito) {
        if(details.error == 'net::ERR_NAME_NOT_RESOLVED' || details.error == 'net::ERR_NAME_RESOLUTION_FAILED'
        || details.error == 'net::ERR_CONNECTION_TIMED_OUT'  || details.error == 'net::ERR_NAME_NOT_RESOLVED' ){
          wmAvailabilityCheck(details.url, function(wayback_url, url) {
            chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?wayback_url="+wayback_url+"?page_url="+url+"?status_code="+details.statusCode+"?"});
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
var contextMenuItemFirst={
    "id":"first",
    "title":"First Version",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};

var contextMenuItemRecent={
    "id":"recent",
    "title":"Recent Version",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};
var contextMenuItemAll={
    "id":"all",
    "title":"All Versions",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};

var contextMenuItemSave={
    "id":"save",
    "title":"Save Page Now",
    "contexts":["all"],
    "documentUrlPatterns":["*://*/*", "ftp://*/*"]
};
chrome.contextMenus.create(contextMenuItemFirst);
chrome.contextMenus.create(contextMenuItemRecent);
chrome.contextMenus.create(contextMenuItemAll);
chrome.contextMenus.create(contextMenuItemSave);

function contextMenuOpener(type,page_url){
    var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
    if(typeof type ==='number'){
        var wmAvailabilitycheck=true;
        var wayback_url ="https://web.archive.org/web/"+type+"/";
    }else{
        var wmAvailabilitycheck=false;
        var wayback_url ="https://web.archive.org/"+type;
    }
    var url = page_url.replace(pattern, "");
    var open_url = wayback_url+encodeURI(url);
    URLopener(open_url,url,wmAvailabilitycheck);
}

chrome.contextMenus.onClicked.addListener(function(clickedData){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var page_url=tabs[0].url;
        if(clickedData.menuItemId=='first'){
            contextMenuOpener(0,page_url);
        }else if(clickedData.menuItemId=='recent'){
            contextMenuOpener(2,page_url);
        }else if(clickedData.menuItemId=='save'){
            contextMenuOpener('save/',page_url);
        }else if(clickedData.menuItemId=='all'){
            contextMenuOpener('web/*/',page_url);
        }
    });
});



//function auto_save(tabId){
//
//            chrome.tabs.get(tabId, function(tab) {
//                var page_url = tab.url;
//                if(isValidUrl(page_url)){
//                    chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
//                    chrome.browserAction.setBadgeText({tabId: tabId, text:"..."});            // checking the archives
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
//                            //var wb_url = "https://web.archive.org/save/";
//                            var wb_url = "https://web-beta.archive.org/save/";
//                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
//                            url = page_url.replace(pattern, "");
//                            open_url = wb_url+encodeURI(url);
//                            var xhr=new XMLHttpRequest();
//                            xhr.open('POST',open_url,true);
//                            //xhr.open('GET',open_url,true);
//                            xhr.setRequestHeader('Accept','application/json');
//                            xhr.onerror=function(){
//                                chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
//                                    console.error(page_url+' error unknown');
//                            };
//                            xhr.onload=function(){
//                                console.log(xhr.status);
//                                if(xhr.status==200){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"blue", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2713"});
//                                    console.error(page_url+'is saved now');
//                                }else if(xhr.status==403){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
//                                    console.error(page_url+' save is forbidden');
//                                }else if(xhr.status==503){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
//                                    console.error(page_url+' service unavailable');
//                                }else if(xhr.status==504){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u26d4"});
//                                    console.error(page_url+' gateway timeout');
//                                }
//                            };
//                            xhr.send();
//                        });
//                    });
//                }
//            });
//}
// chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){    
//    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
//        
//                  if (changeInfo.status == "complete" && !(tab.url.startsWith("http://web.archive.org/web") || tab.url.startsWith("https://web.archive.org/web") || tab.url.startsWith("https://web-beta.archive.org/web") || tab.url.startsWith("chrome://") )) {
//              chrome.storage.sync.get(['as'], function(items) {
//                
//              if(items.as){
//                auto_save(tab.id);
//              }
//            });
//            
//          }else{
//                    
//                    chrome.browserAction.setBadgeText({tabId: tabId, text:""});
//          }
// });
// });
// /*---------Auto-archival Feature added--------*/
// function handleIt(url){
//   var page_url=url;
// chrome.storage.sync.get(['auto_archive'],function(event){
//   if(event.auto_archive==true){
//     if(isValidUrl(page_url) && isValidSnapshotUrl(page_url)){
//       wmAvailabilityCheck(page_url,
//         function() {
//           console.log("Available already");
//         }, 
//         function() {
//           console.log("Not Available");
//           chrome.runtime.sendMessage({message:"showbutton",url:page_url});
//       });
//     }
//   }else{
//     console.log("Cant be Archived");
//   }
// });
// }
var tabIdAlexa,tabIdWhois,tabIdtwit,tabIdoverview,tabIdannotation,tabIdtest,tabIdsimilarweb,tabIdtagcloud,tabIdannotationurl;
chrome.tabs.onUpdated.addListener(function(tabId, info) {
  if (info.status == "complete") {
    chrome.tabs.get(tabId, function(tab) {
      var received_url = tab.url;
      if(!(received_url.includes("chrome://newtab/") || received_url.includes("chrome-extension://")||received_url.includes("alexa.com")||received_url.includes("whois.com")||received_url.includes("twitter.com"))){
        singlewindowurl=received_url;
        tagcloudurl=new URL(singlewindowurl);
        console.log(tagcloudurl.href);
        received_url = received_url.replace(/^https?:\/\//,'');
        var length =received_url.length; 
        var last_index=received_url.indexOf('/');
        var url=received_url.slice(0,last_index);  
        var open_url=received_url;
        if(open_url.slice(-1)=='/') open_url=received_url.substring(0,open_url.length-1);
        chrome.storage.sync.get(['auto_update_context'],function(event){
          if(event.auto_update_context==true){
            console.log("here");
            chrome.storage.sync.get(['show_context'],function(event1){
              if(event1.show_context=="tab"){
                console.log("here");
                if((tabId5!=0)||(tabId2!=0)||(tabId3!=0)||(tabId4!=0)||(windowIdtest!=0)){
                  chrome.tabs.query({
                    windowId: windowIdtest
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtest=tab1.id;
                    if((tab.id!=tabIdtest)&&(tab.id!=tabId2)&&(tab.id!=tabId3)&&(tab.id!=tabId4)&&(tab.id!=tabId5)&&(tab.id!=tabId6)){
                      if((tab1.url).includes("alexa")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("alexa.html")+"?url="+url});
                      }else if ((tab1.url).includes("whois")){
                        var whois_url="https://www.whois.com/whois/" + url;
                        chrome.tabs.update(parseInt(tabIdtest), {url:whois_url});
                      }else if((tab1.url).includes("twitter")){
                        var tweet_url="https://twitter.com/search?q="+open_url;
                        chrome.tabs.update(parseInt(tabIdtest), {url:tweet_url});
                      }else if((tab1.url).includes("overview")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("annotation")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("annotationURL")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                      }else if((tab1.url).includes("similarweb")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                      }else if((tab1.url).includes("tagcloud")){
                        chrome.tabs.update(parseInt(tabIdtest), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                      }
                      var whois_url="https://www.whois.com/whois/" + url;
                      chrome.tabs.update(parseInt(tabId2), {url:whois_url});
                      var tweet_url="https://twitter.com/search?q="+open_url;
                      chrome.tabs.update(parseInt(tabId3), {url:tweet_url});
                      chrome.tabs.update(parseInt(tabId4), {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId5), {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId8), {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                      chrome.tabs.update(parseInt(tabId6), {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                      chrome.tabs.update(parseInt(tabId7), {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                    }
                  }); 
                }
              }else if(event1.show_context=="singlewindow"){
                  chrome.tabs.query({
                    windowId: windowIdSingle
                  }, function(tabs) {
                    var tab=tabs[0];
                    chrome.tabs.update(tab.id, {url:chrome.runtime.getURL("singleWindow.html")+"?url="+singlewindowurl});
                  });
              }else{
                if((windowId1!=0)||(windowId2!=0)||(windowId3!=0)||(windowId4!=0)||(windowId5!=0)||(windowId6!=0)||(windowId7!=0)){
                  chrome.tabs.query({
                    windowId: windowId1
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdAlexa=tab1.id;
                  });  
                  chrome.tabs.query({
                    windowId: windowId2
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdWhois=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId3
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtwit=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId4
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdoverview=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId5
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdannotation=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId6
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdsimilarweb=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId7
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdtagcloud=tab1.id;
                  });
                  chrome.tabs.query({
                    windowId: windowId8
                  }, function(tabs) {
                    var tab1=tabs[0];
                    tabIdannotationurl=tab1.id;
                  });
                  if((tab.id!=tabIdAlexa)&&(tab.id!=tabIdWhois)&&(tab.id!=tabIdtwit)&&(tab.id!=tabIdoverview)&&(tab.id!=tabIdannotation)&&(tab.id!=tabIdsimilarweb)&&(tab.id!=tabIdtagcloud)&&(tab.id!=tabIdannotationurl)){
                    chrome.tabs.query({
                      windowId: windowId1
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("alexa.html")+"?url="+url});
                    });  
                    chrome.tabs.query({
                      windowId: windowId2
                    }, function(tabs) {
                      var tab1=tabs[0];
                      var whois_url="https://www.whois.com/whois/" +url;
                      chrome.tabs.update(tab1.id, {url:whois_url});
                    });
                    chrome.tabs.query({
                      windowId: windowId3
                    }, function(tabs) {
                      var tab1=tabs[0];
                      var tweet_url="https://twitter.com/search?q="+open_url;
                      chrome.tabs.update(tab1.id, {url:tweet_url});
                    });
                    chrome.tabs.query({
                      windowId: windowId4
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("overview.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId5
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("annotation.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId8
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("annotationURL.html")+"?url="+tab.url});
                    });
                    chrome.tabs.query({
                      windowId: windowId6
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("similarweb.html")+"?url="+url});
                    });
                    chrome.tabs.query({
                      windowId: windowId7
                    }, function(tabs) {
                      var tab1=tabs[0];
                      chrome.tabs.update(tab1.id, {url:chrome.runtime.getURL("tagcloud.html")+"?url="+tagcloudurl});
                    });
                  }
                }   
              }
            });
          }
        });
      }
      chrome.storage.sync.get(['auto_archive'],function(event){
        if(event.auto_archive==true){
          auto_save(tab.id);
        }else{
          console.log("Cant be Archived");
        }
      });
    });
  }
});

function auto_save(tabId){
  chrome.tabs.get(tabId, function(tab) {
    var page_url = tab.url;
    chrome.browserAction.setBadgeText({tabId: tabId, text:""});
    console.log(page_url);
    if(isValidUrl(page_url) && isValidSnapshotUrl(page_url)){
      if(!((page_url.includes("https://web.archive.org/web/")) || (page_url.includes("chrome://newtab")))){
        check_url(page_url,
          function() {
            console.log("Available already");
          }, 
          function() {
            console.log("Not Available");
            chrome.browserAction.setBadgeText({tabId: tabId, text:"S"});
            // console.log(tabId);
            // chrome.runtime.sendMessage({message: "checkProper",tabId:tabId},function(response) {
            //   console.log(response.message);
            // });
        });
      }
    }
  });
}

function check_url(url,onfound,onnotfound){
  var xhr=new XMLHttpRequest();
  var new_url="http://archive.org/wayback/available?url="+url;
  xhr.open("GET",new_url,true);
  xhr.send(null);
  xhr.onload = function() {
      var response = JSON.parse(xhr.response);
      if(response.archived_snapshots.closest){
        onfound();
      }else{
        onnotfound();
      }
  }
}

//function for opeing a particular context
function openThatContext(temp,url,methodOfShowing){
  var whois_url="https://www.whois.com/whois/" + url;
  var tweet_url="https://twitter.com/search?q="+url;

  if(methodOfShowing=='tab'){
    if(windowIdtest==0){
      if(temp=='alexa'){
        chrome.windows.create({url:chrome.runtime.getURL("alexa.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          //to add onremoved event listener
        });
      }else if(temp=='whois'){
        chrome.windows.create({url:whois_url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='tweets'){
        chrome.windows.create({url:tweet_url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='wbmsummary'){
        chrome.windows.create({url:chrome.runtime.getURL("overview.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='annotations'){
        chrome.windows.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='annotationsurl'){
        chrome.windows.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='similarweb'){
        chrome.windows.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }else if(temp=='tagcloud'){
        chrome.windows.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url, width:800, height:800, top:0, left:0, focused:true},function (win) {
          windowIdtest = win.id;
          chrome.windows.onRemoved.addListener(function (win1) {
            if(win1==windowIdtest){
              windowIdtest=0;
            }
          });
        });
      }
    }else{
      chrome.tabs.query({
        windowId: windowIdtest
      }, function(tabs) {
        if(temp=='alexa'){
          chrome.tabs.create({'url':chrome.runtime.getURL("alexa.html")+"?url="+url,'active':false},function(tab){
            tabId1=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId1){
                tabId1=0;
              }
            });
          });
        }else if(temp=='whois'){
          chrome.tabs.create({'url': whois_url,'active':false},function(tab){
            tabId2=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId2){
                tabId2=0;
              }
            });
          });
        }else if(temp=='tweets'){
          chrome.tabs.create({'url': tweet_url,'active':false},function(tab){
            tabId3=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId3){
                tabId3=0;
              }
            });
          });
        }else if(temp=='wbmsummary'){
          chrome.tabs.create({url:chrome.runtime.getURL("overview.html")+"?url="+url,'active':false},function(tab){
            tabId4=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId4){
                tabId4=0;
              }
            });
          });
        }else if(temp=='annotations'){
          chrome.tabs.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url,'active':false},function(tab){
            tabId5=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId5){
                tabId5=0;
              }
            });
          });  
        }else if(temp=='annotationsurl'){
          chrome.tabs.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url,'active':false},function(tab){
            tabId8=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId8){
                tabId8=0;
              }
            });
          });  
        }else if(temp=='similarweb'){
          chrome.tabs.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,'active':false},function(tab){
            tabId6=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId6){
                tabId6=0;
              }
            });
          });
        }else if(temp=='tagcloud'){
          chrome.tabs.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url,'active':false},function(tab){
            tabId7=tab.id;
            chrome.tabs.onRemoved.addListener(function (tabtest) {
              if(tabtest==tabId7){
                tabId7=0;
              }
            });
          });
        }
      });
    }
  }else if(methodOfShowing=='window'){
    if(temp=='alexa'){
      chrome.windows.create({url:chrome.runtime.getURL("alexa.html")+"?url="+url, width:500, height:500, top:0, left:0, focused:false},function (win) {
        windowId1 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId1){
            windowId1=0;
          }
        });
      });
    }else if(temp=='whois'){
      var whois_url="https://www.whois.com/whois/" +url;
      chrome.windows.create({url:whois_url, width:500, height:500, top:500, left:0, focused:false},function (win) {
        windowId2 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId2){
            windowId2=0;
          }                    
        });
      });
    }else if(temp=='tweets'){
      var tweet_url="https://twitter.com/search?q="+url;
      chrome.windows.create({url:tweet_url, width:500, height:500, top:0, left:500, focused:false},function (win) {
        windowId3 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId3){
            windowId3=0;
          }                    
        });
      });
    }else if(temp=='wbmsummary'){
      chrome.windows.create({url:chrome.runtime.getURL("overview.html")+"?url="+url,width:500, height:500, top:500, left:500, focused:false},function (win) {
        windowId4 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId4){
            windowId4=0;
          }            
        });
      });
    }else if(temp=='annotations'){
      chrome.windows.create({url:chrome.runtime.getURL("annotation.html")+"?url="+url,width:600, height:500, top:0, left:1000, focused:false},function (win) {
        windowId5 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId5){
            windowId5=0;
          }
        });
      });
    }else if(temp=='annotationsurl'){
      chrome.windows.create({url:chrome.runtime.getURL("annotationURL.html")+"?url="+url,width:600, height:500, top:0, left:1000, focused:false},function (win) {
        windowId8 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId8){
            windowId8=0;
          }
        });
      });
    }else if (temp=='similarweb'){
      chrome.windows.create({url:chrome.runtime.getURL("similarweb.html")+"?url="+url,width:600, height:500, top:0, left:1200, focused:false},function (win) {
        windowId6 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId6){
            windowId6=0;
          }
        });
      });
    }else if (temp=='tagcloud'){
      chrome.windows.create({url:chrome.runtime.getURL("tagcloud.html")+"?url="+url,width:600, height:500, top:500, left:1200, focused:false},function (win) {
        windowId7 = win.id;
        chrome.windows.onRemoved.addListener(function (win1) {
          if(win1==windowId7){
            windowId7=0;
          }
        });
      });
    }
  }
}